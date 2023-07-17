import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";

const jobsOps = {
  Queries: {
    searchJobs: gql`
      query SearchJobs($userId: ID!) {
        searchJobs(userId: $userId) {
          id
          title
          desc
          jobSize
          createdAt
          updatedAt
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
  createdAt: string | Date;
  updatedAt: string | Date;
  user: IUser;
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

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IUpdateJobInput {
  id?: string;
  props: JobInput;
}
interface IUpdateJobData {
  updateJob: IJob;
}
interface ISearchJobsInput {
  userId: string;
}
interface ISearchJobsData {
  searchJobs: IJob[];
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

//APIs
export const useUpdateJob = () => {
  const client = useApolloClient();
  const [
    updateJob,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateJobData, IUpdateJobInput>(jobsOps.Mutations.updateJob);

  const [
    deleteJob,
    { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation<boolean, { id: string }>(jobsOps.Mutations.deleteJob);

  const updateJobAsync = async ({ userId, id, props }: IUpdateJobAsync) => {
    try {
      const { data } = await updateJob({ variables: { id, props } });
      if (data?.updateJob && userId) {
        const cachedData = client.readQuery<ISearchJobsData, ISearchJobsInput>({
          query: jobsOps.Queries.searchJobs,
          variables: { userId },
        });

        if (cachedData) {
          const { updateJob } = data;
          let updatedJobs = cachedData.searchJobs.map((job) =>
            job.id === updateJob.id ? updateJob : job
          );
          // If the job was not found in the cache, add it
          if (!updatedJobs.some((job) => job.id === id)) {
            updatedJobs.unshift(updateJob);
          }

          client.writeQuery<ISearchJobsData, ISearchJobsInput>({
            query: jobsOps.Queries.searchJobs,
            data: { searchJobs: updatedJobs },
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
        const cachedData = client.readQuery<ISearchJobsData, ISearchJobsInput>({
          query: jobsOps.Queries.searchJobs,
          variables: { userId },
        });

        if (cachedData) {
          let updatedJobs = cachedData.searchJobs.filter(
            (job) => job.id !== id
          );
          client.writeQuery<ISearchJobsData, ISearchJobsInput>({
            query: jobsOps.Queries.searchJobs,
            data: { searchJobs: updatedJobs },
            variables: { userId },
          });
        }
      }
    } catch (error: any) {
      console.log("job deletion failed:", error.message);
    }
  };

  return {
    updateJobAsync,
    deleteJobAsync,
    updateData,
    updateError,
    updateLoading,
    deleteData,
    deleteError,
    deleteLoading,
  };
};

export const useSearchJobs = () => {
  const [searchJobs, { data, loading, error }] = useLazyQuery<
    ISearchJobsData,
    ISearchJobsInput
  >(jobsOps.Queries.searchJobs);

  const searchJobsAsync = async ({
    userId,
  }: {
    userId: string | undefined;
  }) => {
    if (userId) {
      try {
        const { data } = await searchJobs({ variables: { userId } });
        if (!data?.searchJobs) throw new Error();
      } catch (error: any) {
        console.log("get user info error:", error.message);
      }
    }
  };

  return { searchJobsAsync, data, loading, error };
};
