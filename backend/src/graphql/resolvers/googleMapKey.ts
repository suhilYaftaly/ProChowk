import * as dotenv from "dotenv";

import { GraphQLContext } from "../../types/userTypes";
import checkAuth from "../../utils/checkAuth";

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
