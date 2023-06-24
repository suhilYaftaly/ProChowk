import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";

const contOps = {
  Queries: {
    searchContrProf: gql`
      query SearchContrProf($userId: ID!) {
        searchContrProf(userId: $userId) {
          id
          licenses {
            name
            desc
            type
            size
            picture
          }
          skills {
            label
          }
          user {
            id
            name
            email
          }
        }
      }
    `,
  },
  Mutations: {
    updateContrProf: gql`
      mutation UpdateContrProf(
        $skills: [SkillsInput]
        $licenses: [LicensesInput]
      ) {
        updateContrProf(skills: $skills, licenses: $licenses) {
          id
          licenses {
            name
            desc
            type
            size
            picture
          }
          skills {
            label
          }
          user {
            id
            name
            email
          }
        }
      }
    `,
  },
};
export default contOps;

export interface LicensesInput {
  name: string;
  size: number;
  type: string;
  desc: string;
  picture: string;
}

export interface SkillsInput {
  label: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export interface IContractorData {
  id: string;
  skills: SkillsInput[];
  licenses: LicensesInput[];
  user: User;
}

export interface IUpdateContrProfData {
  updateContrProf: IContractorData;
}

export interface IUpdateContrProfInput {
  skills?: SkillsInput[] | null;
  licenses?: LicensesInput[] | null;
}

export interface ISearchContrProfData {
  searchContrProf: IContractorData;
}
export interface ISearchContrProfInput {
  userId: string;
}

interface IUpdateContrProfAsync {
  userId: string | undefined;
  variables: IUpdateContrProfInput;
  onSuccess: () => void;
}

export const useUpdateContrProf = () => {
  const client = useApolloClient();
  const [updateContrProf, { data, error, loading }] = useMutation<
    IUpdateContrProfData,
    IUpdateContrProfInput
  >(contOps.Mutations.updateContrProf);
  const [searchContrProf] = useLazyQuery<
    ISearchContrProfData,
    ISearchContrProfInput
  >(contOps.Queries.searchContrProf);

  const updateContrProfAsync = async ({
    userId,
    variables,
    onSuccess,
  }: IUpdateContrProfAsync) => {
    try {
      const { data } = await updateContrProf({ variables });

      //update the cached data
      if (data?.updateContrProf && userId) {
        const cachedData = client.readQuery<
          ISearchContrProfData,
          ISearchContrProfInput
        >({
          query: contOps.Queries.searchContrProf,
          variables: { userId },
        });

        if (cachedData) {
          const modifiedData = { ...cachedData, ...data.updateContrProf };
          client.writeQuery<ISearchContrProfData, ISearchContrProfInput>({
            query: contOps.Queries.searchContrProf,
            data: modifiedData,
            variables: { userId },
          });
        } else {
          const { data: searchUserData } = await searchContrProf({
            variables: { userId },
          });
          if (!searchUserData?.searchContrProf) throw new Error();
        }

        onSuccess();
      } else throw new Error();
    } catch (error: any) {
      console.log("contractor update failed:", error.message);
    }
  };

  return { updateContrProfAsync, data, error, loading };
};
