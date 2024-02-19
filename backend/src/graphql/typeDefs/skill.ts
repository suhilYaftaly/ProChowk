import { gql } from "graphql-tag";

export default gql`
  type Query {
    skills(search: String!, limit: Int): [Skill!]!
  }
  type Skill {
    id: ID
    label: String!
    createdAt: String
    updatedAt: String
  }
  input SkillInput {
    label: String!
  }
`;
