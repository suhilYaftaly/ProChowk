import * as dotenv from "dotenv";
import winston from "winston";
import "winston-mongodb";
import DailyRotateFile from "winston-daily-rotate-file";

import { LOG_COLLECTION } from "../../constants/dbCollectionNames";

dotenv.config();

const mongoDBTransporter = new winston.transports.MongoDB({
  db: process.env.MONGODB_URI,
  collection: LOG_COLLECTION,
  capped: true,
  cappedSize: 10000000, //10MB
});

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
    mongoDBTransporter,
  ],
  exceptionHandlers: [mongoDBTransporter],
  rejectionHandlers: [mongoDBTransporter],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  // Combine multiple formats
  const combineFormats = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  );

  createdLogger.add(new winston.transports.Console({ format: combineFormats }));
}

// Overload the logging functions
interface LoggerUser {
  name?: string;
  email?: string;
}
interface LoggerMeta {
  name?: string;
  stack?: string;
  path?: string;
  locations?: string;
  user?: LoggerUser;
  userAgent?: string;
  ip?: string;
  extensions?: { code?: string; type?: string };
  [key: string]: any;
}
export interface Logger {
  info: (message: string, meta?: LoggerMeta) => void;
  warn: (message: string, meta?: LoggerMeta) => void;
  error: (message: string, meta?: LoggerMeta) => void;
  log: (message: string, meta?: LoggerMeta) => void;
  // Add more levels if needed
}

export const logger: Logger = {
  info: (message, meta) => createdLogger.info(message, { metadata: meta }),
  warn: (message, meta) => createdLogger.warn(message, { metadata: meta }),
  error: (message, meta) => createdLogger.error(message, { metadata: meta }),
  log: (message, meta) => createdLogger.log(message, { metadata: meta }),
};
