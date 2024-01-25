import gql from "graphql-tag";

export default gql`
  type Query {
    getUserReviews(userId: ID!, page: Int, pageSize: Int): UserReviewsResponse!
  }
  type Mutation {
    submitReview(
      reviewerId: ID!
      reviewedId: ID!
      rating: Int!
      comment: String
    ): Review!
  }
  type Mutation {
    updateReview(reviewId: ID!, rating: Int!, comment: String): Review!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
    createdAt: DateTime!
    updatedAt: DateTime!
    reviewerId: ID
    reviewedId: ID
    reviewer: User!
    reviewed: User!
  }
  type UserReviewsResponse {
    averageRating: Float
    reviews: [Review!]!
    totalCount: Float
  }
`;
