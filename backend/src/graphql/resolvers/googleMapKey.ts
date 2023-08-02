import * as dotenv from "dotenv";

import checkAuth from "../../utils/checkAuth";
import { GraphQLContext } from "../../types/commonTypes";

dotenv.config();

export default {
  Query: {
    getGoogleMapKey: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<string> => {
      const { req } = context;
      const user = checkAuth(req);

      return process.env.GOOGLE_MAP_KEY as string;
    },
  },
};
