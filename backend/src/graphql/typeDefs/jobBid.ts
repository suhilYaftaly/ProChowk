import gql from "graphql-tag";

export default gql`
  type Query {
    getBids(filter: GetBidFilterInput): [JobBid!]!
    getBid(bidId: ID!): JobBid!
  }
  type Mutation {
    placeBid(input: PlaceBidInput!): JobBid!
    acceptBid(bidId: ID!): JobBid!
    rejectBid(bidId: ID!, rejectionReason: String): JobBid!
    completeBid(bidId: ID!): JobBid!
  }

  type JobBid {
    id: ID!
    quote: String!
    startDate: DateTime
    endDate: DateTime
    proposal: String
    rejectionReason: String
    agreementAccepted: Boolean
    status: JobBidStatus
    createdAt: DateTime
    updatedAt: DateTime
    jobId: ID
    contractorId: ID
    job: Job
    contractor: Contractor
  }

  input GetBidFilterInput {
    jobId: ID
    contractorId: ID
    userId: ID
  }
  input PlaceBidInput {
    jobId: String!
    contractorId: String!
    quote: Float!
    startDate: DateTime!
    endDate: DateTime
    proposal: String
    agreementAccepted: Boolean!
  }

  enum JobBidStatus {
    Open
    Accepted
    Completed
    Rejected
  }
`;
