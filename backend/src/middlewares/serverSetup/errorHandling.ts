import { GraphQLError, GraphQLFormattedError } from "graphql";

import {
  IGQLError,
  formatDuration,
  getClientIP,
  getUserFromReq,
  gqlError,
  isDevEnv,
} from "../../utils/funcs";
import { logger } from "../logger/logger";
import { GraphQLContext } from "../../types/commonTypes";

// utility function to wrap each resolver with the errorHandler
export const wrapResolvers = (resolvers, errorHandler) => {
  const wrappedResolvers = {};
  for (const [type, typeResolvers] of Object.entries(resolvers)) {
    wrappedResolvers[type] = {};
    for (const [key, resolver] of Object.entries(typeResolvers)) {
      wrappedResolvers[type][key] = errorHandler(resolver);
    }
  }
  return wrappedResolvers;
};

export const withCatch = (resolverFunction: Function) => {
  return async (...args: any[]) => {
    try {
      return await resolverFunction(...args);
    } catch (error: any) {
      if (!isDevEnv) {
        if ((error?.extensions?.type as IGQLError["type"]) !== "skipLogging") {
          const [, , context] = args;
          const req: GraphQLContext["req"] = context?.req;
          const userAgent = req?.headers?.["user-agent"];
          const user = getUserFromReq(req);
          const ip = getClientIP(req);

          const meta = {
            name: error.name,
            stack: error.stack,
            path: error.path,
            locations: error.locations,
            user,
            userAgent,
            ip,
            extensions: { ...error.extensions },
          };
          logger.error(error?.message, meta);
        }
      }
      throw new GraphQLError(error?.message, error);
    }
  };
};

export const apolloServerFormatError = (error: GraphQLFormattedError) => {
  // Check if this is a rate limit error
  if (
    error.extensions?.code === "INTERNAL_SERVER_ERROR" &&
    error.message.startsWith("Too many requests")
  ) {
    const match = error.message.match(/(\d+) seconds/);
    if (match) {
      const durationInSeconds = parseInt(match[1], 10);
      const readableDuration = formatDuration(durationInSeconds);
      return gqlError({
        msg: `Too many requests. Please try again in ${readableDuration}.`,
        code: error.extensions?.code,
      });
    }
  }

  return error;
};
