import gql from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

  input SendMessageArguments {
    id: String
    conversationId: String
    senderId: String
    body: String
    imageId: String
  }

  type Query {
    messages(conversationId: String): [Message]
  }

  type Mutation {
    sendMessage(args: SendMessageArguments): Boolean
  }

  type Subscription {
    messageSent(conversationId: String): Message
  }
`;

export default typeDefs;
