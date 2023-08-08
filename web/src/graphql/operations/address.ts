import { gql, useLazyQuery } from "@apollo/client";
import { asyncOps } from "./gqlFuncs";

const geoJsonGqlResp = gql`
  fragment GeoJsonFields on GeoJson {
    type
    coordinates
  }
`;
const geocodeGqlResp = gql`
  ${geoJsonGqlResp}
  fragment GeocodeFields on Geocode {
    displayName
    street
    city
    county
    state
    stateCode
    postalCode
    country
    countryCode
    lat
    lng
    source
    geometry {
      ...GeoJsonFields
    }
  }
`;
export const addressGqlResp = gql`
  ${geoJsonGqlResp}
  fragment AddressFields on Address {
    id
    displayName
    street
    city
    county
    state
    stateCode
    postalCode
    country
    countryCode
    lat
    lng
    createdAt
    updatedAt
    geometry {
      ...GeoJsonFields
    }
  }
`;

const addressOps = {
  Queries: {
    geocode: gql`
      ${geocodeGqlResp}
      query Query($value: String!, $lat: Float!, $lng: Float!, $limit: Float) {
        geocode(value: $value, lat: $lat, lng: $lng, limit: $limit) {
          ...GeocodeFields
        }
      }
    `,
    reverseGeocode: gql`
      ${geocodeGqlResp}
      query Query($lat: Float!, $lng: Float!) {
        reverseGeocode(lat: $lat, lng: $lng) {
          ...GeocodeFields
        }
      }
    `,
  },
};

/**
 * INTERFACES
 */
interface GeoJson {
  type: string;
  coordinates: number[];
}
interface IGeoAddress {
  displayName: string;
  street: string;
  city: string;
  county: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  source?: any;
  geometry: GeoJson;
}
export interface IAddress extends IGeoAddress {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface ILatLng extends LatLngInput {}
//inputs
export interface LatLngInput {
  lat: number;
  lng: number;
}
export interface GeoJsonInput extends GeoJson {}
export interface AddressInput extends IGeoAddress {
  geometry: GeoJsonInput;
}

/**
 * OPERATIONS
 */
interface IGeocodeData {
  geocode: IGeoAddress[];
}
interface IGeocodeI {
  value: string;
  lat: number;
  lng: number;
  limit?: number;
}
interface IGeocodeAsyncI {
  vars: IGeocodeI;
  onSuccess?: (res: IGeoAddress[]) => void;
}
export const useGeocode = () => {
  const [geocode, { data, loading, error }] = useLazyQuery<
    IGeocodeData,
    IGeocodeI
  >(addressOps.Queries.geocode);

  const geocodeAsync = async ({ vars, onSuccess }: IGeocodeAsyncI) =>
    asyncOps({
      operation: () => geocode({ variables: vars }),
      onSuccess: (dt: IGeocodeData) => onSuccess && onSuccess(dt.geocode),
    });

  return { geocodeAsync, data, loading, error };
};

interface IReverseGeocodeInput {
  lat: number;
  lng: number;
}
interface IReverseGeocodeData {
  reverseGeocode: IGeoAddress;
}
interface IRGAsyncInput {
  variables: IReverseGeocodeInput;
  onSuccess?: (data: IGeoAddress) => void;
  onError?: (error?: any) => void;
}
export const useReverseGeocode = () => {
  const [reverseGeocode, { data, loading, error }] = useLazyQuery<
    IReverseGeocodeData,
    IReverseGeocodeInput
  >(addressOps.Queries.reverseGeocode);

  const reverseGeocodeAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IRGAsyncInput) =>
    asyncOps({
      operation: () => reverseGeocode({ variables }),
      onSuccess: (dt: IReverseGeocodeData) =>
        onSuccess && onSuccess(dt.reverseGeocode),
      onError,
    });

  return { reverseGeocodeAsync, data, loading, error };
};
