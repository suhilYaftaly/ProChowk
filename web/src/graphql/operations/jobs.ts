import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";

const jobsOps = {
  Queries: {
    getUserJobs: gql`
      query GetUserJobs($userId: ID!) {
        getUserJobs(userId: $userId) {
          id
          title
          desc
          jobSize
          createdAt
          updatedAt
          userId
          userEmail
          skills {
            label
          }
          budget {
            type
            from
            to
            maxHours
          }
          images {
            id
            name
            size
            type
            picture
          }
          address {
            displayName
            street
            city
            county
            state
            stateCode
            postalCode
            country
            countryCode
            lat
            lng
          }
        }
      }
    `,
    getJob: gql`
      query GetJob($id: ID!) {
        getJob(id: $id) {
          id
          title
          desc
          jobSize
          createdAt
          updatedAt
          userId
          userEmail
          skills {
            label
          }
          budget {
            type
            from
            to
            maxHours
          }
          images {
            id
            name
            size
            type
            picture
          }
          address {
            displayName
            street
            city
            county
            state
            stateCode
            postalCode
            country
            countryCode
            lat
            lng
          }
        }
      }
    `,
  },
  Mutations: {
    updateJob: gql`
      mutation UpdateJob($id: ID, $props: JobInput!) {
        updateJob(id: $id, props: $props) {
          id
          title
          desc
          jobSize
          createdAt
          updatedAt
          userId
          userEmail
          skills {
            label
          }
          budget {
            type
            from
            to
            maxHours
          }
          images {
            id
            name
            size
            type
            picture
          }
          address {
            displayName
            street
            city
            county
            state
            stateCode
            postalCode
            country
            countryCode
            lat
            lng
          }
        }
      }
    `,
    deleteJob: gql`
      mutation DeleteJob($id: ID!) {
        deleteJob(id: $id)
      }
    `,
  },
};

export default jobsOps;

//TYPES
type JobSize = "Small" | "Medium" | "Large";
interface IJobBudget {
  type: "Hourly" | "Project";
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
export interface IJob {
  id: string;
  title: string;
  desc: string;
  jobSize: JobSize;
  skills: ISkill[];
  budget: IJobBudget;
  address: IJobAddress;
  images?: IImage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  userEmail: string;
}
export interface JobInput {
  title: string;
  desc: string;
  jobSize: JobSize;
  skills: ISkill[];
  budget: IJobBudget;
  address: IJobAddress;
  images?: IImage[];
}

interface IUpdateJobInput {
  id?: string;
  props: JobInput;
}
interface IUpdateJobData {
  updateJob: IJob;
}
interface IGetUserJobsInput {
  userId: string;
}
interface IGetUserJobsData {
  getUserJobs: IJob[];
}

interface IUpdateJobAsync {
  userId: string;
  id?: string;
  props: JobInput;
}
interface IDeleteJobAsync {
  userId: string;
  id: string;
}

interface IGetJobInput {
  id: string;
}
interface IGetJobData {
  getJob: IJob;
}

//APIs
export const useUpdateJob = () => {
  const client = useApolloClient();
  const [
    updateJob,
    { data: updatePData, error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateJobData, IUpdateJobInput>(jobsOps.Mutations.updateJob);

  const [deleteJob] = useMutation<boolean, { id: string }>(
    jobsOps.Mutations.deleteJob
  );

  const updateJobAsync = async ({ userId, id, props }: IUpdateJobAsync) => {
    try {
      const { data } = await updateJob({ variables: { id, props } });
      if (data?.updateJob && userId) {
        const cachedData = client.readQuery<
          IGetUserJobsData,
          IGetUserJobsInput
        >({
          query: jobsOps.Queries.getUserJobs,
          variables: { userId },
        });

        if (cachedData) {
          const { updateJob } = data;
          let updatedJobs = cachedData.getUserJobs.map((job) =>
            job.id === updateJob.id ? updateJob : job
          );
          // If the job was not found in the cache, add it
          if (!updatedJobs.some((job) => job.id === id)) {
            updatedJobs.unshift(updateJob);
          }

          client.writeQuery<IGetUserJobsData, IGetUserJobsInput>({
            query: jobsOps.Queries.getUserJobs,
            data: { getUserJobs: updatedJobs },
            variables: { userId },
          });
        }
      }
    } catch (error: any) {
      console.log("job update failed:", error.message);
    }
  };

  const deleteJobAsync = async ({ userId, id }: IDeleteJobAsync) => {
    try {
      await deleteJob({ variables: { id } });
      if (userId) {
        const cachedData = client.readQuery<
          IGetUserJobsData,
          IGetUserJobsInput
        >({
          query: jobsOps.Queries.getUserJobs,
          variables: { userId },
        });

        if (cachedData) {
          let updatedJobs = cachedData.getUserJobs.filter(
            (job) => job.id !== id
          );
          client.writeQuery<IGetUserJobsData, IGetUserJobsInput>({
            query: jobsOps.Queries.getUserJobs,
            data: { getUserJobs: updatedJobs },
            variables: { userId },
          });
        }
      }
    } catch (error: any) {
      console.log("job deletion failed:", error.message);
    }
  };

  const updateData = updatePData?.updateJob;

  return {
    updateJobAsync,
    deleteJobAsync,
    updateData,
    updateError,
    updateLoading,
  };
};

export const useGetUserJobs = () => {
  const [getUserJobs, { data: pData, loading, error }] = useLazyQuery<
    IGetUserJobsData,
    IGetUserJobsInput
  >(jobsOps.Queries.getUserJobs);

  const getUserJobsAsync = async ({
    userId,
  }: {
    userId: string | undefined;
  }) => {
    if (userId) {
      try {
        const { data } = await getUserJobs({ variables: { userId } });
        if (!data?.getUserJobs) throw new Error();
      } catch (error: any) {
        console.log("get user info error:", error.message);
      }
    }
  };

  const data = pData?.getUserJobs;

  return { getUserJobsAsync, data, loading, error };
};

export const useGetJob = () => {
  const [getJob, { data: pData, loading, error }] = useLazyQuery<
    IGetJobData,
    IGetJobInput
  >(jobsOps.Queries.getJob);

  const getJobAsync = async ({ id }: { id: string }) => {
    if (id) {
      try {
        const { data } = await getJob({ variables: { id } });
        if (!data?.getJob) throw new Error();
      } catch (error: any) {
        console.log("get user info error:", error.message);
      }
    }
  };

  const data = pData?.getJob;

  return { getJobAsync, data, loading, error };
};
