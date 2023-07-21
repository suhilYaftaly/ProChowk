import * as dotenv from "dotenv";
import axios from "axios";

import { GraphQLContext } from "../../types/userTypes";
import checkAuth from "../../utils/checkAuth";
import { Address, AddressSearchInput } from "../../types/address";
import { gqlError } from "../../utils/funcs";

dotenv.config();

export default {
  Query: {
    addressSearch: async (
      _: any,
      { value, lat, lng, limit = 5, source = "MapQuest" }: AddressSearchInput,
      context: GraphQLContext
    ): Promise<[Address]> => {
      const { req } = context;
      const user = checkAuth(req);

      const mqResults = await fetchAdrFromMapQuest({ value, lat, lng, limit });

      try {
        if (mqResults) {
          return mqResults;
        } else gqlError({ msg: "Failed to retrieve data" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};

const fetchAdrFromMapQuest = async ({
  value,
  lat,
  lng,
  limit,
}: AddressSearchInput): Promise<[Address]> => {
  const mqKey = process.env.MAP_QUEST_KEY;
  const mqSuhilKey = process.env.MAP_QUEST_KEY_SUHIL;
  const mqAJKey = process.env.MAP_QUEST_KEY_AJ;
  const mqHabibKey = process.env.MAP_QUEST_KEY_HABIB;
  const keys = [mqKey, mqSuhilKey, mqAJKey, mqHabibKey];

  const getResponse = async (key: string): Promise<[Address]> => {
    const resp = await axios.get(
      `https://www.mapquestapi.com/search/v3/prediction?key=${key}&limit=${limit}&collection=adminArea,poi,address,category,franchise,airport&q=${encodeURIComponent(
        value
      )}&location=${lng},${lat}`
    );

    if (resp?.data?.results) return resp?.data?.results;
    return undefined;
  };

  let response;
  for (let i = 0; i < keys.length; i++) {
    response = await getResponse(keys[i]);
    if (response) break;
  }

  if (response) {
    return response?.map((res) => {
      const props = res?.place?.properties;
      return {
        id: res.id,
        displayName: res.displayString,
        street: props.street,
        city: props.city,
        county: props.county,
        state: props.state,
        stateCode: props.stateCode,
        postalCode: props.postalCode,
        country: props.country,
        countryCode: props.countryCode,
        lat: res?.place?.geometry?.coordinates?.[0],
        lng: res?.place?.geometry?.coordinates?.[1],
        source: { source: "MapQuest", ...res },
      };
    }) as [Address];
  } else return undefined;
};
