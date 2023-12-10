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
      startDate: Date
      endDate: Date
      budget: JobsByTxtBudgetInput
    ): [Job!]!
  }
  type Mutation {
    createJob(userId: ID!, jobInput: JobInput!): Job!
    updateJob(id: ID!, jobInput: JobInput!): Job!
    deleteJob(id: ID!): Job!
  }

  type Job {
    id: ID!
    title: String!
    desc: String!
    jobSize: JobSize!
    createdAt: Date
    updatedAt: Date
    budget: Budget
    skills: [Skill!]
    images: [JobImage]
    address: Address
    userId: ID
    user: User
    startDate: Date
    endDate: Date
    isDraft: Boolean
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
    startDate: Date
    endDate: Date
    isDraft: Boolean!
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
