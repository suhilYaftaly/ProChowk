import { gql } from "graphql-tag";

export default gql`
  type Query {
    getAllSkills: AllSkills!
  }

  type Mutation {
    updateAllSkills(skills: [SkillsInput!]!): AllSkills!
  }

  input SkillsInput {
    label: String!
  }

  type Skill {
    label: String!
  }

  type AllSkills {
    id: ID!
    type: String!
    data: [Skill!]!
  }
`;
