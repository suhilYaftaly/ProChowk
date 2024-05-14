import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { conversationFields } from "../gqlFrags";
import { asyncOps } from "./gqlFuncs";
import { TMessage } from "./message";

const conversationOps = {
  Queries: {
    userConversations: gql`query UserConversations {
      latestConversations {
        totalCount 
        conversations {${conversationFields}}
      }
    }`,
  },
  Mutations: {
    markConversationAsRead: gql`mutation MarkConversationAsRead($conversationId: ID!) {
        markConversationAsRead(conversationId: $conversationId) {${conversationFields}}
      }`,
  },
};

//TYPES
export type TConversation = {
  id: string;
  name?: string;
  messages: TMessage[];
  latestMessage: TMessage;
  latestMessageId: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

//OPERATIONS
//conversations OP
type TUserConversationsData = {
  latestConversations: { totalCount?: number; conversations: TConversation[] };
};
type TUserConversationsInput = {
  page?: number;
  pageSize?: number;
};
type TUserConversationsAsync = {
  variables: TUserConversationsInput;
  onSuccess?: (data: TUserConversationsData["latestConversations"]) => void;
  onError?: (error?: any) => void;
};
export const useUserConversations = () => {
  const [userConversations, { data, loading, error }] = useLazyQuery<
    TUserConversationsData,
    TUserConversationsInput
  >(conversationOps.Queries.userConversations, {
    fetchPolicy: "network-only",
  });

  const userConversationsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TUserConversationsAsync) =>
    asyncOps({
      operation: () => userConversations({ variables }),
      onSuccess: (dt: TUserConversationsData) =>
        onSuccess && onSuccess(dt.latestConversations),
      onError,
    });

  return {
    userConversationsAsync,
    data,
    loading,
    error,
  };
};

//markConversationAsRead OP
type TMNARData = { markConversationAsRead: TConversation };
type TMNARInput = { conversationId: string };
type TMNARAsunc = {
  variables: TMNARInput;
  onSuccess?: (data: TMNARData["markConversationAsRead"]) => void;
  onError?: (error?: any) => void;
};
export const useMarkConversationAsRead = () => {
  const [markConversationAsRead, { data, loading, error }] = useMutation<
    TMNARData,
    TMNARInput
  >(conversationOps.Mutations.markConversationAsRead);

  const markConversationAsReadAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TMNARAsunc) =>
    asyncOps({
      operation: () => markConversationAsRead({ variables }),
      onSuccess: (dt: TMNARData) => {
        onSuccess && onSuccess(dt.markConversationAsRead);
      },
      onError,
    });

  return { markConversationAsReadAsync, data, loading, error };
};
