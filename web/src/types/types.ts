import {
  IConversationResponse,
  IMessageResponse,
} from "../../../backend/src/types/commonTypes";

/**
 * Users
 */
export interface CreateUsernameVariables {
  username: string;
}

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface SearchUsersInputs {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

/**
 * Messages
 */
export interface MessagesData {
  messages: Array<IMessageResponse>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface SendMessageVariables {
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessagesSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: IMessageResponse;
    };
  };
}

/**
 * Conversations
 */
export interface CreateConversationData {
  createConversation: string;
}

export interface ConversationsData {
  conversations: Array<IConversationResponse>;
}

export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: IConversationResponse;
    };
  };
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: Omit<IConversationResponse, "latestMessage"> & {
      latestMessage: IMessageResponse;
    };
    addedUserIds: Array<string> | null;
    removedUserIds: Array<string> | null;
  };
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}
