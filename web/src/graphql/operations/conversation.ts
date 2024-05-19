import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { conversationFields } from "../gqlFrags";
import { asyncOps } from "./gqlFuncs";
import { TMessage } from "./message";
import { ConversationsData } from "@/types/types";
import {
  IConversationResponse,
  IParticipantResponse,
} from "../../../../backend/src/types/commonTypes";

export const conversationOps = {
  Queries: {
    userConversations: gql`query UserConversations {
      conversations {
        totalCount 
        conversations {${conversationFields}}
      }
    }`,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: ID!) {
        deleteConversation(conversationId: $conversationId) {
          id
        }
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${conversationFields}
        }
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            ${conversationFields}
          }
          addedUserIds
          removedUserIds
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
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

type TUserConversationsInput = {
  page?: number;
  pageSize?: number;
};
type TUserConversationsAsync = {
  variables: TUserConversationsInput;
  onSuccess?: (data: ConversationsData["conversations"]) => void;
  onError?: (error?: any) => void;
};
export const useUserConversations = () => {
  const [userConversations, { data, loading, error, subscribeToMore }] =
    useLazyQuery<ConversationsData, TUserConversationsInput>(
      conversationOps.Queries.userConversations,
      {
        fetchPolicy: "network-only",
      }
    );

  const userConversationsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TUserConversationsAsync) =>
    asyncOps({
      operation: () => userConversations({ variables }),
      onSuccess: (dt: ConversationsData) =>
        onSuccess && onSuccess(dt.conversations),
      onError,
    });

  return {
    userConversationsAsync,
    data,
    loading,
    error,
    subscribeToMore,
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

type DCAsync = {
  variables: TMNARInput;
  onSuccess?: (data: boolean) => void;
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

export const useDeleteConversation = () => {
  const [deleteConversation, { data, loading, error }] = useMutation<
    boolean,
    TMNARInput
  >(conversationOps.Mutations.deleteConversation);

  const deleteConversationAsync = async ({
    variables,
    onSuccess,
    onError,
  }: DCAsync) =>
    asyncOps({
      operation: () => deleteConversation({ variables }),
      onSuccess: (dt: boolean) => {
        onSuccess && onSuccess(dt);
      },
      onError,
    });

  return { deleteConversationAsync, data, loading, error };
};

export const getUserParticipantObject = (
  conversation: IConversationResponse,
  userId: string | undefined
) => {
  return conversation.participants.find(
    (p) => p.user.id === userId
  ) as IParticipantResponse;
};
