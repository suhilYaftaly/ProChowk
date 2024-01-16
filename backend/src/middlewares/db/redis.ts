import { Redis } from "ioredis";
import * as dotenv from "dotenv";

import {
  gqlError,
  isDevEnv,
  sendFailureEmailNotification,
} from "../../utils/funcs";
import { logger } from "../logger/logger";

dotenv.config();

const getRedisUrl = () => {
  try {
    if (process.env.REDIS_URL) return process.env.REDIS_URL;
    else throw gqlError({ msg: "REDIS_URL not defined" });
  } catch (error: any) {
    throw gqlError({ msg: error?.message });
  }
};

//TODO: setup SSL on redis in the future if needed.
//Currently redis is being used for rate limiter which has no sensitive data, if redis use changes in the future then we may need to implement SSL. https://docs.redis.com/latest/rc/security/database-security/tls-ssl/
export const redisClient = new Redis(getRedisUrl(), {
  retryStrategy: (times) => {
    // Exponential backoff formula
    console.log("Retry redis reconnect: " + times);
    const delay = Math.min(times * 50, 2000); // Delay reconnect attempts, starting at 50ms and capping at 2000ms
    if (times < 10) return delay;
    else return null; // Stop retrying after the 10th attempt
  },
});

let errorNotified = false;

redisClient.on("error", async (err) => {
  !isDevEnv && logger.error("Failed to connect to Redis", { metadata: err });
  console.error("Redis error:", err);

  if (!errorNotified && !isDevEnv) {
    try {
      await sendFailureEmailNotification({
        subject: "Redis Connection Failure Alert",
        message:
          "The application encountered an error while trying to connect to Redis. Immediate attention is required.",
        buttonText: "Check Redis",
      });
      errorNotified = true; // Prevent sending an email for every error event
    } catch (notificationError) {
      logger.error("Failed to send redis failure notification", {
        metadata: notificationError,
      });
      console.error(
        "Failed to send redis failure notification",
        notificationError
      );
    }
  }

  // Here you can handle the error in any way you see fit.
  // For example, you might decide to shut down the process or switch to a fallback if Redis is essential to your application.
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
  errorNotified = false;
});
