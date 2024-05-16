import { useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import {
  ConversationCreatedSubscriptionData,
  ConversationDeletedData,
  ConversationsData,
  ConversationUpdatedData,
  MessagesData,
} from "../../../types/types";
import { useParams } from "react-router-dom";
import { conversationOps } from "@/graphql/operations/conversation";
import { messageOps } from "@/graphql/operations/message";
import { useUserStates } from "@/redux/reduxStates";
import ConversationList from "./ConversationList";

const ConversationsWrapper = () => {
  const { conversationId } = useParams();
  const { userId } = useUserStates();

  useSubscription<ConversationUpdatedData>(
    conversationOps.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData || !subscriptionData.conversationUpdated) return;

        const {
          conversationUpdated: {
            conversation: updatedConversation,
            addedUserIds,
            removedUserIds,
          },
        } = subscriptionData;

        const { id: updatedConversationId, latestMessage } =
          updatedConversation;

        /**
         * Check if user is being removed
         */

        if (removedUserIds && removedUserIds.length) {
          const isBeingRemoved = removedUserIds.find((id) => id === userId);

          if (isBeingRemoved) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: conversationOps.Queries.userConversations,
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: conversationOps.Queries.userConversations,
              data: {
                conversations: conversationsData.conversations.filter(
                  (c) => c.id !== updatedConversationId
                ),
              },
            });

            // if (conversationId === updatedConversationId) {
            //   router.replace(
            //     typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
            //       ? process.env.NEXT_PUBLIC_BASE_URL
            //       : ""
            //   );
            // }

            /**
             * Early return - no more updates required
             */
            return;
          }
        }

        /**
         * Check if user is being added to conversation
         */
        if (addedUserIds && addedUserIds.length) {
          const isBeingAdded = addedUserIds.find((id) => id === userId);

          if (isBeingAdded) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: conversationOps.Queries.userConversations,
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: conversationOps.Queries.userConversations,
              data: {
                conversations: [
                  ...(conversationsData.conversations || []),
                  updatedConversation,
                ],
              },
            });
          }
        }

        /**
         * Already viewing conversation where
         * new message is received; no need
         * to manually update cache due to
         * message subscription
         */
        if (updatedConversationId === conversationId) {
          onViewConversation(conversationId, false);
          return;
        }

        const existing = client.readQuery<MessagesData>({
          query: messageOps.Queries.conversationMessages,
          variables: { conversationId: updatedConversationId },
        });

        if (!existing) return;

        /**
         * Check if lastest message is already present
         * in the message query
         */
        const hasLatestMessage = existing.messages.find(
          (m) => m.id === latestMessage.id
        );

        /**
         * Update query as re-fetch won't happen if you
         * view a conversation you've already viewed due
         * to caching
         */
        if (!hasLatestMessage) {
          client.writeQuery<MessagesData>({
            query: messageOps.Queries.conversationMessages,
            variables: { conversationId: updatedConversationId },
            data: {
              ...existing,
              messages: [latestMessage, ...existing.messages],
            },
          });
        }
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    // router.push({ query: { conversationId } });

    /**
     * Only mark as read if conversation is unread
     */
    if (hasSeenLatestMessage) return;

    try {
    } catch (error) {
      console.log("onViewConversation error", error);
    }
  };

  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData>(conversationOps.Queries.userConversations, {
    onError: ({ message }) => {
      console.log(message);
    },
  });

  useSubscription<ConversationDeletedData>(
    conversationOps.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: conversationOps.Queries.userConversations,
        });

        if (!existing) return;

        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: conversationOps.Queries.userConversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });
      },
    }
  );

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: conversationOps.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        console.log(newConversation);
        console.log(prev);
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  if (conversationsError) {
    console.log("There was an error fetching conversations");
    return null;
  }
  console.log(conversationsData);
  return (
    <ConversationList
      conversations={conversationsData?.conversations.conversations || []}
      onViewConversation={onViewConversation}
    />
  );
};
export default ConversationsWrapper;
