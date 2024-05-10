import gql from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

  input SendMessageInput {
    conversationId: String
    body: String
    imageId: String
  }

  type Query {
    messages(conversationId: String): [Message]
  }

  type Mutation {
    sendMessage(conversationInput: SendMessageInput): Boolean
    deleteMessage(id: ID!): Boolean
  }

  type Subscription {
    messageSent(conversationId: String): Message
    messageDeleted(conversationId: String): Message
  }
`;

export default typeDefs;
