import gql from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
    conversationId: String
    senderId: String
    attachmentId: String
    isSystemGenerated: Boolean
    updatedAt: Date
  }

  input SendMessageInput {
    conversationId: String
    body: String
    attachmentId: String
  }

  type Query {
    messages(conversationId: String): [Message]
  }

  type Mutation {
    sendMessage(
      id: String!
      conversationId: String!
      body: String!
      attachmentId: String
      isSysGen: Boolean
    ): Boolean
    deleteMessage(id: ID!): Boolean
  }

  type Subscription {
    messageSent(conversationId: String): Message
    messageDeleted(conversationId: String): Message
  }
`;

export default typeDefs;
