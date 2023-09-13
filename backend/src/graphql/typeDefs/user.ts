import { gql } from "graphql-tag";

export default gql`
  type Query {
    user(id: ID!): User!
    users: [User!]!
  }

  type Mutation {
    registerUser(name: String!, password: String!, email: String!): User!
    loginUser(email: String!, password: String!): User!
    googleLogin(accessToken: String!): User!
    googleOneTapLogin(credential: String!): User!
    updateUser(id: ID!, edits: UpdateUserInput!): User!
    sendVerificationEmail(email: String!): Boolean!
    verifyEmail(token: String!): String!
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): User!
    validateRefreshToken(refreshToken: String!): ValidateRefreshToken!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    emailVerified: Boolean
    phoneNum: String
    bio: String
    createdAt: String!
    updatedAt: String!
    provider: Provider
    roles: [Role]
    userTypes: [UserType]
    image: UserImage
    address: Address
    token: String
    refreshToken: String
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
  type ValidateRefreshToken {
    accessToken: String!
    refreshToken: String!
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
    dev
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
