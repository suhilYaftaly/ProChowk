import { gql } from "graphql-tag";

export default gql`
  type Image {
    picture: String
  }
  type User {
    id: ID!
    name: String!
    email: String!
    emailVerified: Boolean
    token: String!
    createdAt: String!
    updatedAt: String!
    image: Image
    provider: String
    roles: [String]
  }
  type Mutation {
    registerUser(
      name: String!
      password: String!
      # confirmPassword: String!
      email: String!
    ): User!
    loginUser(email: String!, password: String!): User!
    googleLogin(accessToken: String!): User!
    googleOneTapLogin(credential: String!): User!
  }

  type Query {
    searchUser(email: String!): User!
  }
`;
