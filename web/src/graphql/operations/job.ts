import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { ISkill, SkillInput, skillGqlResp } from "./skill";
import { IUser, userGqlResp } from "./user";
import { AddressInput, IAddress, addressGqlResp } from "./address";
import { IImage, ImageInput } from "@/types/commonTypes";
import { asyncOps } from "./gqlFuncs";

const budgetGqlResp = gql`
  fragment BudgetFields on Budget {
    id
    type
    from
    to
    maxHours
    createdAt
    updatedAt
  }
`;
const jobImageGqlResp = gql`
  fragment JobImageFields on JobImage {
    id
    name
    size
    type
    url
    createdAt
    updatedAt
  }
`;

const jobGqlResp = gql`
  ${skillGqlResp}
  ${userGqlResp}
  ${budgetGqlResp}
  ${jobImageGqlResp}
  ${addressGqlResp}
  fragment JobFields on Job {
    id
    title
    desc
    jobSize
    createdAt
    updatedAt
    userId
    user {
      ...UserFields
    }
    skills {
      ...SkillFields
    }
    budget {
      ...BudgetFields
    }
    images {
      ...JobImageFields
    }
    address {
      ...AddressFields
    }
  }
`;

const jobOps = {
  Queries: {
    job: gql`
      ${jobGqlResp}
      query Job($id: ID!) {
        job(id: $id) {
          ...JobFields
        }
      }
    `,
    userJobs: gql`
      ${jobGqlResp}
      query UserJobs($userId: ID!) {
        userJobs(userId: $userId) {
          ...JobFields
        }
      }
    `,
  },
  Mutations: {
    createJob: gql`
      ${jobGqlResp}
      mutation CreateJob($userId: ID!, $jobInput: JobInput!) {
        createJob(userId: $userId, jobInput: $jobInput) {
          ...JobFields
        }
      }
    `,
    updateJob: gql`
      ${jobGqlResp}
      mutation UpdateJob(
        $id: ID!
        $imagesToDelete: [ID!]
        $jobInput: JobInput!
      ) {
        updateJob(
          id: $id
          imagesToDelete: $imagesToDelete
          jobInput: $jobInput
        ) {
          ...JobFields
        }
      }
    `,
    deleteJob: gql`
      ${jobGqlResp}
      mutation DeleteJob($id: ID!) {
        deleteJob(id: $id) {
          ...JobFields
        }
      }
    `,
  },
};

/**
 * INTERFACES/TYPES
 */
export interface IJob extends JobInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  skills: ISkill[];
  budget: IJobBudget;
  address: IAddress;
  images?: IImage[];
  userId?: string;
  user?: IUser;
  __typename?: string;
  [key: string]: any;
}
interface IJobBudget extends JobBudgetInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

//types
type JobSize = "Small" | "Medium" | "Large";
type BudgetType = "Hourly" | "Project";

//inputes
interface JobBudgetInput {
  type: BudgetType;
  from: number;
  to: number;
  maxHours: number;
}
export interface JobInput {
  title: string;
  desc: string;
  jobSize: JobSize;
  skills: SkillInput[];
  budget: JobBudgetInput;
  address: AddressInput;
  images?: ImageInput[];
}

/**
 * OPERATIONS
 */
//job op
interface IUseJobData {
  job: IJob;
}
interface IUseJobInput {
  id: string;
}
interface IJobIAsync {
  variables: IUseJobInput;
  onSuccess?: (data: IJob) => void;
  onError?: (error?: any) => void;
}
export const useJob = () => {
  const client = useApolloClient();
  const [job, { data, loading, error }] = useLazyQuery<
    IUseJobData,
    IUseJobInput
  >(jobOps.Queries.job);

  const jobAsync = async ({ variables, onSuccess, onError }: IJobIAsync) =>
    asyncOps({
      operation: () => job({ variables }),
      onSuccess: (dt: IUseJobData) => onSuccess && onSuccess(dt.job),
      onError,
    });

  const updateJobCache = (job: IJob) => {
    client.cache.writeFragment({
      id: client.cache.identify(job),
      fragment: gql`
        ${jobGqlResp}
        fragment UpdatedJob on Job {
          ...JobFields
        }
      `,
      fragmentName: "UpdatedJob",
      data: job,
    });
  };

  return { jobAsync, updateJobCache, data, loading, error };
};

//userJobs op
interface IUserJobsData {
  userJobs: IJob[];
}
interface IUserJobsInput {
  userId: string;
}
interface IUserJobsIAsync {
  variables: IUserJobsInput;
  onSuccess?: (data: IJob[]) => void;
  onError?: (error?: any) => void;
}
export const useUserJobs = () => {
  const client = useApolloClient();
  const [userJobs, { data, loading, error }] = useLazyQuery<
    IUserJobsData,
    IUserJobsInput
  >(jobOps.Queries.userJobs);

  const userJobsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IUserJobsIAsync) =>
    asyncOps({
      operation: () => userJobs({ variables }),
      onSuccess: (dt: IUserJobsData) => onSuccess && onSuccess(dt.userJobs),
      onError,
    });

  const updateUserJobsCache = (
    action: "create" | "update" | "delete",
    job: IJob,
    userId: string
  ) => {
    const cachedData = client.readQuery<IUserJobsData, IUserJobsInput>({
      query: jobOps.Queries.userJobs,
      variables: { userId },
    });

    if (cachedData) {
      let modifiedData: IJob[] = [...cachedData.userJobs];
      switch (action) {
        case "create":
          modifiedData.push(job);
          break;
        case "update":
          modifiedData = modifiedData.map((j) => (j.id === job.id ? job : j));
          break;
        case "delete":
          modifiedData = modifiedData.filter((j) => j.id !== job.id);
          break;
        default:
          throw new Error("Invalid action type");
      }

      client.writeQuery<IUserJobsData, IUserJobsInput>({
        query: jobOps.Queries.userJobs,
        data: { userJobs: modifiedData },
        variables: { userId },
      });
    }
  };

  return { userJobsAsync, updateUserJobsCache, data, loading, error };
};

//createJob op
interface ICreateJobData {
  createJob: IJob;
}
interface ICreateJobInput {
  userId: string;
  jobInput: JobInput;
}
interface ICreateJobIAsync {
  variables: ICreateJobInput;
  onSuccess?: (data: IJob) => void;
  onError?: (error?: any) => void;
}
export const useCreateJob = () => {
  const [createJob, { data, loading, error }] = useMutation<
    ICreateJobData,
    ICreateJobInput
  >(jobOps.Mutations.createJob);
  const { updateUserJobsCache } = useUserJobs();

  const createJobAsync = async ({
    variables,
    onSuccess,
    onError,
  }: ICreateJobIAsync) =>
    asyncOps({
      operation: () => createJob({ variables }),
      onSuccess: (dt: ICreateJobData) => {
        onSuccess && onSuccess(dt.createJob);
        updateUserJobsCache("create", dt.createJob, variables.userId);
      },
      onError,
    });

  return { createJobAsync, data, loading, error };
};

//updateJob op
export type ImagesToDelete = string[];
interface IUpdateJobData {
  updateJob: IJob;
}
interface IUpdateJobInput {
  id: string;
  jobInput: JobInput;
  imagesToDelete?: ImagesToDelete;
}
interface IUpdateJobIAsync {
  variables: IUpdateJobInput;
  userId: string;
  onSuccess?: (data: IJob) => void;
  onError?: (error?: any) => void;
}
export const useUpdateJob = () => {
  const [updateJob, { data, loading, error }] = useMutation<
    IUpdateJobData,
    IUpdateJobInput
  >(jobOps.Mutations.updateJob);
  const { updateUserJobsCache } = useUserJobs();
  const { updateJobCache } = useJob();

  const updateJobAsync = async ({
    variables,
    onSuccess,
    onError,
    userId,
  }: IUpdateJobIAsync) =>
    asyncOps({
      operation: () => updateJob({ variables }),
      onSuccess: (dt: IUpdateJobData) => {
        onSuccess && onSuccess(dt.updateJob);
        updateUserJobsCache("update", dt.updateJob, userId);
        updateJobCache(dt.updateJob);
      },
      onError,
    });

  return { updateJobAsync, data, loading, error };
};

//deleteJob op
interface IDeleteJobData {
  deleteJob: IJob;
}
interface IDeleteJobInput {
  id: string;
}
interface IDeleteJobIAsync {
  variables: IDeleteJobInput;
  userId: string;
  onSuccess?: (data: IJob) => void;
  onError?: (error?: any) => void;
}
export const useDeleteJob = () => {
  const [deleteJob, { data, loading, error }] = useMutation<
    IDeleteJobData,
    IDeleteJobInput
  >(jobOps.Mutations.deleteJob);
  const { updateUserJobsCache } = useUserJobs();

  const deleteJobAsync = async ({
    variables,
    onSuccess,
    onError,
    userId,
  }: IDeleteJobIAsync) =>
    asyncOps({
      operation: () => deleteJob({ variables }),
      onSuccess: (dt: IDeleteJobData) => {
        onSuccess && onSuccess(dt.deleteJob);
        updateUserJobsCache("delete", dt.deleteJob, userId);
      },
      onError,
    });

  return { deleteJobAsync, data, loading, error };
};
