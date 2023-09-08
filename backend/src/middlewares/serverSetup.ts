import express from "express";
import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import http from "http";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

import resolvers from "../graphql/resolvers";
import typeDefs from "../graphql/typeDefs";
import { SubsciptionContext, GraphQLContext } from "../types/commonTypes";
import {
  ADDRESS_COLLECTION,
  LOGS_COLLECTION,
  SKILL_COLLECTION,
} from "../constants/dbCollectionNames";
import { logger } from "./logger/logger";
import { IGQLError } from "../utils/funcs";

export const connectToMongoDB = async (): Promise<MongoClient> => {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();

    // create indexes and capped collection
    const db = mongoClient.db();

    // automatically remove the oldest log entries when a certain size is reached.
    const collections = await db
      .listCollections({ name: LOGS_COLLECTION })
      .toArray();
    if (collections.length === 0) {
      await db.createCollection(LOGS_COLLECTION, {
        capped: true,
        size: 5242880,
      }); // 5MB
    }

    // create 2dsphere index on the "Address" collection
    await db
      .collection(ADDRESS_COLLECTION)
      .createIndex({ geometry: "2dsphere" });

    //create skill label (case insensitive) index for faster queries
    await db
      .collection(SKILL_COLLECTION)
      .createIndex({ label: 1 }, { collation: { locale: "en", strength: 2 } });
  } catch (error) {
    logger.error("Failed to connect to MongoDB", { metadata: error });
    process.exit(1);
  }
  return mongoClient;
};

export const apolloServerSetup = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  // Wrap all resolvers with the withCatch
  const wrappedResolvers = wrapResolvers(resolvers, withCatch);
  // Create the schema using wrapped resolvers
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: wrappedResolvers,
  });
  const prisma = new PrismaClient();
  const pubsub = new PubSub();
  const mongoClient = await connectToMongoDB();

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubsciptionContext): Promise<GraphQLContext> => {
        if (ctx?.connectionParams?.session) {
          const { session } = ctx.connectionParams;
          return { req: session, prisma, pubsub, mongoClient };
        }
        return { req: null, prisma, pubsub, mongoClient };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  return { app, server, prisma, pubsub, mongoClient, httpServer };
};

// utility function to wrap each resolver with the errorHandler
const wrapResolvers = (resolvers, errorHandler) => {
  const wrappedResolvers = {};
  for (const [type, typeResolvers] of Object.entries(resolvers)) {
    wrappedResolvers[type] = {};
    for (const [key, resolver] of Object.entries(typeResolvers)) {
      wrappedResolvers[type][key] = errorHandler(resolver);
    }
  }
  return wrappedResolvers;
};

const withCatch = (resolverFunction: Function) => {
  return async (...args: any[]) => {
    try {
      return await resolverFunction(...args);
    } catch (error: any) {
      if ((error?.extensions?.type as IGQLError["type"]) !== "skipLogging") {
        const [, , context] = args;
        const authHeader = context?.req?.headers?.authorization;
        const token = authHeader?.split("Bearer ")?.[1];
        const decodedToken = jwt.decode(token);

        const meta = {
          name: error.name,
          stack: error.stack,
          path: error.path,
          locations: error.locations,
          extensions: { ...error.extensions, user: decodedToken },
        };
        logger.error(error?.message, meta);
      }
      throw new GraphQLError(error?.message, error);
    }
  };
};
