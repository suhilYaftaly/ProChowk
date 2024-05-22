import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";

import {
  GQLContext,
  IMessageResponse,
  ISendMessageInput,
} from "../../types/commonTypes";
import { conversationPopulated } from "./conversation";
import { gqlError, userIsConversationParticipant } from "../../utils/funcs";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";

export default {
  Query: {
    messages: async (
      _: any,
      { conversationId }: { conversationId: string },
      context: GQLContext
    ): Promise<Array<IMessageResponse>> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated,
      });

      if (!conversation) {
        throw gqlError({ msg: "Conversation Not Found" });
      }

      const allowedToView = userIsConversationParticipant(
        conversation.participants,
        authUser.id
      );

      if (!allowedToView) {
        throw new Error("Not Authorized");
      }

      const messages = await prisma.message.findMany({
        where: {
          conversationId,
        },
        include: messagePopulated,
        orderBy: {
          createdAt: "desc",
        },
      });

      return messages;
    },
  },
  Mutation: {
    sendMessage: async (
      _: any,
      {
        id,
        conversationId,
        body,
        attachmentId,
        isSysGen,
      }: {
        id: string;
        conversationId: string;
        body: string;
        attachmentId: string;
        isSysGen: boolean;
      },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, pubsub, req } = context;
      const authUser = checkAuth(req);

      /**
       * Create new message entity
       */
      const newMessage = await prisma.message.create({
        data: {
          id,
          senderId: authUser.id,
          conversationId,
          body,
          attachmentId,
          isSystemGenerated: isSysGen,
        },
        include: messagePopulated,
      });

      /**
       * Could cache this in production
       */
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          userId: authUser.id,
          conversationId,
        },
      });

      /**
       * Should always exist
       */
      if (!participant) {
        throw gqlError({ msg: "Participant does not exist" });
      }

      const { id: participantId } = participant;

      /**
       * Update conversation latestMessage
       */
      const conversation = await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          latestMessageId: newMessage.id,
          participants: {
            update: {
              where: {
                id: participantId,
              },
              data: {
                hasSeenLatestMessages: true,
              },
            },
            updateMany: {
              where: {
                NOT: {
                  userId: authUser.id,
                },
              },
              data: {
                hasSeenLatestMessages: false,
              },
            },
          },
        },
        include: conversationPopulated,
      });

      pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });
      pubsub.publish("CONVERSATION_UPDATED", {
        conversationUpdated: {
          conversation,
        },
      });

      return true;
    },
    deleteMessage: async (
      _: any,
      { id }: { id: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, pubsub, req } = context;
      const authUser = checkAuth(req);
      /**
       * Create new message entity
       */
      const message = await prisma.message.findFirst({
        where: { id },
      });

      canUserUpdate({
        id: message?.senderId!,
        authUser,
        message: "You can't delete someone else message",
      });

      await prisma.message.delete({
        where: { id },
      });

      pubsub.publish("MESSAGE_DELETED", { message });
      return true;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        (
          payload: MessageSubscriptionPayload,
          args: { conversationId: string },
          context: GQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
    messageDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["MESSAGE_DELETED"]);
        },
        (
          payload: MessageSubscriptionPayload,
          args: { conversationId: string },
          context: GQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export interface MessageSubscriptionPayload {
  messageSent: IMessageResponse;
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      name: true,
    },
  },
});
