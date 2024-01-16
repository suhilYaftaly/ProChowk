import { BudgetType, Job } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { Notification } from "@prisma/client";

import { GQLContext, IJobInput } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError, ifr, infr } from "../../utils/funcs";
import {
  ADDRESS_COLL,
  BUDGET_COLL,
  JOB_COLL,
  SKILL_COLL,
} from "../../constants/dbCollectionNames";

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export default {
  Query: {
    job: async (
      _: any,
      { id }: { id: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job> => {
      const { prisma } = context;

      const jobRes = await prisma.job.findUnique({
        where: { id },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          skills: ifr(info, "skills"),
          budget: ifr(info, "budget"),
        },
      });
      if (!jobRes) throw gqlError({ msg: "Failed to get the job" });

      return jobRes;
    },
    userJobs: async (
      _: any,
      { userId }: { userId: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job[]> => {
      const { prisma } = context;

      const jobsRes = await prisma.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          skills: ifr(info, "skills"),
          budget: ifr(info, "budget"),
        },
      });

      if (!jobsRes) throw gqlError({ msg: "Failed to get jobs" });
      return jobsRes;
    },
    jobsByLocation: async (
      _: any,
      { latLng, radius = 60, page = 1, pageSize = 100 }: IJobsByLocationInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<{ jobs: Job[]; totalCount: number }> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;
      const skip = (page - 1) * pageSize;

      const commonPipeline = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [latLng.lng, latLng.lat] },
            distanceField: "distance",
            maxDistance: distanceInMeters,
            spherical: true,
          },
        },
        {
          $lookup: {
            from: JOB_COLL,
            localField: "_id",
            foreignField: "addressId",
            as: "assoJobs",
          },
        },
        { $unwind: "$assoJobs" },
        { $match: { "assoJobs.isDraft": { $ne: true } } },
      ];

      const aggregation = await db
        .collection(ADDRESS_COLL)
        .aggregate([
          ...commonPipeline,
          {
            $facet: {
              paginatedResults: [{ $skip: skip }, { $limit: pageSize }],
              totalCount: [{ $count: "total" }],
            },
          },
        ])
        .toArray();

      const paginatedResults = aggregation[0].paginatedResults;
      const totalCount = aggregation[0].totalCount[0]?.total || 0;

      const jobIds = paginatedResults.map((address: any) =>
        address?.assoJobs?._id.toString()
      );
      const jobs = await prisma.job.findMany({
        where: { id: { in: jobIds }, isDraft: false },
        include: {
          address: infr(info, "jobs", "address"),
          images: infr(info, "jobs", "images"),
          budget: infr(info, "jobs", "budget"),
          skills: infr(info, "jobs", "skills") && { select: { label: true } },
        },
      });

      const orderedJobs = jobIds.map((jobId: string) =>
        jobs.find((job) => job.id === jobId)
      );
      return { jobs: orderedJobs, totalCount };
    },
    jobsByText: async (
      _: any,
      {
        inputText,
        latLng,
        radius = 60,
        page = 1,
        pageSize = 100,
        startDate,
        endDate,
        budget,
      }: IJobsByTextInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<{ jobs: Job[]; totalCount: number }> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;

      // Create a query object for Job text search
      let jobQuery: any = { $text: { $search: inputText }, isDraft: false };

      // Add date range filters to job query if provided
      if (startDate) {
        jobQuery.createdAt = {};
        if (!endDate) endDate = new Date().toISOString();
        jobQuery.createdAt.$gte = new Date(startDate);
        jobQuery.createdAt.$lte = new Date(endDate);
      }

      // Text search for jobs (titles, descriptions, and date range)
      const matchingJobs = await db
        .collection(JOB_COLL)
        .find(jobQuery)
        .toArray();
      const jobIdsFromTextSearch = matchingJobs.map((job) => job._id);

      // Text search for skills
      const skills = await db
        .collection(SKILL_COLL)
        .find({ $text: { $search: inputText } }, { projection: { _id: 1 } })
        .toArray();
      const skillIds = skills.map((skill) => skill._id);

      // Combine job and skill IDs
      let combinedIds = [...jobIdsFromTextSearch, ...skillIds];

      // Initialize additional match conditions
      let addiConds: any = {};

      // Add budget conditions if provided
      if (budget) {
        if (budget.types)
          addiConds["assoJobs.budget.type"] = { $in: budget.types };
        if (budget.from !== undefined)
          addiConds["assoJobs.budget.from"] = { $gte: budget.from };
        if (budget.to !== undefined)
          addiConds["assoJobs.budget.to"] = { $lte: budget.to };
      }

      const skip = (page - 1) * pageSize;

      const result = await db
        .collection(ADDRESS_COLL)
        .aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [latLng.lng, latLng.lat] },
              distanceField: "distance",
              maxDistance: distanceInMeters,
              spherical: true,
            },
          },
          {
            $lookup: {
              from: JOB_COLL,
              localField: "_id",
              foreignField: "addressId",
              as: "assoJobs",
            },
          },
          { $unwind: "$assoJobs" },
          {
            $lookup: {
              from: BUDGET_COLL,
              localField: "assoJobs._id",
              foreignField: "jobId",
              as: "assoJobs.budget",
            },
          },
          { $unwind: "$assoJobs.budget" },
          {
            $match: {
              "assoJobs._id": { $in: combinedIds },
              ...addiConds,
            },
          },
          {
            $facet: {
              paginatedResults: [{ $skip: skip }, { $limit: pageSize }],
              totalCount: [{ $count: "total" }],
            },
          },
        ])
        .next();

      const paginatedResults = result?.paginatedResults || [];
      const totalCount = result?.totalCount[0]?.total || 0;

      const jobIds = paginatedResults.map((address: any) =>
        address?.assoJobs?._id.toString()
      );
      const jobs = await prisma.job.findMany({
        where: { id: { in: jobIds }, isDraft: false },
        include: {
          address: infr(info, "jobs", "address"),
          images: infr(info, "jobs", "images"),
          budget: infr(info, "jobs", "budget"),
          skills: infr(info, "jobs", "skills") && { select: { label: true } },
        },
      });

      const orderedJobs = jobIds.map((jobId: string) =>
        jobs.find((job) => job.id === jobId)
      );

      return { jobs: orderedJobs, totalCount };
    },
  },
  Mutation: {
    createJob: async (
      _: any,
      { userId, jobInput }: { userId: string; jobInput: IJobInput },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      canUserUpdate({ id: userId, authUser });

      //if its a draft set expiry to 1 week
      const draftExpiry = jobInput.isDraft
        ? new Date(Date.now() + ONE_WEEK_IN_MS)
        : null;

      const createdJob = await prisma.job.create({
        data: {
          title: jobInput.title,
          desc: jobInput.desc,
          jobSize: jobInput.jobSize,
          startDate: jobInput.startDate,
          endDate: jobInput.endDate,
          isDraft: jobInput.isDraft,
          draftExpiry,
          user: { connect: { id: userId } },
          ...buildJobInputs(jobInput),
          budget: { create: jobInput.budget },
        },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          skills: ifr(info, "skills"),
          budget: ifr(info, "budget"),
        },
      });
      if (!createdJob) throw gqlError({ msg: "Failed to update job" });
      return createdJob;
    },
    updateJob: async (
      _: any,
      { id, jobInput }: IUpdateJobInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const job = await prisma.job.findUnique({
        where: { id },
        include: { skills: true, images: true },
      });
      if (!job) throw gqlError({ msg: "Job not found" });
      canUserUpdate({ id: job.userId, authUser });

      const imagesToUpdate = jobInput.images.filter(
        (newImage) =>
          !job.images.some(
            (existingImage) => existingImage.url === newImage.url
          )
      );
      const imageData =
        imagesToUpdate.length > 0
          ? { createMany: { data: imagesToUpdate } }
          : {};

      const disconnectSkills = job.skills
        .filter((s) => !jobInput.skills.some((IS) => IS.label === s.label))
        .map((skill) => ({ label: skill.label }));

      //DELETE IMAGES
      const deleteImages = async () => {
        const updatedImageUrls = new Set(jobInput.images.map((img) => img.url));

        const imagesToDelete = job.images
          .filter((img) => !updatedImageUrls.has(img.url))
          .map((img) => img.id);

        if (imagesToDelete.length > 0) {
          await prisma.jobImage.deleteMany({
            where: { id: { in: imagesToDelete } },
          });
        }
      };
      await deleteImages();

      const skillsInput = {
        disconnect: disconnectSkills,
        ...buildJobInputs(jobInput).skills,
      };

      //if its a draft set expiry to 1 week
      const draftExpiry = jobInput.isDraft
        ? new Date(Date.now() + ONE_WEEK_IN_MS)
        : null;

      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          title: jobInput.title,
          desc: jobInput.desc,
          jobSize: jobInput.jobSize,
          startDate: jobInput.startDate,
          endDate: jobInput.endDate,
          isDraft: jobInput.isDraft,
          draftExpiry,
          address: buildJobInputs(jobInput).address,
          skills: skillsInput,
          images: imageData,
          budget: { update: jobInput.budget },
        },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          skills: ifr(info, "skills"),
          budget: ifr(info, "budget"),
        },
      });
      if (!updatedJob) throw gqlError({ msg: "Failed to update job" });
      return updatedJob;
    },
    updateJobStatus: async (
      _: any,
      { jobId, status }: { jobId: string; status: Job["status"] },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) throw gqlError({ msg: "Job not found" });
      canUserUpdate({ id: job.userId, authUser });

      if (status === "Completed") {
        // Retrieve all bids
        const bids = await prisma.jobBid.findMany({
          where: { jobId },
          include: { contractor: true },
        });

        const notificationData: any = [];

        for (const bid of bids) {
          if (bid.isAccepted) {
            // Notify accepted contractor that job is finished
            notificationData.push({
              userId: bid.contractor.userId,
              title: `Job '${job.title}' Completed: Thanks for Your Work, ${authUser.name}!`,
              type: "JobFinished",
              data: { jobId: job.id, bidId: bid.id },
            });
          } else {
            // Notify other contractors their bid was not accepted
            notificationData.push({
              userId: bid.contractor.userId,
              title: `Your bid on '${job.title}' was not accepted.`,
              type: "BidRejected",
              data: { jobId: job.id, bidId: bid.id },
            });
          }
        }

        // Update all non-accepted bids to rejected
        await prisma.jobBid.updateMany({
          where: { jobId, isAccepted: false },
          data: { isRejected: true, rejectionDate: new Date() },
        });

        await prisma.notification.createMany({ data: notificationData });
      }

      return await prisma.job.update({
        where: { id: jobId },
        data: { status },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          skills: ifr(info, "skills"),
          budget: ifr(info, "budget"),
        },
      });
    },

    deleteJob: async (
      _: any,
      { id }: { id: string },
      context: GQLContext
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const job = await prisma.job.findUnique({
        where: { id },
        include: { images: true, budget: true, bids: true },
      });
      if (!job) throw gqlError({ msg: "Job not found" });
      canUserUpdate({ id: job.userId, authUser });

      // Deleting associated images
      if (job.images) {
        await prisma.jobImage.deleteMany({
          where: { id: { in: job.images.map((img) => img.id) } },
        });
      }

      // Deleting associated budget
      if (job.budget) {
        await prisma.budget.delete({ where: { id: job.budget.id } });
      }

      //delete assiciated bids
      if (job.bids && job.bids.length > 0) {
        await prisma.jobBid.deleteMany({ where: { jobId: id } });
      }

      // Finally, deleting the job
      const deletedJob = await prisma.job.delete({ where: { id } });
      if (!deletedJob) throw gqlError({ msg: "Failed to delete job" });
      return deletedJob;
    },
  },
};

const buildJobInputs = (jobInput: IJobInput) => {
  let data: any;
  if (jobInput.address)
    data = {
      ...data,
      address: {
        connectOrCreate: {
          where: {
            lat_lng: { lat: jobInput.address.lat, lng: jobInput.address.lng },
          },
          create: jobInput.address,
        },
      },
    };
  if (jobInput.skills)
    data = {
      ...data,
      skills: {
        connectOrCreate: jobInput.skills.map((skill) => ({
          where: { label: skill.label },
          create: skill,
        })),
      },
    };
  if (jobInput?.images?.length > 0)
    data = { ...data, images: { createMany: { data: jobInput.images } } };

  return data;
};

interface IUpdateJobInput {
  id: string;
  jobInput: IJobInput;
}
interface IJobsByLocationInput {
  latLng: { lat: number; lng: number };
  radius?: number;
  page?: number;
  pageSize?: number;
}

interface IJobsByTextInput {
  inputText: string;
  latLng: { lat: number; lng: number };
  radius?: number;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  budget?: {
    types: BudgetType[];
    from?: number;
    to?: number;
  };
}
