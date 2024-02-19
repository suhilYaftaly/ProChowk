import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { asyncOps } from "./gqlFuncs";
import { skillFields } from "../gqlFrags";

const skillOps = {
  Queries: {
    skills: gql`
      query Query($search: String!, $limit: Int) {skills(search: $search, limit: $limit) {${skillFields}}}
    `,
  },
};

/**
 * INTERFACES
 */
export interface ISkill {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}
export interface SkillInput {
  label: string;
}

/**
 * OPERATIONS
 */
interface ISkillsData {
  skills: ISkill[];
}
type TSkillsSearchInput = { search: string; limit?: number };
interface ISkillsIAsync {
  variables: TSkillsSearchInput;
  onSuccess?: (data: ISkill[]) => void;
  onError?: (error?: any) => void;
}

export const useSkills = () => {
  const client = useApolloClient();
  const [skills, { data, loading, error }] = useLazyQuery<
    ISkillsData,
    TSkillsSearchInput
  >(skillOps.Queries.skills);

  const skillsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: ISkillsIAsync) =>
    asyncOps({
      operation: () => skills({ variables }),
      onSuccess: (dt: ISkillsData) => onSuccess && onSuccess(dt.skills),
      onError,
    });

  const updateCache = (
    action: "create" | "update" | "delete",
    skillsToUpdate: ISkill[]
  ) => {
    const cachedData = client.readQuery<ISkillsData>({
      query: skillOps.Queries.skills,
    });

    if (cachedData) {
      let newData = { ...cachedData };
      switch (action) {
        case "create":
          newData.skills = [...newData.skills, ...skillsToUpdate];
          break;
        case "update":
          skillsToUpdate.forEach((skill) => {
            newData.skills = newData.skills.map((eSkill) =>
              eSkill.label === skill.label ? skill : eSkill
            );
          });
          break;
        case "delete":
          skillsToUpdate.forEach((skill) => {
            newData.skills = newData.skills.filter(
              (eSkill) => eSkill.label !== skill.label
            );
          });
          break;
        default:
          return;
      }

      client.writeQuery({
        query: skillOps.Queries.skills,
        data: newData,
      });
    }
  };

  return { skillsAsync, updateCache, data, loading, error };
};
