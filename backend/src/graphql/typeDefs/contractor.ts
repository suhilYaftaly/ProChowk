import { gql } from "graphql-tag";

export default gql`
  type Query {
    searchContrProf(userId: ID!): Contractor!
  }
  type Mutation {
    updateContrProf(skills: [SkillInput], licenses: [LicenseInput]): Contractor!
  }

  type Contractor {
    id: ID!
    skills: [Skills]
    licenses: [Licenses]
    user: User!
    createdAt: String!
    updatedAt: String!
  }
  type Licenses {
    name: String!
    size: Float
    type: String!
    desc: String!
    picture: String!
  }
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Skills {
    label: String!
  }

  input LicenseInput {
    name: String!
    size: Float
    type: String!
    desc: String!
    picture: String!
  }
  input SkillInput {
    label: String!
  }
`;
