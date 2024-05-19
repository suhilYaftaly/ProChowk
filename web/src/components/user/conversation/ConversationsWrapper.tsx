import { gql, useMutation, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import {
  ConversationCreatedSubscriptionData,
  ConversationUpdatedData,
  MessagesData,
} from "../../../types/types";
import { useParams } from "react-router-dom";
import {
  conversationOps,
  useUserConversations,
} from "@/graphql/operations/conversation";
import { messageOps } from "@/graphql/operations/message";
import { useUserStates } from "@/redux/reduxStates";
import ConversationList from "./ConversationList";
import { IParticipantResponse } from "../../../../../backend/src/types/commonTypes";

const ConversationsWrapper = () => {
  const { conversationId } = useParams();
  const { userId } = useUserStates();

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(conversationOps.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData>(
    conversationOps.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData || !subscriptionData.conversationUpdated) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        const { id: updatedConversationId, latestMessage } =
          updatedConversation;

        /**
         * Already viewing conversation where
         * new message is received; no need
         * to manually update cache due to
         * message subscription
         */
        console.log("Message read");
        if (updatedConversationId === conversationId) {
          onViewConversation(conversationId, false);
          // dispatch(setUnreadConsToRead());
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
      if (!userId) return;
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants
           * from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<IParticipantResponse>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    name
                  }
                  hasSeenLatestMessages
                }
              }
            `,
          });

          if (!participantsFragment) return;

          /**
           * Create copy to
           * allow mutation
           */
          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          /**
           * Should always be found
           * but just in case
           */
          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];
          /**
           * Update user to show latest
           * message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessages: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log("onViewConversation error", error);
    }
  };

  // const {
  //   data: conversationsData,
  //   loading: conversationsLoading,
  //   error: conversationsError,
  //   subscribeToMore,
  // } = useQuery<ConversationsData>(conversationOps.Queries.userConversations, {
  //   onError: ({ message }) => {
  //     console.log(message);
  //   },
  // });

  const { userConversationsAsync, data, subscribeToMore, error } =
    useUserConversations();

  const getUserConversations = () => {
    console.log(userId);
    if (userId) {
      userConversationsAsync({ variables: {} });
    }
  };

  // const data = client.readQuery({
  //   query: conversationOps.Queries.userConversations,
  // });

  useEffect(() => getUserConversations(), [userId]);

  // useSubscription<ConversationDeletedData>(
  //   conversationOps.Subscriptions.conversationDeleted,
  //   {
  //     onData: ({ client, data }) => {
  //       const { data: subscriptionData } = data;

  //       if (!subscriptionData) return;

  //       const existing = client.readQuery<ConversationsData>({
  //         query: conversationOps.Queries.userConversations,
  //       });

  //       if (!existing) return;

  //       const { conversations } = existing;
  //       const {
  //         conversationDeleted: { id: deletedConversationId },
  //       } = subscriptionData;

  //       client.writeQuery<ConversationsData>({
  //         query: conversationOps.Queries.userConversations,
  //         data: {
  //           conversations: conversations.filter(
  //             (conversation) => conversation.id !== deletedConversationId
  //           ),
  //         },
  //       });
  //     },
  //   }
  // );

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

  if (error) {
    console.log("There was an error fetching conversations");
    return null;
  }
  console.log(data);
  return (
    <ConversationList
      conversations={data?.conversations?.conversations || []}
      onViewConversation={onViewConversation}
    />
  );
};
export default ConversationsWrapper;
