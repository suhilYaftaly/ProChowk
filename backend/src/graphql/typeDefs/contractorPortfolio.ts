import gql from "graphql-tag";

export default gql`
  type Query {
    getContractorPortfolios(contractorId: ID!): [ContractorPortfolio!]!
  }

  type Mutation {
    addContractorPortfolio(
      contractorId: ID!
      title: String!
      description: String
      images: [ImageInput!]!
    ): ContractorPortfolio!

    updateContractorPortfolio(
      id: ID!
      title: String!
      description: String
      images: [ImageInput!]
    ): ContractorPortfolio!

    deleteContractorPortfolio(id: ID!): Boolean!
  }

  type ContractorPortfolio {
    id: ID!
    title: String!
    description: String
    images: [Image!]
    createdAt: Date
    updatedAt: Date
    contractorId: ID
    contractor: Contractor
  }
`;
