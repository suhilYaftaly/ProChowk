import express from "express";
import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import http from "http";

import { SubsciptionContext, GraphQLContext } from "../../types/commonTypes";
import { connectToMongoDB } from "./databaseSetup";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/typeDefs";
import { withCatch, wrapResolvers } from "./errorHandling";

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
          return {
            req: session,
            prisma,
            pubsub,
            mongoClient,
            userAgent: session?.headers?.["user-agent"],
          };
        }
        return { req: null, prisma, pubsub, mongoClient, userAgent: null };
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
