import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { asyncOps } from "./gqlFuncs";
import { addressFields, geocodeFields } from "../gqlFrags";

const geoJsonGqlResp = `type coordinates`;
const geocodeGqlResp = `${geocodeFields} geometry {${geoJsonGqlResp}}`;
export const addressGqlResp = `${addressFields} geometry {${geoJsonGqlResp}}`;

const addressOps = {
  Queries: {
    geocode: gql`
      query Query($value: String!, $lat: Float, $lng: Float, $limit: Float) {
        geocode(value: $value, lat: $lat, lng: $lng, limit: $limit) {${geocodeGqlResp}}
      }
    `,
    reverseGeocode: gql`
      query Query($lat: Float!, $lng: Float!) {
        reverseGeocode(lat: $lat, lng: $lng) {${geocodeGqlResp}}
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
export interface IGeoAddress {
  displayName: string;
  street?: string;
  city: string;
  county: string;
  state: string;
  stateCode: string;
  postalCode?: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
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
  lat?: number;
  lng?: number;
  limit?: number;
}
interface IGeocodeAsyncI {
  vars: IGeocodeI;
  onSuccess?: (res: IGeoAddress[]) => void;
}
export const useGeocode = () => {
  const client = useApolloClient();
  const [geocode, { data, loading, error }] = useLazyQuery<
    IGeocodeData,
    IGeocodeI
  >(addressOps.Queries.geocode);

  const geocodeAsync = async ({ vars, onSuccess }: IGeocodeAsyncI) =>
    asyncOps({
      operation: () => geocode({ variables: vars }),
      onSuccess: (dt: IGeocodeData) => onSuccess && onSuccess(dt.geocode),
    });

  const updateGeocodeCache = (newData: IGeoAddress[]) => {
    client.writeQuery<IGeocodeData, IGeocodeI>({
      query: addressOps.Queries.geocode,
      data: { geocode: newData },
    });
  };

  return { geocodeAsync, updateGeocodeCache, data, loading, error };
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
