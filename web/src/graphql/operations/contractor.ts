import { gql } from "@apollo/client";

export default {
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

interface LicensesInput {
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
