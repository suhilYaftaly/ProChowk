import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: String
    username: String
  }

  type Query {
    searchUsers(username: String): [User]
  }

  type Mutation {
    createUsername(username: String): CreateUserNameResponse
  }

  type CreateUserNameResponse {
    success: Boolean
    error: String
  }
`;
