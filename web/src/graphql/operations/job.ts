import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { ISkill, SkillInput, skillGqlResp } from "./skill";
import { IUser, userGqlResp } from "./user";
import { AddressInput, IAddress, LatLngInput, addressGqlResp } from "./address";
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
    startDate
    endDate
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

const jobGqlRespShort = gql`
  fragment JobFieldsShort on Job {
    id
    title
    desc
    jobSize
    userId
    createdAt
    skills {
      label
    }
    budget {
      type
      from
      to
      maxHours
    }
    address {
      city
      lat
      lng
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
    jobsByLocation: gql`
      ${jobGqlRespShort}
      query JobsByLocation(
        $latLng: LatLngInput!
        $radius: Float
        $page: Int
        $pageSize: Int
      ) {
        jobsByLocation(
          latLng: $latLng
          radius: $radius
          page: $page
          pageSize: $pageSize
        ) {
          ...JobFieldsShort
        }
      }
    `,
    jobsByText: gql`
      ${jobGqlRespShort}
      query JobsByText(
        $inputText: String!
        $latLng: LatLngInput!
        $radius: Float
        $page: Int
        $pageSize: Int
        $startDate: Date
        $endDate: Date
        $budget: JobsByTxtBudgetInput
      ) {
        jobsByText(
          inputText: $inputText
          latLng: $latLng
          radius: $radius
          page: $page
          pageSize: $pageSize
          startDate: $startDate
          endDate: $endDate
          budget: $budget
        ) {
          ...JobFieldsShort
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
      mutation UpdateJob($id: ID!, $jobInput: JobInput!) {
        updateJob(id: $id, jobInput: $jobInput) {
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
  images: IImage[];
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
export type BudgetType = "Hourly" | "Project";

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
  address?: AddressInput;
  images: ImageInput[];
  startDate?: string;
  endDate?: string;
  isDraft: boolean;
}

export interface JobsByTxtBudgetInput {
  types: BudgetType[];
  maxHours?: number;
  from?: number;
  to?: number;
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
          modifiedData.unshift(job);
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

//jobsByLocation op
interface IJobsByLocationData {
  jobsByLocation: IJob[];
}
interface IJobsByLocationInput {
  latLng: LatLngInput;
  radius?: number;
  page?: number;
  pageSize?: number;
}
interface IJobsByLocationIAsync {
  variables: IJobsByLocationInput;
  onSuccess?: (data: IJob[]) => void;
  onError?: (error?: any) => void;
}
export const useJobsByLocation = () => {
  const client = useApolloClient();
  const [jobsByLocation, { data, loading, error }] = useLazyQuery<
    IJobsByLocationData,
    IJobsByLocationInput
  >(jobOps.Queries.jobsByLocation);

  const jobsByLocationAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IJobsByLocationIAsync) =>
    asyncOps({
      operation: () => jobsByLocation({ variables }),
      onSuccess: (dt: IJobsByLocationData) =>
        onSuccess && onSuccess(dt.jobsByLocation),
      onError,
    });

  const updateCache = ({
    action,
    job,
    jobs,
    variables,
  }: {
    action: "create" | "update" | "delete" | "updateAll";
    job?: IJob;
    jobs?: IJob[];
    variables: IJobsByLocationInput;
  }) => {
    const cachedData = client.readQuery<
      IJobsByLocationData,
      IJobsByLocationInput
    >({
      query: jobOps.Queries.jobsByLocation,
      variables,
    });
    let modifiedData: IJob[] = [];
    if (cachedData && job) {
      modifiedData = [...cachedData.jobsByLocation];
      switch (action) {
        case "create":
          modifiedData.unshift(job);
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
    } else if (Array.isArray(jobs) && action === "updateAll")
      modifiedData = jobs;

    if (modifiedData !== undefined) {
      client.writeQuery<IJobsByLocationData, IJobsByLocationInput>({
        query: jobOps.Queries.jobsByLocation,
        data: { jobsByLocation: modifiedData },
        variables,
      });
    }
  };

  return { jobsByLocationAsync, updateCache, data, loading, error };
};

//jobsByText op
interface IJobsByTextData {
  jobsByText: IJob[];
}
interface IJobsByTextInput {
  inputText: string;
  latLng: LatLngInput;
  radius?: number;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  budget?: JobsByTxtBudgetInput;
}
interface IJobsByTextIAsync {
  variables: IJobsByTextInput;
  onSuccess?: (data: IJob[]) => void;
  onError?: (error?: any) => void;
}
export const useJobsByText = () => {
  const client = useApolloClient();
  const [jobsByText, { data, loading, error }] = useLazyQuery<
    IJobsByTextData,
    IJobsByTextInput
  >(jobOps.Queries.jobsByText);
  const { updateCache: updateJByLCache } = useJobsByLocation();

  const jobsByTextAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IJobsByTextIAsync) =>
    asyncOps({
      operation: () => jobsByText({ variables }),
      onSuccess: (dt: IJobsByTextData) => {
        onSuccess && onSuccess(dt.jobsByText);
        updateJByLCache({
          action: "updateAll",
          jobs: dt.jobsByText,
          variables,
        });
      },
      onError,
    });

  const updateCache = (
    action: "create" | "update" | "delete",
    job: IJob,
    variables: IJobsByTextInput
  ) => {
    const cachedData = client.readQuery<IJobsByTextData, IJobsByTextInput>({
      query: jobOps.Queries.jobsByText,
      variables,
    });

    if (cachedData) {
      let modifiedData: IJob[] = [...cachedData.jobsByText];
      switch (action) {
        case "create":
          modifiedData.unshift(job);
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

      client.writeQuery<IJobsByTextData, IJobsByTextInput>({
        query: jobOps.Queries.jobsByText,
        data: { jobsByText: modifiedData },
        variables,
      });
    }
  };

  return { jobsByTextAsync, updateCache, data, loading, error };
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
interface IUpdateJobData {
  updateJob: IJob;
}
interface IUpdateJobInput {
  id: string;
  jobInput: JobInput;
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
  latLng: LatLngInput;
  onSuccess?: (data: IJob) => void;
  onError?: (error?: any) => void;
}
export const useDeleteJob = () => {
  const [deleteJob, { data, loading, error }] = useMutation<
    IDeleteJobData,
    IDeleteJobInput
  >(jobOps.Mutations.deleteJob);
  const { updateUserJobsCache } = useUserJobs();
  const { updateCache: updateJByLCache } = useJobsByLocation();

  const deleteJobAsync = async ({
    variables,
    onSuccess,
    onError,
    userId,
    latLng,
  }: IDeleteJobIAsync) =>
    asyncOps({
      operation: () => deleteJob({ variables }),
      onSuccess: (dt: IDeleteJobData) => {
        onSuccess && onSuccess(dt.deleteJob);
        updateUserJobsCache("delete", dt.deleteJob, userId);
        updateJByLCache({
          action: "delete",
          job: dt.deleteJob,
          variables: { latLng },
        });
      },
      onError,
    });

  return { deleteJobAsync, data, loading, error };
};
