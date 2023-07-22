import { GraphQLContext } from "../../types/userTypes";
import checkAuth from "../../utils/checkAuth";
import { gqlError } from "../../utils/funcs";

export default {
  Query: {
    getUserJobs: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ): Promise<IJob[]> => {
      const { prisma } = context;

      try {
        // Validate user
        const eUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!eUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

        // Get and return jobs array
        const eJobs = await prisma.jobs.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" }, // Sort by createdAt field in reverse chronological order
        });
        if (eJobs) return eJobs.map((job) => getJob(job));
        else throw gqlError({ msg: "Failed to get jobs" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    getJob: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<IJob> => {
      const { prisma } = context;

      try {
        const eJob = await prisma.jobs.findUnique({ where: { id } });
        if (!eJob) throw gqlError({ msg: "Failed to get the job" });

        return getJob(eJob);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    getJobsBySkill: async (
      _: any,
      { skill, lat, lng }: { skill: string; lat: number; lng: number },
      context: GraphQLContext
    ): Promise<IJob[]> => {
      const { prisma } = context;

      try {
        // Calculate the lat and lng range for the 80 km radius
        const latRange = {
          gte: lat - 0.722, // 0.722 is approximately 80 km converted to degrees (1 degree ≈ 111 km)
          lte: lat + 0.722,
        };
        const lngRange = {
          gte: lng - 0.722,
          lte: lng + 0.722,
        };

        // Get and return jobs array closest to the provided coordinates and filtered by skill
        const jobs = await prisma.jobs.findMany({
          where: {
            skills: {
              some: {
                label: skill,
              },
            } as any,
            address: {
              lat: latRange,
              lng: lngRange,
            } as any,
          },
          orderBy: { createdAt: "desc" },
        });

        return jobs.map((job) => getJob(job));
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    updateJob: async (
      _: any,
      { id, props }: { id: string; props: IJobInput },
      context: GraphQLContext
    ): Promise<IJob> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      try {
        //validate inputs
        const inputErr = valdUpdateInput(props);
        if (inputErr) throw gqlError({ msg: inputErr, code: "BAD_USER_INPUT" });

        //validate user
        const eUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (!eUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

        //update or create job
        let updtJob;
        if (id) {
          const eJob = await prisma.jobs.findUnique({ where: { id } });
          if (!eJob) throw gqlError({ msg: "Job not found" });
          updtJob = await prisma.jobs.update({
            where: { id },
            data: { ...props },
          });
        } else {
          updtJob = await prisma.jobs.create({
            data: {
              ...props,
              user: { connect: { id: user.id } },
              userEmail: user.email,
            },
            include: { user: true },
          });
        }
        if (updtJob) {
          return getJob(updtJob);
        } else throw gqlError({ msg: "Failed to update the job" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    deleteJob: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      try {
        //validate user
        const eUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (!eUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

        // Delete the job by its id
        const deletedJob = await prisma.jobs.delete({
          where: { id },
        });

        if (deletedJob) {
          return true;
        } else throw gqlError({ msg: "Job not found or failed to delete" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};

const getJob = (job: IJob) => {
  return {
    id: job.id,
    title: job.title,
    desc: job.desc,
    jobSize: job.jobSize,
    skills: job.skills,
    budget: job.budget,
    address: job.address,
    images: job.images,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    userId: job.userId,
    userEmail: job.userEmail,
  };
};

//TYPES
type JobSize = "Small" | "Medium" | "Large" | string;
interface IJobBudget {
  type: "Hourly" | "Project" | string;
  from: string;
  to: string;
  maxHours: string;
}
interface IJobAddress {
  displayName: string;
  street: string;
  city: string;
  county: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}
interface ISkill {
  label: string;
}
interface IImage {
  id: string;
  name: string;
  size: number;
  type: string;
  picture: string;
}
interface IJob {
  id: string;
  title: string;
  desc: string;
  jobSize: JobSize;
  skills: ISkill[] | any;
  budget: IJobBudget | any;
  address: IJobAddress | any;
  images?: IImage[] | any;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: String;
  userEmail: string;
}
interface IJobInput {
  title: string;
  desc: string;
  jobSize: JobSize;
  skills: ISkill[] | any;
  budget: IJobBudget | any;
  address: IJobAddress | any;
  images?: IImage[] | any;
}

//VALIDATORS
const valdUpdateInput = (props: IJobInput): string | undefined => {
  const { title, desc, jobSize, skills, budget, address } = props;

  if (!title) return "Title is required";
  if (!desc) return "Description is required";
  if (!["Small", "Medium", "Large"].includes(jobSize))
    return "Invalid job size";
  if (!skills || skills.length === 0) return "At least one skill is required";
  if (!budget) return "Budget is required";
  if (!address) return "Address is required";

  return undefined;
};
