import { gql } from "graphql-tag";

export default gql`
  scalar GraphQLJSON
  type Query {
    addressSearch(
      value: String!
      lat: Float!
      lng: Float!
      limit: Float
      source: String
    ): [AddressSearchData!]!
  }
  type AddressSearchData {
    id: ID!
    displayName: String!
    street: String
    city: String
    county: String
    state: String
    stateCode: String
    postalCode: String
    country: String
    countryCode: String
    lat: Float
    lng: Float
    source: GraphQLJSON
  }
`;
