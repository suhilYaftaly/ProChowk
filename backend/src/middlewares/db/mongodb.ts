import { Db, MongoClient } from "mongodb";
import {
  ADDRESS_COLL,
  SKILL_COLL,
  REFRESH_TOKEN_COLL,
  JOB_COLL,
  BUDGET_COLL,
  USER_COLL,
  JOB_BID_COLL,
  NOTIFICATION_COLL,
  REVIEW_AUTH_COLL,
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
  // Geospatial index
  await db.collection(ADDRESS_COLL).createIndex({ geometry: "2dsphere" });

  // Case-insensitive index for skill label
  await db
    .collection(SKILL_COLL)
    .createIndex({ label: 1 }, { collation: { locale: "en", strength: 2 } });
  // Text index for skill label
  await db.collection(SKILL_COLL).createIndex({ label: "text" });

  // Text indexes for job title and description
  await db.collection(JOB_COLL).createIndex({ title: "text", desc: "text" });
  // Index for sorting jobs by creation date
  await db.collection(JOB_COLL).createIndex({ createdAt: -1 });
  // Index for filtering draft jobs
  await db.collection(JOB_COLL).createIndex({ isDraft: 1 });
  // TTL index for deleting expired draft jobs
  await db
    .collection(JOB_COLL)
    .createIndex({ draftExpiry: 1 }, { expireAfterSeconds: 0 });

  // Text index for user name and bio
  await db.collection(USER_COLL).createIndex({ name: "text", bio: "text" });
  await db.collection(USER_COLL).createIndex({ userTypes: 1 });

  // Index for filtering by budget type
  await db.collection(BUDGET_COLL).createIndex({ type: 1 });
  // Composite index for filtering by budget range
  await db.collection(BUDGET_COLL).createIndex({ from: 1, to: 1 });

  // TTL index for removing expired tokens
  await db
    .collection(REFRESH_TOKEN_COLL)
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // TTL index to delete rejected jobBids
  await db
    .collection(JOB_BID_COLL)
    .createIndex({ rejectionDate: 1 }, { expireAfterSeconds: 1209600 }); // 1209600 seconds = 14 days

  // TTL index to delete read notifications
  await db
    .collection(NOTIFICATION_COLL)
    .createIndex({ readDate: 1 }, { expireAfterSeconds: 1209600 }); // 1209600 seconds = 14 days

  // TTL index to delete expired review authorization after 1 week
  await db
    .collection(REVIEW_AUTH_COLL)
    .createIndex({ validUntil: 1 }, { expireAfterSeconds: 604800 }); // 604800 seconds = 7 days
};
