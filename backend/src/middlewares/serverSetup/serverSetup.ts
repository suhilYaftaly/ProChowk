import { connectToMongoDB, setupMongoIndexes } from "../db/mongodb";
import { apolloServerSetup } from "./apolloServerSetup";

export const serverSetup = async () => {
  const mongoClient = await connectToMongoDB();
  const db = mongoClient.db();
  await setupMongoIndexes(db);
  const { app, server, httpServer, prisma, pubsub } = await apolloServerSetup();

  return { app, server, prisma, pubsub, mongoClient, httpServer };
};
