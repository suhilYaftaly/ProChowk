import { gql } from "graphql-tag";

export default gql`
  type Query {
    searchUser(id: ID!): User!
    searchAllUsers: [User!]!
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
    updateUser(
      id: ID!
      name: String
      phoneNum: String
      image: ImageInput
      address: AddressInput
      bio: String
      userType: String
    ): User!
    getUserAddress(id: ID!, lat: String!, lng: String!): User!
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
    phoneNum: String
    address: Address
    bio: String
    userType: [String]
  }

  type Image {
    picture: String
  }
  input ImageInput {
    picture: String
    name: String
    size: Float
    type: String
  }

  type Address {
    houseNum: String
    road: String
    neighbourhood: String
    city: String
    municipality: String
    region: String
    province: String
    postalCode: String
    country: String
    countryCode: String
    displayName: String
    lat: Float
    lng: Float
  }
  input AddressInput {
    houseNum: String
    road: String
    neighbourhood: String
    city: String
    municipality: String
    region: String
    province: String
    postalCode: String
    country: String
    countryCode: String
    displayName: String
    lat: Float
    lng: Float
  }
`;
