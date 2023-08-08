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

import resolvers from "../graphql/resolvers";
import typeDefs from "../graphql/typeDefs";
import { SubsciptionContext, GraphQLContext } from "../types/commonTypes";
import { ADDRESS_COLLECTION, SKILL_COLLECTION } from "./dbCollectionNames";

export const connectToMongoDB = async (): Promise<MongoClient> => {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();

    //create indexes
    const db = mongoClient.db();
    // Ensure 2dsphere index on the "Address" collection
    await db
      .collection(ADDRESS_COLLECTION)
      .createIndex({ geometry: "2dsphere" });
    //create skill label (case insensitive) index for faster queries
    await db
      .collection(SKILL_COLLECTION)
      .createIndex({ label: 1 }, { collation: { locale: "en", strength: 2 } });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
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
  const schema = makeExecutableSchema({ typeDefs, resolvers });
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
