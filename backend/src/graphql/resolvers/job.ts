import { BudgetType, Job } from "@prisma/client";
import { GraphQLContext, IJobInput } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError } from "../../utils/funcs";
import {
  ADDRESS_COLLECTION,
  SKILL_COLLECTION,
} from "../../constants/dbCollectionNames";

export default {
  Query: {
    job: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<Job> => {
      const { prisma } = context;

      const jobRes = await prisma.job.findUnique({
        where: { id },
        include: { address: true, images: true, skills: true, budget: true },
      });
      if (!jobRes) throw gqlError({ msg: "Failed to get the job" });

      return jobRes;
    },
    userJobs: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ): Promise<Job[]> => {
      const { prisma } = context;

      const jobsRes = await prisma.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { address: true, images: true, skills: true, budget: true },
      });
      if (!jobsRes) throw gqlError({ msg: "Failed to get jobs" });
      return jobsRes;
    },
    jobsByLocation: async (
      _: any,
      { latLng, radius = 60, page = 1, pageSize = 20 }: IJobsByLocationInput,
      context: GraphQLContext
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
        where: { id: { in: jobIds } },
        include: { address: true, skills: true, budget: true },
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
        pageSize = 20,
        budget,
      }: IJobsByTextInput,
      context: GraphQLContext
    ): Promise<Job[]> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;

      // Fetching skills based on text
      const skills = await db
        .collection(SKILL_COLLECTION)
        .find({ $text: { $search: inputText } })
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

      // Additional match condition for maxHours, but only for 'Hourly' type
      if (budget?.maxHours !== undefined) {
        budgetConditions.push({
          $or: [
            { "associatedJobs.budget.type": { $ne: "Hourly" } },
            {
              $and: [
                { "associatedJobs.budget.type": "Hourly" },
                { "associatedJobs.budget.maxHours": { $lte: budget.maxHours } },
              ],
            },
          ],
        });
      }

      // Combine the match conditions with the base condition
      let matchCondition = {
        $and: [baseMatchCondition, ...budgetConditions],
      };

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
        where: { id: { in: jobIds } },
        include: { address: true, skills: true, budget: true },
      });

      // Reorder the jobs based on the order in jobIds
      return jobIds.map((jobId) => jobs.find((job) => job.id === jobId));
    },
  },
  Mutation: {
    createJob: async (
      _: any,
      { userId, jobInput }: { userId: string; jobInput: IJobInput },
      context: GraphQLContext
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      canUserUpdate({ id: userId, authUser });

      const createdJob = await prisma.job.create({
        data: {
          title: jobInput.title,
          desc: jobInput.desc,
          jobSize: jobInput.jobSize,
          user: { connect: { id: userId } },
          ...buildJobInputs(jobInput),
          budget: { create: jobInput.budget },
        },
        include: { address: true, images: true, skills: true, budget: true },
      });
      if (!createdJob) throw gqlError({ msg: "Failed to update job" });
      return createdJob;
    },
    updateJob: async (
      _: any,
      { id, imagesToDelete, jobInput }: IUpdateJobInput,
      context: GraphQLContext
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

      if (imagesToDelete?.length > 0) {
        await prisma.jobImage.deleteMany({
          where: { id: { in: imagesToDelete } },
        });
      }

      const skillsInput = {
        disconnect: disconnectSkills,
        ...buildJobInputs(jobInput).skills,
      };

      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          title: jobInput.title,
          desc: jobInput.desc,
          jobSize: jobInput.jobSize,
          address: buildJobInputs(jobInput).address,
          skills: skillsInput,
          images: imageData,
          budget: { update: jobInput.budget },
        },
        include: { address: true, images: true, skills: true, budget: true },
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
  imagesToDelete?: string[];
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
  budget?: { types: BudgetType[]; maxHours?: number };
}
