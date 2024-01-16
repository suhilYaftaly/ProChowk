import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import { GQLContext } from "./types/commonTypes";
import { serverSetup } from "./middlewares/serverSetup/serverSetup";

async function main() {
  dotenv.config();
  const { app, server, prisma, pubsub, mongoClient, httpServer } =
    await serverSetup();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: [process.env.CLIENT_ORIGIN || "not found"],
      credentials: true,
    }),
    express.json({ limit: "20mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GQLContext> => ({
        req,
        prisma,
        pubsub,
        mongoClient,
        userAgent: req?.headers?.["user-agent"] || "Not Found",
      }),
    })
  );

  const PORT = process.env.PORT || 9001;
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);

  // Close MongoDB connection when the application is about to exit
  process.on("SIGINT", async () => {
    console.log("Closing MongoDB client...");
    await mongoClient.close();
    process.exit(0);
  });
}

main().catch((err) => console.log(err));

export default main;
