import { gql } from "@apollo/client";
import { SkillsInput } from "./contractor";

export default {
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
      mutation UpdateAllSkills($skills: [SkillsInput]) {
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
