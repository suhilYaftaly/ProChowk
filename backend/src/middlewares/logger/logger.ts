import * as dotenv from "dotenv";
import winston from "winston";
import "winston-mongodb";
import DailyRotateFile from "winston-daily-rotate-file";

import { LOGS_COLLECTION } from "../../constants/dbCollectionNames";

dotenv.config();

const createdLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  handleExceptions: true,
  handleRejections: true,
  transports: [
    new DailyRotateFile({
      filename: "src/logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "5m", // rotate the file after 5MB
      maxFiles: "14d", // keep the rotated files for 14 days
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      collection: LOGS_COLLECTION,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      collection: LOGS_COLLECTION,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      collection: LOGS_COLLECTION,
    }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== "production") {
  createdLogger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

// Overload the logging functions
export interface Logger {
  info: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
  log: (message: string, meta?: any) => void;
  // Add more levels if needed
}

export const logger: Logger = {
  info: (message, meta) => createdLogger.info(message, { metadata: meta }),
  warn: (message, meta) => createdLogger.warn(message, { metadata: meta }),
  error: (message, meta) => createdLogger.error(message, { metadata: meta }),
  log: (message, meta) => createdLogger.log(message, { metadata: meta }),
};
