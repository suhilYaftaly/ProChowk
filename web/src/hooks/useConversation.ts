import {
  conversationOps,
  useDeleteConversation,
  useUserConversations,
} from "@/graphql/operations/conversation";
import {
  messageOps,
  useConversationMessages,
  useDeleteMessage,
} from "@/graphql/operations/message";
import { useUserStates } from "@/redux/reduxStates";
import {
  ConversationCreatedSubscriptionData,
  ConversationUpdatedData,
  MessagesData,
} from "@/types/types";
import { gql, useMutation, useSubscription } from "@apollo/client";
import {
  IConversationResponse,
  IParticipantResponse,
} from "../../../backend/src/types/commonTypes";
import { ObjectId } from "bson";

const useConversation = () => {
  const { userId } = useUserStates();

  const [markConversationAsRead, { loading: markAsReadLoading }] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(conversationOps.Mutations.markConversationAsRead);

  const { deleteConversationAsync } = useDeleteConversation();
  const {
    deleteMessageAsync,
    data: dmData,
    error: dmError,
  } = useDeleteMessage();

  const {
    conversationMessagesAsync,
    data: conversationMessages,
    loading: messagesLoading,
    error: messagesError,
  } = useConversationMessages();

  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    {
      id: string;
      attachment?: File;
      senderId: string;
      conversationId: string;
      body: string;
    }
  >(messageOps.Mutations.sendMessage);

  const subscibeToConversation = ({
    conversationId,
  }: {
    conversationId: string;
  }) => {
    useSubscription<ConversationUpdatedData>(
      conversationOps.Subscriptions.conversationUpdated,
      {
        onData: ({ client, data }) => {
          const { data: subscriptionData } = data;

          if (!subscriptionData || !subscriptionData.conversationUpdated)
            return;

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
  };

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

  const {
    userConversationsAsync,
    data,
    subscribeToMore,
    error,
    loading: conversationLoading,
  } = useUserConversations();

  const getUserConversations = () => {
    console.log(userId);
    if (userId) {
      userConversationsAsync({ variables: {} });
    }
  };

  // const data = client.readQuery({
  //   query: conversationOps.Queries.userConversations,
  // });

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

  const onDeleteConversation = async (conversationId: string) => {
    try {
      deleteConversationAsync({
        variables: {
          conversationId,
        },
      });
    } catch (error) {
      console.log("onDeleteConversation error", error);
    }
  };

  const onDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageAsync({
        variables: {
          id: messageId,
        },
      });
    } catch (error) {
      console.log("Delete message error", error);
    }
  };

  const getUserConversation = (conversationId: string, currentPage: number) => {
    try {
      if (conversationId) {
        conversationMessagesAsync({
          variables: { conversationId },
        });
      }
    } catch (err) {
      console.log(err);
    }
    console.log(data);
  };

  const getUserParticipantObject = (
    conversation: IConversationResponse,
    userId: string | undefined
  ) => {
    return conversation.participants.find(
      (p) => p.user.id === userId
    ) as IParticipantResponse;
  };

  const onSendMessage = async ({
    messageBody,
    attachment,
    conversationId,
    senderId,
    setMessageBody,
    firstName,
  }: {
    messageBody: string;
    attachment?: File;
    conversationId: string;
    senderId: string;
    setMessageBody: React.Dispatch<React.SetStateAction<string>>;
    firstName: string;
  }) => {
    try {
      const newId = new ObjectId().toString();
      const { data, errors } = await sendMessage({
        variables: {
          id: newId,
          body: messageBody,
          conversationId,
          senderId: senderId as string,
        },
        /**
         * Optimistically update UI
         */
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessageBody("");
          const existing = cache.readQuery<MessagesData>({
            query: messageOps.Queries.conversationMessages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: messageOps.Queries.conversationMessages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: newId,
                  attachmentId: null,
                  body: messageBody,
                  senderId: senderId as string,
                  conversationId,
                  sender: {
                    id: senderId as string,
                    name: firstName as string,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }
    } catch (error: any) {
      console.log("onSendMessage error", error);
    }
  };

  return {
    subscribeToMore,
    subscribeToNewConversations,
    onViewConversation,
    error,
    data,
    getUserConversations,
    subscibeToConversation,
    onDeleteConversation,
    getUserParticipantObject,
    markAsReadLoading,
    conversationMessagesAsync,
    conversationMessages,
    messagesLoading,
    conversationLoading,
    getUserConversation,
    messagesError,
    onSendMessage,
    onDeleteMessage,
    dmData,
    dmError,
  };
};

export default useConversation;
