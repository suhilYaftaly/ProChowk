import { Redis } from "ioredis";
import * as dotenv from "dotenv";

import { gqlError } from "../../utils/funcs";
import { logger } from "../logger/logger";

dotenv.config();

const getRedisUrl = () => {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  else throw gqlError({ msg: "REDIS_URL not defined" });
};

//TODO: setup SSL on redis in the future if needed

export const redisClient = new Redis(getRedisUrl());

redisClient.on("error", (err) => {
  logger.error("Failed to connect to Redis", { metadata: err });
  console.error("Redis error:", err);
  process.exit(1);
});
