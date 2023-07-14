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
      const mqKey = process.env.MAP_QUEST_KEY;

      try {
        const response = await axios.get(
          `https://www.mapquestapi.com/search/v3/prediction?key=${mqKey}&limit=${limit}&collection=adminArea,poi,address,category,franchise,airport&q=${encodeURIComponent(
            value
          )}&location=${lng},${lat}`
        );
        const mqResults = response?.data?.results;
        if (mqResults) {
          return mqResults?.map((res) => {
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
        } else throw gqlError({ msg: "Failed to retrieve data" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};
