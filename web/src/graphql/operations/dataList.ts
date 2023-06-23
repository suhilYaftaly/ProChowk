import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { SkillsInput } from "./contractor";

const dataListOps = {
  Queries: {
    getAllSkills: gql`
      query GetAllSkills {
        getAllSkills {
          id
          type
          data {
            label
          }
        }
      }
    `,
  },
  Mutations: {
    updateAllSkills: gql`
      mutation UpdateAllSkills($skills: [SkillsInput!]!) {
        updateAllSkills(skills: $skills) {
          id
          type
          data {
            label
          }
        }
      }
    `,
  },
};

export default dataListOps;

interface IDataListData {
  id: string;
  type: "skills";
  data: any[];
}

interface SkillsData extends IDataListData {
  type: "skills";
  data: SkillsInput[];
}

export interface IGetAllSkillsData {
  getAllSkills: SkillsData;
}

export interface IUpdateAllSkillsData {
  updateAllSkills: SkillsData;
}
export interface IUpdateAllSkillsInput {
  skills: SkillsInput[];
}

interface IUseUpdateAllSkills {
  skills: SkillsInput[];
}
export const useUpdateAllSkills = () => {
  const client = useApolloClient();
  const [updateAllSkills] = useMutation<
    IUpdateAllSkillsData,
    IUpdateAllSkillsInput
  >(dataListOps.Mutations.updateAllSkills);

  const updateAllSkillsAsync = async ({ skills }: IUseUpdateAllSkills) => {
    try {
      const { data } = await updateAllSkills({
        variables: { skills },
      });

      //update cached data
      if (data?.updateAllSkills) {
        const cachedData = client.readQuery<IGetAllSkillsData>({
          query: dataListOps.Queries.getAllSkills,
        });

        if (cachedData) {
          const modifiedData = {
            ...cachedData,
            data: data.updateAllSkills.data,
          };

          client.writeQuery<IGetAllSkillsData>({
            query: dataListOps.Queries.getAllSkills,
            data: modifiedData,
          });
        }
      } else throw new Error();
    } catch (error: any) {
      console.log("update all skills failed:", error.message);
    }
  };

  return { updateAllSkillsAsync };
};

export const useGetAllSkills = () => {
  const [getAllSkills, { data, loading, error }] =
    useLazyQuery<IGetAllSkillsData>(dataListOps.Queries.getAllSkills);

  const getAllSkillsAsync = async () => {
    try {
      const { data } = await getAllSkills();
      if (!data?.getAllSkills) throw new Error();
    } catch (error: any) {
      console.log("get all skills failed:", error.message);
    }
  };

  return { getAllSkillsAsync, data, loading, error };
};
