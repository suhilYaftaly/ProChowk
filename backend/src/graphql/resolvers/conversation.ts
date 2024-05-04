import { Conversation, Notification, Prisma } from "@prisma/client";
import { z } from "zod";

import {
  ConversationCreatedSubscriptionPayload,
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionData,
  GQLContext,
} from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError, userIsConversationParticipant } from "../../utils/funcs";
import { withFilter } from "graphql-subscriptions";

export default {
  Query: {
    conversations: async (
      _: any,
      { page = 1, pageSize = 50 }: ConversationsInput,
      context: GQLContext
    ): Promise<{
      totalCount: number;
      conversations: ConversationPopulated[];
    }> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const skip = (page - 1) * pageSize;
      // const userId = authUser.id;
      const userConversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: {
                equals: authUser.id,
              },
            },
          },
        },
        include: conversationPopulated,
        take: pageSize,
        skip,
      });

      const totalCount = await prisma.conversation.count({
        where: {
          participants: {
            some: {
              userId: {
                equals: authUser.id,
              },
            },
          },
        },
      });

      return {
        conversations: userConversations,
        totalCount,
      };
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      { participantIds }: { participantIds: Array<string> },
      context: GQLContext
    ): Promise<string> => {
      const { prisma, pubsub, req } = context;
      const authUser = checkAuth(req);

      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: participantIds.map((id) => ({
                userId: id,
                hasSeenLatestMessages: id === authUser.id,
              })),
            },
          },
        },
        include: conversationPopulated,
      });

      pubsub.publish("CONVERSATION_CREATED", {
        conversationCreated: conversation,
      });

      return conversation.id;
    },
    markConversationAsRead: async (
      _: any,
      { userId, conversationId }: { userId: string; conversationId: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      // Authorization check: ensure the user is allowed to perform this action
      canUserUpdate({ id: userId, authUser });

      await prisma.conversationParticipant.updateMany({
        where: {
          userId,
          conversationId,
        },
        data: {
          hasSeenLatestMessages: true,
        },
      });

      return true;
    },
    deleteConversation: async (
      _: any,
      { conversationId }: { conversationId: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, pubsub, req } = context;
      const authUser = checkAuth(req);

      const [deletedConversation] = await prisma.$transaction([
        prisma.conversation.delete({
          where: {
            id: conversationId,
          },
          include: conversationPopulated,
        }),
        prisma.conversationParticipant.deleteMany({
          where: {
            conversationId,
          },
        }),
        prisma.message.deleteMany({
          where: {
            conversationId,
          },
        }),
      ]);

      pubsub.publish("CONVERSATION_DELETED", {
        conversationDeleted: deletedConversation,
      });

      return true;
    },
    updateParticipants: async (
      _: any,
      args: { conversationId: string; participantIds: Array<string> },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, pubsub, req } = context;
      const { conversationId, participantIds } = args;

      const authUser = checkAuth(req);

      const participants = await prisma.conversationParticipant.findMany({
        where: {
          conversationId,
        },
      });

      const existingParticipants = participants.map((p) => p.userId);

      const participantsToDelete = existingParticipants.filter(
        (id) => !participantIds.includes(id)
      );

      const participantsToCreate = participantIds.filter(
        (id) => !existingParticipants.includes(id)
      );

      const transactionStatements = [
        prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            participants: {
              deleteMany: {
                userId: {
                  in: participantsToDelete,
                },
                conversationId,
              },
            },
          },
          include: conversationPopulated,
        }),
      ];

      if (participantsToCreate.length) {
        transactionStatements.push(
          prisma.conversation.update({
            where: {
              id: conversationId,
            },
            data: {
              participants: {
                createMany: {
                  data: participantsToCreate.map((id) => ({
                    userId: authUser.id,
                    hasSeenLatestMessages: true,
                  })),
                },
              },
            },
            include: conversationPopulated,
          })
        );
      }

      const [deleteUpdate, addUpdate] = await prisma.$transaction(
        transactionStatements
      );

      pubsub.publish("CONVERSATION_UPDATED", {
        conversationUpdated: {
          conversation: addUpdate || deleteUpdate,
          addedUserIds: participantsToCreate,
          removedUserIds: participantsToDelete,
        },
      });

      return true;
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator("CONVERSATION_CREATED");
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _: any,
          context: GQLContext
        ) => {
          const { pubsub, req } = context;
          const authUser = checkAuth(req);

          const {
            conversationCreated: { participants },
          } = payload;

          return userIsConversationParticipant(participants, authUser.id);
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        },
        (
          payload: ConversationUpdatedSubscriptionData,
          _,
          context: GQLContext
        ) => {
          const { req } = context;
          const authUser = checkAuth(req);

          const {
            conversationUpdated: {
              conversation: { participants },
              addedUserIds,
              removedUserIds,
            },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            authUser.id
          );

          const userSentLatestMessage =
            payload.conversationUpdated.conversation.latestMessage?.senderId ===
            authUser.id;

          const userIsBeingRemoved =
            removedUserIds &&
            Boolean(removedUserIds.find((id) => id === authUser.id));

          return (
            (userIsParticipant && !userSentLatestMessage) ||
            userSentLatestMessage ||
            userIsBeingRemoved
          );
        }
      ),
    },
    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
        },
        (
          payload: ConversationDeletedSubscriptionPayload,
          _,
          context: GQLContext
        ) => {
          const { req } = context;
          const authUser = checkAuth(req);

          const {
            conversationDeleted: { participants },
          } = payload;

          return userIsConversationParticipant(participants, authUser.id);
        }
      ),
    },
  },
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        name: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  });

const ConversationsInputSchema = z.object({
  userId: z.string().length(24),
  name: z.string(),
  participantIds: z.string().array(),
  page: z.number(),
  pageSize: z.number(),
});

type ConversationsInput = z.infer<typeof ConversationsInputSchema>;
