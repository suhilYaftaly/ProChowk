import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import http from "http";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { json } from "body-parser";
import cors from "cors";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { GraphQLContext, SubsciptionContext } from "./types/userTypes";

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const prisma = new PrismaClient();
  const pubsub = new PubSub();
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubsciptionContext): Promise<GraphQLContext> => {
        if (ctx?.connectionParams?.session) {
          const { session } = ctx.connectionParams;
          return { req: session, prisma, pubsub };
        }
        return { req: null, prisma, pubsub };
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

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    express.json({ limit: "1mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => ({
        req,
        prisma,
        pubsub,
      }),
    })
  );

  const PORT = process.env.PORT || 9001;
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
}

main().catch((err) => console.log(err));

export default main;
