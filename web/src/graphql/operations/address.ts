import { gql, useLazyQuery } from "@apollo/client";

const addressOps = {
  Queries: {
    addressSearch: gql`
      query Query(
        $value: String!
        $lat: Float!
        $lng: Float!
        $limit: Float
        $source: String
      ) {
        addressSearch(
          value: $value
          lat: $lat
          lng: $lng
          limit: $limit
          source: $source
        ) {
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
          source
        }
      }
    `,
  },
};

export default addressOps;

type source = "MapQuest";
export interface IAddressData {
  id?: string;
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
  source?: { source: source; [key: string]: any };
}
interface IASData {
  addressSearch: IAddressData[];
}
interface IASInput {
  value: string;
  lat: number;
  lng: number;
  limit?: number;
  source?: source;
}

interface IASAsyncInput {
  vars: IASInput;
  onSuccess?: (res: IAddressData[]) => void;
}
export const useAddressSearch = () => {
  const [addressSearch, { data, loading, error }] = useLazyQuery<
    IASData,
    IASInput
  >(addressOps.Queries.addressSearch);

  const addressSearchAsync = async ({ vars, onSuccess }: IASAsyncInput) => {
    try {
      const { data } = await addressSearch({ variables: vars });
      if (data?.addressSearch) {
        onSuccess && onSuccess(data.addressSearch);
      } else throw new Error();
    } catch (error: any) {
      console.log("address search error:", error.message);
    }
  };

  return { addressSearchAsync, data, loading, error };
};
