import { gql, useLazyQuery } from "@apollo/client";
import { messageFields } from "../gqlFrags";
import { asyncOps } from "./gqlFuncs";
import { IUser } from "./user";

const messageOps = {
  Queries: {
    conversationMessages: gql`query UserConversations($conversationId: String) {
      messages(conversationId: $conversationId) {
        ${messageFields}
      }
    }`,
  },
};

//TYPES
export type TMessage = {
  id: string;
  body: string;
  conversationId: string;
  senderId: string;
  sender: IUser;
  isLatestIn: boolean;
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
