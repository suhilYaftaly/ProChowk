import {
  RateLimiterRedis,
  IRateLimiterRedisOptions,
} from "rate-limiter-flexible";
import { rateLimitDirective } from "graphql-rate-limit-directive";

import { getClientIP, getUserFromReq } from "../../utils/funcs";
import { redisClient } from "../db/redis";
import { GQLContext } from "../../types/commonTypes";

const limiterOptions: IRateLimiterRedisOptions = {
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
};

export const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } =
  rateLimitDirective({
    keyGenerator: (directiveArgs, source, args, ctx: any, info) => {
      const req: GQLContext["req"] = ctx?.req;
      const user = getUserFromReq(req);
      const ip = getClientIP(req);
      const userAgent = req?.headers?.["user-agent"];
      const resolverName = info?.fieldName;
      const key = `${resolverName}-${
        user?.id || ip || "generic-unknown"
      }-${userAgent}`;

      return key;
    },
    limiterClass: RateLimiterRedis,
    limiterOptions,
  });
