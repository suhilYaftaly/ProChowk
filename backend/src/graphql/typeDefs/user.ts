import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: ID!
    name: ID!
    email: String!
    emailVerified: Boolean
    token: String!
    createdAt: String!
    updatedAt: String!
    image: String
  }
  type Mutation {
    registerUser(
      name: String!
      password: String!
      confirmPassword: String!
      email: String!
    ): User!
    loginUser(email: String!, password: String!): User!
  }

  type Query {
    searchUser(email: String!): User!
  }
`;
