import { gql } from "graphql-tag";

export default gql`
  type Query {
    job(id: ID!): Job!
    userJobs(userId: ID!): [Job!]!
    jobsByLocation(
      latLng: LatLngInput!
      radius: Float
      page: Int
      pageSize: Int
    ): [Job!]!
    jobsByText(
      inputText: String!
      latLng: LatLngInput!
      radius: Float
      page: Int
      pageSize: Int
      budget: JobsByTxtBudgetInput
    ): [Job!]!
  }
  type Mutation {
    createJob(userId: ID!, jobInput: JobInput!): Job!
    updateJob(id: ID!, imagesToDelete: [ID!], jobInput: JobInput!): Job!
    deleteJob(id: ID!): Job!
  }

  type Job {
    id: ID!
    title: String!
    desc: String!
    jobSize: JobSize!
    createdAt: String
    updatedAt: String
    budget: Budget
    skills: [Skill!]
    images: [JobImage]
    address: Address
    userId: ID
    user: User
  }
  type Budget {
    id: ID
    type: BudgetType!
    from: Float!
    to: Float!
    maxHours: Float!
    createdAt: String
    updatedAt: String
  }
  type JobImage {
    id: String
    name: String
    size: Float
    type: String
    url: String!
    createdAt: String
    updatedAt: String
  }

  input JobInput {
    title: String!
    desc: String!
    jobSize: JobSize!
    skills: [SkillInput!]!
    budget: JobBudgetInput!
    address: AddressInput!
    images: [JobImageInput!]
  }

  input JobBudgetInput {
    type: BudgetType!
    from: Float!
    to: Float!
    maxHours: Float!
  }
  input JobImageInput {
    name: String
    size: Float
    type: String
    url: String!
  }
  input JobsByTxtBudgetInput {
    types: [BudgetType!]!
    maxHours: Float
    from: Float
    to: Float
  }

  enum JobSize {
    Small
    Medium
    Large
  }
  enum BudgetType {
    Hourly
    Project
  }
`;
