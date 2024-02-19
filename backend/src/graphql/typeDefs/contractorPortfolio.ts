import gql from "graphql-tag";

export default gql`
  type Mutation {
    addContractorPortfolio(
      contractorId: ID!
      description: String!
      images: [PortfolioImageInput]
    ): ContractorPortfolio!

    updateContractorPortfolio(
      id: ID!
      description: String!
      images: [PortfolioImageInput]
    ): ContractorPortfolio!

    deleteContractorPortfolio(id: ID!): Boolean!
  }

  input PortfolioImageInput {
    url: String!
    name: String
    type: String
    size: Float
  }

  type ContractorPortfolio {
    id: ID
    description: String!
    images: [PortfolioImage!]
    createdAt: Date
    updatedAt: Date
    contractorId: ID
    contractor: Contractor
  }

  type PortfolioImage {
    id: ID
    url: String!
    name: String
    type: String
    size: Float
    createdAt: Date
    updatedAt: Date
  }
`;
