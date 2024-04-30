import { gql } from "graphql-tag";

export default gql`
  type Conversation {
    id: String!
    participants: [ConversationParticipant]!
    messages: [Message]!
  }

  type ConversationParticipant {
    id: String!
    user: User!
    hasSeenLatestMessages: Boolean!
  }

  type CreateConversationResponse {
    conversationId: String
  }

  type ConversationDeletedResponse {
    id: String
  }

  type Query {
    conversations(page: Int, pageSize: Int): [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
    deleteConversation(conversationId: String!): Boolean
    updateParticipants(
      conversationId: String!
      participantIds: [String]!
    ): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
    conversationUpdated: ConversationUpdatedSubscriptionPayload
    conversationDeleted: ConversationDeletedResponse
  }
`;
