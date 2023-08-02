import { Job } from "@prisma/client";
import { GraphQLContext, IJobInput } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../utils/checkAuth";
import { gqlError } from "../../utils/funcs";

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
          include: { skills: true },
        });
        if (!job) throw gqlError({ msg: "Job not found" });
        canUserUpdate({ id: job.userId, authUser });

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
            images: buildJobInputs(jobInput).images,
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
