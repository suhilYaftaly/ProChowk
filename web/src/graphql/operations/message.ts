import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { conversationFields } from "../gqlFrags";
import { asyncOps } from "./gqlFuncs";
import { TConversation } from "./conversation";

const conversationOps = {
  Queries: {
    userConversations: gql`query UserConversations($page: Int, $pageSize: Int) {
      conversations(page: $page, pageSize: $pageSize) {
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
export type TMessage = {
  id: string;
  body: string;
  conversationId: string;
  senderId: string;
  isLatestIn: boolean;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
};

//OPERATIONS
//conversations OP
type TUserConversationsData = {
  conversations: { totalCount?: number; conversations: TConversation[] };
};
type TUserConversationsInput = {
  page?: number;
  pageSize?: number;
};
type TUserConversationsAsync = {
  variables: TUserConversationsInput;
  onSuccess?: (data: TUserConversationsData["conversations"]) => void;
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
        onSuccess && onSuccess(dt.conversations),
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
