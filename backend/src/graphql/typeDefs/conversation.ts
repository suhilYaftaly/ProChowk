import { gql } from "graphql-tag";

export default gql`
  type Query {
    conversations(userId: ID!, page: Int, pageSize: Int): [Conversation!]!
    conversation(id: ID!): Conversation!
  }

  type Mutation {
    createConversation(conversationInput: ConversationInput): Conversation!
    updateConversation(
      id: ID!
      conversationInput: ConversationInput
    ): Conversation!
    deleteConversation(id: ID!): Conversation!
  }

  type Conversation {
    name: String!
    type: ConversationType!
    participants: [ConversationParticipant]!
    messages: [Message]!
  }

  type ConversationParticipant {
    userId: String!
    user: User!
    conversationId: String!
    conversation: Conversation!
    hasSeenLatestMessages: Boolean!
  }

  input ConversationInput {
    name: String!
    type: ConversationType!
    participantIds: [ID!]!
  }

  enum ConversationType {
    OneToOne
    Group
  }
`;
