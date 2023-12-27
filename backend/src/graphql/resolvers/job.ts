import { BudgetType, Job } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";

import { GraphQLContext, IJobInput } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError, ifr } from "../../utils/funcs";
import {
  ADDRESS_COLLECTION,
  SKILL_COLLECTION,
} from "../../constants/dbCollectionNames";

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export default {
  Query: {
    job: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext,
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
      context: GraphQLContext,
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
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job[]> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;

      const skip = (page - 1) * pageSize;
      // Fetch addresses within a certain radius
      const addresses = await db
        .collection(ADDRESS_COLLECTION)
        .aggregate([
          {
            // Geospatial query to find addresses near the given location
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [latLng.lng, latLng.lat],
              },
              distanceField: "distance",
              maxDistance: distanceInMeters,
              spherical: true,
            },
          },
          {
            // Join with the Job collection to get the jobs at each address
            $lookup: {
              from: "Job",
              localField: "_id",
              foreignField: "addressId",
              as: "associatedJobs",
            },
          },
          { $unwind: "$associatedJobs" },
          { $match: { "associatedJobs.isDraft": { $ne: true } } },
          { $skip: skip },
          { $limit: pageSize },
        ])
        .toArray();

      // Extract job IDs from the address results
      const jobIds = addresses.map((address) =>
        address.associatedJobs._id.toString()
      );

      // Fetch detailed job data from Prisma
      const jobs = await prisma.job.findMany({
        where: { id: { in: jobIds }, isDraft: false },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          budget: ifr(info, "budget"),
          skills: ifr(info, "skills") && { select: { label: true } },
        },
      });

      // Reorder the jobs based on the order in jobIds
      return jobIds.map((jobId) => jobs.find((job) => job.id === jobId));
    },
    jobsByText: async (
      _: any,
      {
        inputText,
        latLng,
        radius = 60,
        page = 1,
        pageSize = 100,
        budget,
        startDate,
        endDate,
      }: IJobsByTextInput,
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Job[]> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;

      // Fetching skills based on text and retrieving only their _id fields
      const skills = await db
        .collection(SKILL_COLLECTION)
        .find({ $text: { $search: inputText } }, { projection: { _id: 1 } })
        .toArray();
      const skillIds = skills.map((skill) => skill._id);

      // Initial match condition for text search and skills
      let baseMatchCondition = {
        $or: [
          { "associatedJobs.skillIDs": { $in: skillIds } },
          { "associatedJobs.title": { $regex: inputText, $options: "i" } },
          { "associatedJobs.desc": { $regex: inputText, $options: "i" } },
        ],
      };

      let budgetConditions = [];

      // Match condition for budget types
      if (budget?.types) {
        budgetConditions.push({
          "associatedJobs.budget.type": { $in: budget.types },
        });
      }

      // Additional match condition for price range (from and to)
      if (budget.from !== undefined) {
        budgetConditions.push({
          "associatedJobs.budget.from": { $gte: budget.from },
        });
      }
      if (budget.to !== undefined) {
        budgetConditions.push({
          "associatedJobs.budget.to": { $lte: budget.to },
        });
      }

      const isNotDraft = { "associatedJobs.isDraft": { $ne: true } };
      // Combine the match conditions with the base condition
      let matchCondition = {
        $and: [baseMatchCondition, ...budgetConditions, isNotDraft],
      };

      //DATE RANGE FILTERS
      if (startDate) {
        // Use current date in ISO string format if endDate is not provided
        if (!endDate) endDate = new Date().toISOString();
        let dateRangeCondition: {
          "associatedJobs.createdAt": { $gte?: Date; $lte: Date };
        } = { "associatedJobs.createdAt": { $lte: new Date(endDate) } };
        dateRangeCondition["associatedJobs.createdAt"].$gte = new Date(
          startDate
        );
        matchCondition.$and.push(dateRangeCondition);
      }

      const skip = (page - 1) * pageSize;

      // Fetching addresses within a certain radius that are related to jobs with the found skills or having the input text in title or description
      const addresses = await db
        .collection(ADDRESS_COLLECTION)
        .aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [latLng.lng, latLng.lat],
              },
              distanceField: "distance",
              maxDistance: distanceInMeters,
              spherical: true,
            },
          },
          {
            $lookup: {
              from: "Job",
              localField: "_id",
              foreignField: "addressId",
              as: "associatedJobs",
            },
          },
          { $unwind: "$associatedJobs" },
          {
            $lookup: {
              from: "Budget",
              localField: "associatedJobs._id",
              foreignField: "jobId",
              as: "associatedJobs.budget",
            },
          },
          { $unwind: "$associatedJobs.budget" },
          { $match: matchCondition },
          { $skip: skip },
          { $limit: pageSize },
        ])
        .toArray();

      // Extract job IDs from the address results
      const jobIds = addresses.map((address) =>
        address.associatedJobs._id.toString()
      );

      // Fetch detailed job data from Prisma
      const jobs = await prisma.job.findMany({
        where: { id: { in: jobIds }, isDraft: false },
        include: {
          address: ifr(info, "address"),
          images: ifr(info, "images"),
          budget: ifr(info, "budget"),
          skills: ifr(info, "skills") && { select: { label: true } },
        },
      });

      // Reorder the jobs based on the order in jobIds
      return jobIds.map((jobId) => jobs.find((job) => job.id === jobId));
    },
  },
  Mutation: {
    createJob: async (
      _: any,
      { userId, jobInput }: { userId: string; jobInput: IJobInput },
      context: GraphQLContext,
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
      context: GraphQLContext,
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
    deleteJob: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const job = await prisma.job.findUnique({
        where: { id },
        include: { images: true, budget: true },
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

      // Finally, deleting the job
      const deletedJob = await prisma.job.delete({ where: { id } });
      if (!deletedJob) throw gqlError({ msg: "Failed to delete job" });
      return deletedJob;
    },
  },
};

const buildJobInputs = (jobInput: IJobInput) => {
  let data;
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
