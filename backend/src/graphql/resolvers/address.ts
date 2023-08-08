import axios from "axios";

import checkAuth from "../../utils/checkAuth";
import { gqlError } from "../../utils/funcs";
import { GraphQLContext } from "../../types/commonTypes";
import { MAP_QUEST_KEYS } from "../../utils/constants";
import { Address } from "@prisma/client";

export default {
  Query: {
    geocode: async (
      _: any,
      { value, lat, lng, limit = 5 }: GeocodeInput,
      context: GraphQLContext
    ): Promise<[IGeocode]> => {
      const { req } = context;
      const user = checkAuth(req);

      const mqResults = await fetchMQGeocode({ value, lat, lng, limit });
      try {
        if (mqResults) return mqResults;
        else gqlError({ msg: "Failed to retrieve data" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    reverseGeocode: async (
      _: any,
      { lat, lng }: { lat: number; lng: number },
      context: GraphQLContext
    ): Promise<IGeocode> => {
      const { req } = context;
      const user = checkAuth(req);

      const mqResults = await fetchMQReverseGeocode({ lat, lng });
      try {
        if (mqResults) return mqResults;
        else gqlError({ msg: "Failed to retrieve data" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};

const fetchMQGeocode = async ({
  value,
  lat,
  lng,
  limit,
}: GeocodeInput): Promise<[IGeocode]> => {
  const getResponse = async (key: string): Promise<[IGeocode]> => {
    const resp = await axios.get(
      `https://www.mapquestapi.com/search/v3/prediction?key=${key}&limit=${limit}&collection=adminArea,poi,address,category,franchise,airport&q=${encodeURIComponent(
        value
      )}&location=${lng},${lat}`
    );

    if (resp?.data?.results) return resp?.data?.results;
    return undefined;
  };

  let response;
  for (let i = 0; i < MAP_QUEST_KEYS.length; i++) {
    response = await getResponse(MAP_QUEST_KEYS[i]);
    if (response) break;
  }

  if (response) {
    return response?.map((res) => {
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
  } else return undefined;
};

const fetchMQReverseGeocode = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<IGeocode> => {
  const getResponse = async (key: string): Promise<IGeocode> => {
    const resp = await axios.get(
      `http://www.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${lat},${lng}`
    );
    const location = resp?.data?.results?.[0]?.locations?.[0];
    if (location) return location;
    return undefined;
  };

  let response;
  for (let i = 0; i < MAP_QUEST_KEYS.length; i++) {
    response = await getResponse(MAP_QUEST_KEYS[i]);
    if (response) break;
  }

  if (response) {
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
  lat: number;
  lng: number;
  limit?: number;
}

export type IGeocode = Omit<Address, "id" | "createdAt" | "updatedAt"> & {
  source: any;
};
