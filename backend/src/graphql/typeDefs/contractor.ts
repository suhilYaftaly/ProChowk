import { gql } from "graphql-tag";

export default gql`
  type Query {
    contractor(id: ID, userId: ID): Contractor!
    contractorsByLocation(
      latLng: LatLngInput!
      radius: Float
      page: Int
      pageSize: Int
    ): ContsSearchResponse
    contractorsByText(
      input: String!
      latLng: LatLngInput!
      radius: Float
      page: Int
      pageSize: Int
    ): ContsSearchResponse
  }
  type Mutation {
    createContractor(userId: ID!): User!
    addContractorLicense(contId: ID!, license: LicenseInput!): Contractor!
    deleteContractorLicense(contId: ID!, licId: ID!): Contractor!
    updateContractorSkills(contId: ID!, skills: [SkillInput]!): Contractor!
  }

  type Contractor {
    id: ID!
    createdAt: String!
    updatedAt: String!
    skills: [Skill]
    licenses: [License]
    userId: ID
    user: User
  }
  type License {
    id: ID
    url: String!
    name: String
    size: Float
    type: String
    createdAt: String
    updatedAt: String
  }
  type ContsSearchResponse {
    users: [User!]!
    totalCount: Int
  }

  input LicenseInput {
    url: String!
    name: String!
    size: Float!
    type: String!
  }
`;
