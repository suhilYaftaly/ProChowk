import { Job } from "@prisma/client";
import { GraphQLContext, IJobInput } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../utils/checkAuth";
import { gqlError } from "../../utils/funcs";
import {
  ADDRESS_COLLECTION,
  SKILL_COLLECTION,
} from "../../utils/dbCollectionNames";

export default {
  Query: {
    job: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<Job> => {
      const { prisma } = context;

      try {
        const jobRes = await prisma.job.findUnique({
          where: { id },
          include: { address: true, images: true, skills: true, budget: true },
        });
        if (!jobRes) throw gqlError({ msg: "Failed to get the job" });

        return jobRes;
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    userJobs: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ): Promise<Job[]> => {
      const { prisma } = context;

      try {
        const jobsRes = await prisma.job.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: { address: true, images: true, skills: true, budget: true },
        });
        if (!jobsRes) throw gqlError({ msg: "Failed to get jobs" });
        return jobsRes;
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    jobsBySkill: async (
      _: any,
      { skill, latLng, radius = 60, limit = 20 }: IJobsBySkillInput,
      context: GraphQLContext
    ): Promise<Job[]> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;

      try {
        // Find the skill object by its label (case insensitive)
        const skillObj = await db
          .collection(SKILL_COLLECTION)
          .findOne(
            { label: { $regex: skill, $options: "i" } },
            { collation: { locale: "en", strength: 2 } }
          );
        if (!skillObj) throw new Error("Skill not found");

        // Fetch addresses within a certain radius that are related to jobs with the given skill
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
            {
              // Filter jobs that have the given skill
              $match: { "associatedJobs.skillIDs": { $in: [skillObj._id] } },
            },
            {
              // Limit the results based on the given limit
              $limit: limit,
            },
          ])
          .toArray();

        // Extract job IDs from the address results
        const jobIds = addresses.map((address) =>
          address.associatedJobs._id.toString()
        );

        // Fetch detailed job data from Prisma
        return await prisma.job.findMany({
          where: { id: { in: jobIds } },
          include: { address: true, images: true, skills: true, budget: true },
        });
      } catch (error) {
        console.error("Error:", error);
        throw gqlError({ msg: error?.message });
      }
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

      try {
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
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    updateJob: async (
      _: any,
      { id, imagesToDelete, jobInput }: IUpdateJobInput,
      context: GraphQLContext
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      try {
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
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    deleteJob: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<Job> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      try {
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
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
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
interface IJobsBySkillInput {
  skill: string;
  latLng: { lat: number; lng: number };
  radius?: number;
  limit?: number;
}
