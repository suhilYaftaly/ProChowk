import { Db, MongoClient } from "mongodb";
import {
  ADDRESS_COLLECTION,
  SKILL_COLLECTION,
  REFRESH_TOKEN_COLLECTION,
  JOB_COLLECTION,
} from "../../constants/dbCollectionNames";
import { logger } from "../logger/logger";

export const connectToMongoDB = async (): Promise<MongoClient> => {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();
  } catch (error) {
    logger.error("Failed to connect to MongoDB", { metadata: error });
    console.error("MongoDB error:", error);
    process.exit(1);
  }
  return mongoClient;
};

export const setupMongoIndexes = async (db: Db): Promise<void> => {
  // create 2dsphere index on the "Address" collection for geometry
  await db.collection(ADDRESS_COLLECTION).createIndex({ geometry: "2dsphere" });

  //create skill label (case insensitive) index for faster queries
  await db
    .collection(SKILL_COLLECTION)
    .createIndex({ label: 1 }, { collation: { locale: "en", strength: 2 } });

  // text indexs for MongoDB's $text operator
  await db.collection(SKILL_COLLECTION).createIndex({ label: "text" });
  await db
    .collection(JOB_COLLECTION)
    .createIndex({ title: "text", desc: "text" });

  //TTL(Time-to-Live) to remove old and expired token
  await db
    .collection(REFRESH_TOKEN_COLLECTION)
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
};
