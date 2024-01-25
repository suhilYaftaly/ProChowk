import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { reviewFields } from "../gqlFrags";
import { IUser } from "./user";
import { asyncOps } from "./gqlFuncs";

const reviewGqlResp = `${reviewFields} reviewer {id name image {url}}`;

const reviewOps = {
  Queries: {
    getUserReviews: gql`query GetUserReviews($userId: ID!) {
        getUserReviews(userId: $userId) {
            averageRating
            reviews {${reviewGqlResp}}
            totalCount
        }
    }`,
    getUserAvgReviews: gql`
      query GetUserAvgReviews($userId: ID!) {
        getUserReviews(userId: $userId) {
          averageRating
          totalCount
        }
      }
    `,
  },
  Mutations: {
    submitReview: gql`mutation SubmitReview($reviewerId: ID!, $reviewedId: ID!, $rating: Int!, $comment: String) {
        submitReview(reviewerId: $reviewerId, reviewedId: $reviewedId, rating: $rating, comment: $comment) {${reviewGqlResp}}
    }`,
    updateReview: gql`mutation UpdateReview($reviewId: ID!, $rating: Int!, $comment: String) {
        updateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {${reviewGqlResp}}
    }`,
  },
};

//TYPES
export type TReview = {
  id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewerId?: string;
  reviewedId?: string;
  reviewer?: IUser;
  reviewed?: IUser;
};

//OPERATIONS
//getUserReviews OP
export type TUserReviewsData = {
  averageRating?: number;
  reviews: TReview[];
  totalCount?: number;
};
type TGetUserReviewsData = { getUserReviews: TUserReviewsData };
type TGetUserReviewsInput = { userId: string };
type TGetUserReviewsAsync = {
  variables: TGetUserReviewsInput;
  onSuccess?: (data: TUserReviewsData) => void;
  onError?: (error?: any) => void;
};
export const useGetUserReviews = () => {
  const [getUserReviews, { data, loading, error }] = useLazyQuery<
    TGetUserReviewsData,
    TGetUserReviewsInput
  >(reviewOps.Queries.getUserReviews);

  const getUserReviewsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TGetUserReviewsAsync) =>
    asyncOps({
      operation: () => getUserReviews({ variables }),
      onSuccess: (dt: TGetUserReviewsData) =>
        onSuccess && onSuccess(dt.getUserReviews),
      onError,
    });

  return { getUserReviewsAsync, data, loading, error };
};

//getUserAvgReviews OP
type TGetUserAvgReviewsData = {
  getUserReviews: { averageRating?: number; totalCount?: number };
};
type TGetUserAvgReviewsInput = { userId: string };
type TGetUserAvgReviewsAsync = {
  variables: TGetUserAvgReviewsInput;
  onSuccess?: (data: TGetUserAvgReviewsData["getUserReviews"]) => void;
  onError?: (error?: any) => void;
};
export const useGetUserAvgReviews = () => {
  const [getUserAvgReviews, { data, loading, error }] = useLazyQuery<
    TGetUserAvgReviewsData,
    TGetUserAvgReviewsInput
  >(reviewOps.Queries.getUserAvgReviews);

  const getUserAvgReviewsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TGetUserAvgReviewsAsync) =>
    asyncOps({
      operation: () => getUserAvgReviews({ variables }),
      onSuccess: (dt: TGetUserAvgReviewsData) =>
        onSuccess && onSuccess(dt.getUserReviews),
      onError,
    });

  return { getUserAvgReviewsAsync, data, loading, error };
};

//submitReview OP
type TSubmitReviewData = { submitReview: TReview };
type TSubmitReviewInput = {
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment?: string;
};
type TSubmitReviewAsync = {
  variables: TSubmitReviewInput;
  onSuccess?: (data: TSubmitReviewData["submitReview"]) => void;
  onError?: (error?: any) => void;
};
export const useSubmitReview = () => {
  const [submitReview, { data, loading, error }] = useMutation<
    TSubmitReviewData,
    TSubmitReviewInput
  >(reviewOps.Mutations.submitReview);

  const submitReviewAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TSubmitReviewAsync) =>
    asyncOps({
      operation: () => submitReview({ variables }),
      onSuccess: (dt: TSubmitReviewData) =>
        onSuccess && onSuccess(dt.submitReview),
      onError,
    });

  return { submitReviewAsync, data, loading, error };
};

//updateReview OP
type TUpdateReviewData = { updateReview: TReview };
type TUpdateReviewInput = {
  reviewId: string;
  rating: number;
  comment?: string;
};
type TUpdateReviewAsync = {
  variables: TUpdateReviewInput;
  onSuccess?: (data: TUpdateReviewData["updateReview"]) => void;
  onError?: (error?: any) => void;
};
export const useUpdateReview = () => {
  const [updateReview, { data, loading, error }] = useMutation<
    TUpdateReviewData,
    TUpdateReviewInput
  >(reviewOps.Mutations.updateReview);

  const updateReviewAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TUpdateReviewAsync) =>
    asyncOps({
      operation: () => updateReview({ variables }),
      onSuccess: (dt: TUpdateReviewData) =>
        onSuccess && onSuccess(dt.updateReview),
      onError,
    });

  return { updateReviewAsync, data, loading, error };
};
