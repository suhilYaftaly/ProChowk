import { JobBid } from "@prisma/client";
import { isAfter, isFuture, isToday, parseISO } from "date-fns";
import { GraphQLResolveInfo } from "graphql";

import { GQLContext } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError, ifr, infr } from "../../utils/funcs";
import { z } from "zod";

export default {
  Query: {
    getBid: async (
      _: any,
      { bidId }: { bidId: string },
      { prisma }: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<JobBid> => {
      const bid = await prisma.jobBid.findUnique({
        where: { id: bidId },
        include: {
          job: ifr(info, "job") && {
            include: {
              address: infr(info, "job", "address"),
              budget: infr(info, "job", "budget"),
              skills: infr(info, "job", "skills"),
            },
          },
          contractor: ifr(info, "contractor") && {
            include: {
              user: infr(info, "contractor", "user") && {
                include: { image: true },
              },
            },
          },
        },
      });

      if (!bid) throw gqlError({ msg: "Bid not found." });

      return bid;
    },
    getBids: async (
      _: any,
      { filter }: { filter: TGetBidsFilter },
      { prisma }: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<JobBid[]> => {
      if (!filter.jobId && !filter.contractorId && !filter.userId) {
        throw gqlError({
          msg: "At least one of jobId, contractorId, or userId must be provided.",
        });
      }

      // Build dynamic query based on filter input
      let queryConditions: TQueryConditions = {};
      if (filter.jobId) queryConditions.jobId = filter.jobId;
      if (filter.contractorId) {
        queryConditions.contractorId = filter.contractorId;
      }
      if (filter.userId) {
        const jobs = await prisma.job.findMany({
          where: { userId: filter.userId },
        });
        const jobIds = jobs.map((job) => job.id);
        queryConditions.jobId = { in: jobIds };
      }

      return await prisma.jobBid.findMany({
        where: { ...queryConditions, isRejected: false },
        include: {
          job: ifr(info, "job") && {
            include: {
              address: infr(info, "job", "address"),
              budget: infr(info, "job", "budget"),
              skills: infr(info, "job", "skills"),
            },
          },
          contractor: ifr(info, "contractor") && {
            include: {
              user: infr(info, "contractor", "user") && {
                include: { image: true },
              },
            },
          },
        },
      });
    },
  },
  Mutation: {
    placeBid: async (
      _: any,
      { input }: { input: TPlaceBidInput },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<JobBid> => {
      const {
        jobId,
        contractorId,
        quote,
        startDate,
        endDate,
        proposal,
        agreementAccepted,
      }: TPlaceBidInput = input;
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      //validate inputs
      const parsedInput = PlaceBidInputSchema.safeParse(input);
      if (!parsedInput.success) {
        throw gqlError({ msg: parsedInput?.error?.message });
      }

      // Check if the contractor exists
      const contractor = await prisma.contractor.findUnique({
        where: { id: contractorId },
      });
      if (!contractor) throw gqlError({ msg: "Contractor  not found!" });
      canUserUpdate({ id: contractor.userId, authUser });

      // Check if the job exists
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) throw gqlError({ msg: "Job not found!" });

      //check if job is in progress or completed
      if (job.status === "InProgress" || job.status === "Completed") {
        gqlError({ msg: "This job is no longer accepting bids!" });
      }

      // Prevent self-bidding
      if (job.userId === contractor.userId) {
        throw gqlError({ msg: "Contractors cannot bid on their own jobs." });
      }

      // Create a new bid
      const newBid = await prisma.jobBid.create({
        data: {
          quote,
          startDate: startDate || null,
          endDate: endDate || null,
          proposal: proposal || null,
          agreementAccepted,
          job: { connect: { id: jobId } },
          contractor: { connect: { id: contractorId } },
        },
        include: {
          job: ifr(info, "job") && {
            include: {
              address: infr(info, "job", "address"),
              budget: infr(info, "job", "budget"),
              skills: infr(info, "job", "skills"),
            },
          },
          contractor: ifr(info, "contractor") && {
            include: {
              user: infr(info, "contractor", "user") && {
                include: { image: true },
              },
            },
          },
        },
      });

      //send notification to the job poster
      await prisma.notification.create({
        data: {
          userId: job.userId,
          title: `${authUser.name} bid on your job.`,
          type: "BidPlaced",
          data: { jobId: job.id, bidId: newBid.id },
        },
      });

      return newBid;
    },
    acceptBid: async (
      _: any,
      { bidId }: { bidId: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<JobBid> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Retrieve the bid and associated job
      const bid = await prisma.jobBid.findUnique({
        where: { id: bidId },
        include: { job: true },
      });
      if (!bid) throw gqlError({ msg: "Bid not found!" });

      // Authorization check: ensure the user owns the job related to the bid
      canUserUpdate({ id: bid.job?.userId, authUser });

      //check if job is in progress or completed
      if (bid.job.status === "InProgress" || bid.job.status === "Completed") {
        gqlError({
          msg: "This job already has an accepted bid, you cannot accept another bid!",
        });
      }

      // Update the bid to mark it as accepted
      const updatedBid = await prisma.jobBid.update({
        where: { id: bidId },
        data: { isAccepted: true },
        include: {
          job: ifr(info, "job") && {
            include: {
              address: infr(info, "job", "address"),
              budget: infr(info, "job", "budget"),
              skills: infr(info, "job", "skills"),
            },
          },
          contractor: {
            include: {
              user: infr(info, "contractor", "user") && {
                include: { image: true },
              },
            },
          },
        },
      });

      if (!updatedBid) throw gqlError({ msg: "Error updating bid!" });

      const updatedJob = await prisma.job.update({
        where: { id: bid.jobId },
        data: { status: "InProgress" },
      });

      //send notification to the bidder
      await prisma.notification.create({
        data: {
          userId: updatedBid.contractor.userId,
          title: `${authUser.name} accepted your bid.`,
          type: "BidAccepted",
          data: { bidId, jobId: bid.jobId },
        },
      });

      // Merge the updated job status into the existing job data in the updated bid
      updatedBid.job = { ...updatedBid.job, status: updatedJob.status };
      return updatedBid;
    },
    rejectBid: async (
      _: any,
      { bidId, rejectionReason }: { bidId: string; rejectionReason?: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<JobBid> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Retrieve the bid and associated job
      const bid = await prisma.jobBid.findUnique({
        where: { id: bidId },
        include: { job: true },
      });
      if (!bid) throw gqlError({ msg: "Bid not found!" });

      // Authorization check: ensure the user owns the job related to the bid
      canUserUpdate({ id: bid.job?.userId, authUser });

      // Update the bid to mark it as rejected
      const updatedBid = await prisma.jobBid.update({
        where: { id: bidId },
        data: {
          isRejected: true,
          rejectionReason: rejectionReason || null,
          rejectionDate: new Date(),
        },
        include: {
          job: ifr(info, "job") && {
            include: {
              address: infr(info, "job", "address"),
              budget: infr(info, "job", "budget"),
              skills: infr(info, "job", "skills"),
            },
          },
          contractor: {
            include: {
              user: infr(info, "contractor", "user") && {
                include: { image: true },
              },
            },
          },
        },
      });

      //send notification to the job poster
      await prisma.notification.create({
        data: {
          userId: updatedBid.contractor.userId,
          title: `${authUser.name} rejected your bid, you can place a new bid.`,
          message: rejectionReason,
          type: "BidRejected",
          data: { bidId, jobId: bid.jobId },
        },
      });

      return updatedBid;
    },
  },
};

type TGetBidsFilter = {
  jobId?: string;
  contractorId?: string;
  userId?: string;
};
type TQueryConditions = {
  jobId?: string | { in: string[] };
  contractorId?: string;
};

const validateDate = (dateString: string | undefined) => {
  if (!dateString) return true;
  const date = parseISO(dateString);
  return isToday(date) || isFuture(date);
};

const PlaceBidInputSchema = z
  .object({
    jobId: z.string(),
    contractorId: z.string(),
    quote: z.number().min(0.01, "Quote must be a positive number."),
    startDate: z
      .string()
      .optional()
      .refine(validateDate, "Start date must be today or in the future."),
    endDate: z.string().optional(),
    proposal: z.string().optional(),
    agreementAccepted: z
      .boolean()
      .refine((val) => val, "Agreement must be accepted to place a bid."),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return isAfter(parseISO(data.endDate), parseISO(data.startDate));
      }
      return true;
    },
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    }
  );

// Infer TypeScript type
type TPlaceBidInput = z.infer<typeof PlaceBidInputSchema>;
