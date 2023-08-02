import { gql, useLazyQuery } from "@apollo/client";
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
  const [skills, { data, loading, error }] = useLazyQuery<ISkillsData>(
    skillOps.Queries.skills
  );

  const skillsAsync = async ({ onSuccess, onError }: ISkillsIAsync) =>
    asyncOps({
      operation: () => skills(),
      onSuccess: (dt: ISkillsData) => onSuccess && onSuccess(dt.skills),
      onError,
    });

  return { skillsAsync, data, loading, error };
};
