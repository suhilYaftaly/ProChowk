import { gql } from "graphql-tag";

export default gql`
  type Query @rateLimit(limit: 60, duration: 60) {
    user(id: ID!): User!
    users: [User!]!
  }

  type Mutation @rateLimit(limit: 20, duration: 60) {
    registerUser(name: String!, password: String!, email: String!): User!
      @rateLimit(limit: 5, duration: 300)
    loginUser(email: String!, password: String!): User!
      @rateLimit(limit: 5, duration: 300)
    googleLogin(accessToken: String!): User! @rateLimit(limit: 5, duration: 300)
    googleOneTapLogin(credential: String!): User!
      @rateLimit(limit: 5, duration: 300)
    updateUser(id: ID!, edits: UpdateUserInput!): User!
    sendVerificationEmail(email: String!): Boolean!
      @rateLimit(limit: 5, duration: 86400) #5 calls per day
    verifyEmail(token: String!): String! @rateLimit(limit: 5, duration: 3600) #per hour
    requestPasswordReset(email: String!): Boolean!
      @rateLimit(limit: 5, duration: 86400) #5 calls per day
    resetPassword(token: String!, newPassword: String!): User!
      @rateLimit(limit: 5, duration: 3600) #per hour
    validateRefreshToken(refreshToken: String!): ValidateRefreshToken!
      @rateLimit(limit: 60)
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
