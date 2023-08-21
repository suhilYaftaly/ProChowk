import { gql } from "graphql-tag";

export default gql`
  type Query {
    user(id: ID!): User!
    users: [User!]!
    isUserEmailVerified(id: ID!): Boolean!
  }

  type Mutation {
    registerUser(name: String!, password: String!, email: String!): User!
    loginUser(email: String!, password: String!): User!
    googleLogin(accessToken: String!): User!
    googleOneTapLogin(credential: String!): User!
    updateUser(id: ID!, edits: UpdateUserInput!): User!
    verifyEmail(token: String!): String!
    sendVerificationEmail(email: String!): Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    emailVerified: Boolean
    createdAt: String!
    updatedAt: String!
    phoneNum: String
    bio: String
    provider: Provider
    roles: [Role]
    userTypes: [UserType]
    image: UserImage
    address: Address
    token: String
    contractor: Contractor
  }
  type UserImage {
    id: ID
    url: String!
    name: String
    size: Float
    type: String
    createdAt: String
    updatedAt: String
  }

  input UserImageInput {
    url: String!
    name: String!
    size: Float!
    type: String!
  }
  input UpdateUserInput {
    name: String
    phoneNum: String
    image: UserImageInput
    address: AddressInput
    bio: String
    userTypes: [UserType!]
  }

  enum Role {
    user
    admin
    superAdmin
  }
  enum Provider {
    Google
    Credentials
  }
  enum UserType {
    client
    contractor
  }
`;
