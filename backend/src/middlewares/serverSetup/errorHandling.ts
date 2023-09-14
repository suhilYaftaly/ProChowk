import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

import { IGQLError } from "../../utils/funcs";
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
        const authHeader = context?.req?.headers?.authorization;
        const userAgent = context?.req?.headers?.["user-agent"];
        const token = authHeader?.split("Bearer ")?.[1];
        const decodedToken = jwt.decode(token);

        const meta = {
          name: error.name,
          stack: error.stack,
          path: error.path,
          locations: error.locations,
          user: decodedToken,
          extensions: { ...error.extensions, userAgent },
        };
        logger.error(error?.message, meta);
      }
      throw new GraphQLError(error?.message, error);
    }
  };
};
