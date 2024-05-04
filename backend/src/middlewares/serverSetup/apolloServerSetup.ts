import express from "express";
import { PrismaClient } from "@prisma/client";
import { WebSocket, WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import http from "http";
import depthLimit from "graphql-depth-limit";

import { SubsciptionContext, GQLContext } from "../../types/commonTypes";
import { connectToMongoDB } from "../db/mongodb";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/typeDefs";
import {
  apolloServerFormatError,
  withCatch,
  wrapResolvers,
} from "./errorHandling";
import {
  rateLimitDirectiveTransformer,
  rateLimitDirectiveTypeDefs,
} from "./rateLimiter";
import checkAuth from "../checkAuth";

export const apolloServerSetup = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Wrap all resolvers with the withCatch
  const wrappedResolvers = wrapResolvers(resolvers, withCatch);
  // Create the schema using wrapped resolvers
  const schema = rateLimitDirectiveTransformer(
    makeExecutableSchema({
      typeDefs: [rateLimitDirectiveTypeDefs, ...typeDefs],
      resolvers: resolvers,
    })
  );

  const prisma = new PrismaClient();
  const pubsub = new PubSub();
  const mongoClient = await connectToMongoDB();

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubsciptionContext): Promise<GQLContext> => {
        const token = ctx?.connectionParams?.authorization;
        const userAgent =
          ctx.connectionParams.session?.headers?.["user-agent"] || "not found";
        return {
          req: token ? { headers: { authorization: token } } : (null as any),
          prisma,
          pubsub,
          mongoClient,
          userAgent,
        };
      },
      onConnect: async (ctx) => {
        // Extract the auth token from the request headers
        const authToken = ctx.connectionParams?.authorization;

        // Validate the auth token
        try {
          checkAuth(authToken);
        } catch (err) {
          // If the token is invalid, close the connection
          // return ctx.extra.socket.close(CloseCode.Forbidden, "Forbidden");
        }

        // If the token is valid, proceed with the connection
        // Optionally, you can add the token to the context here
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(6)],
    csrfPrevention: true,
    formatError: apolloServerFormatError,
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
