import { gql } from "graphql-tag";

const addressFields = `
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

  type GeoJson {
    type: String!
    coordinates: [Float!]!
  }

  type Query {
    geocode(value: String!, lat: Float!, lng: Float!, limit: Float): [Geocode!]! @rateLimit(limit: 100, duration: 60)
    reverseGeocode(lat: Float!, lng: Float!): Geocode! @rateLimit(limit: 100, duration: 60)
  }

  type Geocode {
    ${addressFields}
    geometry: GeoJson!
    source: GraphQLJSON
  }

  type Address {
    id: ID!
    ${addressFields}
    geometry: GeoJson!
    createdAt: String!
    updatedAt: String!
  }
  type LatLng{
    lat: Float!
    lng: Float!
  }
  input LatLngInput{
    lat: Float!
    lng: Float!
  }
  input GeoJsonInput {
    type: String!
    coordinates: [Float!]!
  }
  input AddressInput {
    ${addressFields}
    geometry: GeoJsonInput!
  }
`;
