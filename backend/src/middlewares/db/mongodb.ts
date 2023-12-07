import { Db, MongoClient } from "mongodb";
import {
  ADDRESS_COLLECTION,
  SKILL_COLLECTION,
  REFRESH_TOKEN_COLLECTION,
  JOB_COLLECTION,
  BUDGET_COLLECTION,
} from "../../constants/dbCollectionNames";
import { logger } from "../logger/logger";
import {
  gqlError,
  isDevEnv,
  sendFailureEmailNotification,
} from "../../utils/funcs";

let mongoErrorNotified = false;

export const connectToMongoDB = async (): Promise<MongoClient> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    logger.error("MONGODB_URI is not set in environment variables");
    throw gqlError({ msg: "MONGODB_URI is not set in environment variables" });
  }

  const mongoClient = new MongoClient(mongoUri);
  try {
    await mongoClient.connect();
  } catch (error) {
    !isDevEnv &&
      logger.error("Failed to connect to MongoDB", { metadata: error });
    console.error("MongoDB error:", error);

    if (!mongoErrorNotified && !isDevEnv) {
      try {
        await sendFailureEmailNotification({
          subject: "MongoDB Connection Failure Alert",
          message:
            "The application encountered an error while trying to connect to MongoDB. Immediate attention is required.",
          buttonText: "Check MongoDB",
        });
        mongoErrorNotified = true; // Prevents sending an email on every error event
      } catch (notificationError) {
        logger.error("Failed to send MongoDB failure notification", {
          metadata: notificationError,
        });
      }
    }

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

  await db.collection(JOB_COLLECTION).createIndex({ createdAt: -1 });
  await db.collection(JOB_COLLECTION).createIndex({ isDraft: 1 });

  await db.collection(BUDGET_COLLECTION).createIndex({ type: 1 });
  await db.collection(BUDGET_COLLECTION).createIndex({ from: 1, to: 1 });

  //TTL(Time-to-Live) to remove old and expired token
  await db
    .collection(REFRESH_TOKEN_COLLECTION)
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
};
