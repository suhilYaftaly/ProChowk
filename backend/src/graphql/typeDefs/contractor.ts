import { gql } from "graphql-tag";

export default gql`
  type Query {
    contractor(id: ID, userId: ID): Contractor!
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
    desc: String
    createdAt: String
    updatedAt: String
  }

  input LicenseInput {
    url: String!
    name: String!
    size: Float!
    type: String!
    desc: String
  }
`;
