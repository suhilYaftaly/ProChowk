import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { asyncOps } from "./gqlFuncs";

export const skillGqlResp = gql`
  fragment SkillFields on Skill {
    id
    label
    createdAt
    updatedAt
  }
`;

const skillOps = {
  Queries: {
    skills: gql`
      ${skillGqlResp}
      query Query {
        skills {
          ...SkillFields
        }
      }
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
interface ISkillsIAsync {
  onSuccess?: (data: ISkill[]) => void;
  onError?: (error?: any) => void;
}

export const useSkills = () => {
  const client = useApolloClient();
  const [skills, { data, loading, error }] = useLazyQuery<ISkillsData>(
    skillOps.Queries.skills
  );

  const skillsAsync = async ({ onSuccess, onError }: ISkillsIAsync) =>
    asyncOps({
      operation: () => skills(),
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
