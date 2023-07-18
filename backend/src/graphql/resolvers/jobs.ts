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
        const eUser = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!eUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

        // Get and return jobs array
        const eJobs = await prisma.jobs.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" }, // Sort by createdAt field in reverse chronological order
        });
        if (eJobs) {
          return eJobs.map((job) => getJob(job, eUser));
        } else throw gqlError({ msg: "Failed to get jobs" });
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
          return getJob(updtJob, eUser);
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

const getJob = (job: IJob, user: IUser) => {
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
    user: { id: user.id, name: user.name, email: user.email },
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

interface IUser {
  id: string;
  name: string;
  email: string;
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
