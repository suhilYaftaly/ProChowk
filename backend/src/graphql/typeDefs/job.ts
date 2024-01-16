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
    ): JobsSearchResponse
    jobsByText(
      inputText: String!
      latLng: LatLngInput!
      radius: Float
      page: Int
      pageSize: Int
      startDate: Date
      endDate: Date
      budget: JobsByTxtBudgetInput
    ): JobsSearchResponse
  }
  type Mutation {
    createJob(userId: ID!, jobInput: JobInput!): Job!
    updateJob(id: ID!, jobInput: JobInput!): Job!
    updateJobStatus(jobId: ID!, status: JobStatus!): Job!
    deleteJob(id: ID!): Job!
  }

  type Job {
    id: ID!
    title: String!
    desc: String!
    jobSize: JobSize!
    status: JobStatus
    startDate: Date
    endDate: Date
    isDraft: Boolean
    draftExpiry: Date
    createdAt: Date
    updatedAt: Date
    budgetId: ID
    budget: Budget
    skillIDs: [ID]
    skills: [Skill!]
    images: [JobImage]
    addressId: ID
    address: Address
    userId: ID
    user: User
    bids: [JobBid!]
  }
  type Budget {
    id: ID
    type: BudgetType!
    from: Float!
    to: Float!
    maxHours: Float!
    createdAt: Date
    updatedAt: Date
  }
  type JobImage {
    id: String
    name: String
    size: Float
    type: String
    url: String!
    createdAt: Date
    updatedAt: Date
  }
  type JobsSearchResponse {
    jobs: [Job!]!
    totalCount: Int
  }

  input JobInput {
    title: String!
    desc: String!
    jobSize: JobSize!
    startDate: Date
    endDate: Date
    isDraft: Boolean!
    skills: [SkillInput!]!
    budget: JobBudgetInput!
    address: AddressInput
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
  enum JobStatus {
    Open
    Bidding
    InProgress
    Completed
  }
`;
