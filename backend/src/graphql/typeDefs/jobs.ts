import { gql } from "graphql-tag";

export default gql`
  type Query {
    searchJobs(userId: ID!): [Job!]!
  }
  type Mutation {
    updateJob(id: ID, props: JobInput!): Job!
    deleteJob(id: ID!): Boolean!
  }

  type Job {
    id: ID!
    title: String
    desc: String
    jobSize: String
    skills: [JobSkill]
    budget: JobBudget
    address: JobAddress
    images: [JobImage]
    createdAt: String!
    updatedAt: String!
  }
  input JobInput {
    title: String
    desc: String
    jobSize: String
    skills: [JobSkillInput]
    budget: JobBudgetInput
    address: JobAddressInput
    images: [JobImageInput]
  }

  type JobSkill {
    label: String!
  }
  type JobBudget {
    type: String
    from: String
    to: String
    maxHours: String
  }
  type JobAddress {
    displayName: String
    street: String
    city: String
    county: String
    state: String
    stateCode: String
    postalCode: String
    country: String
    countryCode: String
    lat: Float
    lng: Float
  }
  type JobImage {
    id: String
    name: String
    size: Float
    type: String
    picture: String
  }

  input JobSkillInput {
    label: String!
  }
  input JobBudgetInput {
    type: String
    from: String
    to: String
    maxHours: String
  }
  input JobAddressInput {
    displayName: String
    street: String
    city: String
    county: String
    state: String
    stateCode: String
    postalCode: String
    country: String
    countryCode: String
    lat: Float
    lng: Float
  }
  input JobImageInput {
    id: String
    name: String
    size: Float
    type: String
    picture: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`;
