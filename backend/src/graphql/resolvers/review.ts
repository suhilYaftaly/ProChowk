import { z } from "zod";
import { Review } from "@prisma/client";
import { isBefore, subMonths } from "date-fns";

import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { GQLContext } from "../../types/commonTypes";
import { calculateAverageRating, gqlError } from "../../utils/funcs";

export default {
  Query: {
    getUserReviews: async (
      _: any,
      { userId }: { userId: string },
      { prisma }: GQLContext
    ): Promise<{
      reviews: Review[];
      averageRating: number;
      totalCount: number;
    }> => {
      const reviews = await prisma.review.findMany({
        where: { reviewedId: userId },
        orderBy: { createdAt: "desc" },
        include: { reviewer: true },
      });

      const averageRating = calculateAverageRating(reviews);

      return { reviews, averageRating, totalCount: reviews.length };
    },
  },
  Mutation: {
    submitReview: async (
      _: any,
      { rating, comment, reviewerId, reviewedId }: TSubmitReviewInput,
      context: GQLContext
    ): Promise<Review> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Validate inputs
      const parsedInput = submitReviewSchema.safeParse({
        rating,
        comment,
        reviewerId,
        reviewedId,
      });
      if (!parsedInput.success) {
        throw gqlError({ msg: parsedInput?.error?.message });
      }

      // Check if authUser's ID matches reviewerId
      if (authUser.id !== reviewerId) {
        throw gqlError({ msg: "Unauthorized: You cannot review." });
      }

      // Check for review authorization
      const authorization = await prisma.reviewAuthorization.findFirst({
        where: { reviewerId, reviewedId },
      });

      if (!authorization) {
        throw gqlError({
          msg: "Unauthorized: You are not authorized to review this user.",
        });
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          rating,
          comment,
          reviewer: { connect: { id: reviewerId } },
          reviewed: { connect: { id: reviewedId } },
        },
        include: { reviewer: true },
      });

      // Delete the authorization if it should be used only once
      await prisma.reviewAuthorization.delete({
        where: { id: authorization.id },
      });

      // Send notification to the reviewed user
      await prisma.notification.create({
        data: {
          userId: reviewedId,
          title: "New Review Received",
          message: `You've received a new review from ${authUser.name}.`,
          type: "ReviewReceived",
          data: { reviewId: review.id },
        },
      });

      return review;
    },
    updateReview: async (
      _: any,
      { reviewId, rating, comment }: UpdateReviewInput,
      context: GQLContext
    ): Promise<Review> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Retrieve the review to be updated
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });
      if (!review) throw gqlError({ msg: "Review not found." });

      // Check if the authUser is the one who wrote the review
      canUserUpdate({
        id: review.reviewerId,
        authUser,
        message: "Unauthorized: You can only update your own reviews.",
      });

      // Check if the review is within the one-month update window
      const oneMonthAgo = subMonths(new Date(), 1);
      if (isBefore(review.createdAt, oneMonthAgo)) {
        throw gqlError({
          msg: "Reviews can only be updated within one month of creation.",
        });
      }

      // Update the review
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: { rating, comment },
        include: { reviewer: true },
      });

      return updatedReview;
    },
  },
};

const submitReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  reviewerId: z.string().length(24),
  reviewedId: z.string().length(24),
});
type TSubmitReviewInput = z.infer<typeof submitReviewSchema>;

const updateReviewSchema = z.object({
  reviewId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});
type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
