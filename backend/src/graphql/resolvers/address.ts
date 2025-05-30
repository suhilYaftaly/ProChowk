import axios from "axios";
import { Address } from "@prisma/client";

import checkAuth from "../../middlewares/checkAuth";
import { gqlError } from "../../utils/funcs";
import { GQLContext } from "../../types/commonTypes";

export default {
  Query: {
    geocode: async (
      _: any,
      { value, lat, lng, limit = 5 }: GeocodeInput,
      context: GQLContext
    ): Promise<IGeocode[] | undefined> => {
      const { req } = context;
      //TODO: restrict this API to NexaBind only
      // const user = checkAuth(req);

      const mqResults = await fetchMQGeocode({ value, lat, lng, limit });
      if (mqResults) return mqResults;
      else gqlError({ msg: "Failed to retrieve data" });
    },
    reverseGeocode: async (
      _: any,
      { lat, lng }: { lat: number; lng: number },
      context: GQLContext
    ): Promise<IGeocode | undefined> => {
      const { req } = context;
      const user = checkAuth(req);

      const mqResults = await fetchMQReverseGeocode({ lat, lng });
      if (mqResults) return mqResults;
      else gqlError({ msg: "Failed to retrieve data" });
    },
  },
};

const mqKey = process.env.MAP_QUEST_KEY;

const fetchMQGeocode = async ({
  value,
  lat,
  lng,
  limit,
}: GeocodeInput): Promise<IGeocode[] | undefined> => {
  const getResponse = async (key: string): Promise<Array<any> | undefined> => {
    const getUrl = () => {
      let url = `https://www.mapquestapi.com/search/v3/prediction?key=${key}&limit=${limit}&collection=adminArea,poi,address,category,franchise,airport&q=${encodeURIComponent(
        value
      )}`;
      if (lat && lng) url = url + `&location=${lng},${lat}`;
      return url;
    };

    const resp = await axios.get(getUrl());

    if (resp?.data?.results) return resp?.data?.results;
    return undefined;
  };

  if (mqKey) {
    let response = await getResponse(mqKey);
    if (response) {
      return response?.map((res: any) => {
        const props = res?.place?.properties;
        return {
          displayName: res.displayString,
          street: props.street,
          city: props.city,
          county: props.county,
          state: props.state,
          stateCode: props.stateCode,
          postalCode: props.postalCode,
          country: props.country,
          countryCode: props.countryCode,
          lat: res?.place?.geometry?.coordinates?.[1],
          lng: res?.place?.geometry?.coordinates?.[0],
          source: { source: "MapQuest", ...res },
          geometry: res?.place?.geometry,
        } as IGeocode;
      }) as [IGeocode];
    }
  } else return undefined;
};

const fetchMQReverseGeocode = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<IGeocode | undefined> => {
  const getResponse = async (key: string): Promise<any> => {
    const resp = await axios.get(
      `http://www.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${lat},${lng}`
    );
    const location = resp?.data?.results?.[0]?.locations?.[0];
    if (location) return location;
    return undefined;
  };

  if (mqKey) {
    let response = await getResponse(mqKey);
    const props = response;
    const { lat, lng } = props.latLng;
    return {
      displayName: `${props.street}, ${props.adminArea5}, ${props.adminArea3}, ${props.postalCode}, ${props.adminArea1}`,
      street: props.street,
      city: props.adminArea5,
      county: props.adminArea4,
      state: props.adminArea3,
      stateCode: props.adminArea3,
      postalCode: props.postalCode,
      country: props.adminArea1,
      countryCode: props.adminArea1,
      lat,
      lng,
      source: { source: "MapQuest", ...response },
      geometry: { type: "Point", coordinates: [lng, lat] },
    } as IGeocode;
  } else return undefined;
};

/**
 * INTERFACES
 */
interface GeocodeInput {
  value: string;
  lat?: number;
  lng?: number;
  limit?: number;
}

export type IGeocode = Omit<Address, "id" | "createdAt" | "updatedAt"> & {
  source: any;
};
