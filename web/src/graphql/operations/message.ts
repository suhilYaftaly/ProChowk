import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { messageFields } from "../gqlFrags";
import { asyncOps } from "./gqlFuncs";
import { IUser } from "./user";

export const messageOps = {
  Queries: {
    conversationMessages: gql`query UserConversations($conversationId: String) {
      messages(conversationId: $conversationId) {
        ${messageFields}
      }
    }`,
  },
  Mutations: {
    sendMessage: gql`
      mutation SendMessage(
        $id: String!
        $conversationId: String!
        $body: String!
      ) {
        sendMessage(id: $id, conversationId: $conversationId, body: $body)
      }
    `,
    deleteMessage: gql`
      mutation DeleteMessage($id: ID!) {
        deleteMessage(id: $id)
      }
    `,
  },
  Subscriptions: {
    messageSent: gql`
      subscription MessageSent($conversationId: String!) {
        messageSent(conversationId: $conversationId) {
          ${messageFields}
        }
      }
    `,
    messageDeleted: gql`
      subscription MessageDeleted($conversationId: String!) {
        messageDeleted(conversationId: $conversationId) {
          ${messageFields}
        }
      }
    `,
  },
};

//TYPES
export type TMessage = {
  id: string;
  body: string;
  conversationId: string;
  senderId: string;
  sender: IUser;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
};

//OPERATIONS
//conversations OP
type TConversationMessagesData = {
  messages: { totalCount?: number; messages: TMessage[] };
};
type TConversationMessagesInput = {
  conversationId: string;
};
type TConversationMessageAsync = {
  variables: TConversationMessagesInput;
  onSuccess?: (data: TConversationMessagesData["messages"]) => void;
  onError?: (error?: any) => void;
};
export const useConversationMessages = () => {
  const [conversationMessages, { data, loading, error }] = useLazyQuery<
    TConversationMessagesData,
    TConversationMessagesInput
  >(messageOps.Queries.conversationMessages, {
    fetchPolicy: "network-only",
  });

  const conversationMessagesAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TConversationMessageAsync) =>
    asyncOps({
      operation: () => conversationMessages({ variables }),
      onSuccess: (dt: TConversationMessagesData) =>
        onSuccess && onSuccess(dt.messages),
      onError,
    });

  return {
    conversationMessagesAsync,
    data,
    loading,
    error,
  };
};

export const useDeleteMessage = () => {
  const [deleteMessage, { data, loading, error }] = useMutation<
    boolean,
    { id: string }
  >(messageOps.Mutations.deleteMessage);

  const deleteMessageAsync = async ({
    variables,
    onSuccess,
    onError,
  }: DMAsync) =>
    asyncOps({
      operation: () => deleteMessage({ variables }),
      onSuccess: (dt: boolean) => {
        onSuccess && onSuccess(dt);
      },
      onError,
    });

  return { deleteMessageAsync, data, loading, error };
};

type DMAsync = {
  variables: { id: string };
  onSuccess?: (data: boolean) => void;
  onError?: (error?: any) => void;
};
