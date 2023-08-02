import { gql } from "graphql-tag";
const locationFields = `
  displayName: String!
  street: String
  city: String
  county: String
  state: String
  stateCode: String
  postalCode: String
  country: String
  countryCode: String
  lat: Float!
  lng: Float!
`;

export default gql`
  scalar GraphQLJSON
  type Query {
    geocode(value: String!, lat: Float!, lng: Float!, limit: Float): [Geocode!]!
    reverseGeocode(lat: Float!, lng: Float!): Geocode!
  }
  type Geocode {
    ${locationFields}
    source: GraphQLJSON
  }
  type Address {
    id: ID!
    ${locationFields}
    createdAt: String!
    updatedAt: String!
  }

  input AddressInput {
    ${locationFields}
  }
`;
