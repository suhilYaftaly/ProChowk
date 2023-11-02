import { GraphQLError } from "graphql";

import { IGQLError, getUserFromContext } from "../../utils/funcs";
import { logger } from "../logger/logger";

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
      if ((error?.extensions?.type as IGQLError["type"]) !== "skipLogging") {
        const [, , context] = args;
        const userAgent = context?.req?.headers?.["user-agent"];
        const user = getUserFromContext(context);

        const meta = {
          name: error.name,
          stack: error.stack,
          path: error.path,
          locations: error.locations,
          user,
          userAgent,
          extensions: { ...error.extensions },
        };
        logger.error(error?.message, meta);
      }
      throw new GraphQLError(error?.message, error);
    }
  };
};
