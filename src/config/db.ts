/**
 * MongoDB connector (Mongoose)
 *
 * - Reads configuration from environment variables
 * - Connects once during server startup
 * - Exposes helpers to access the live connection and close gracefully
 * - Emits structured logs for lifecycle events
 */

import mongoose from "mongoose";
import { logger } from "../utils/logger";

/**
 * Resolve Mongo connection string from env and validate.
 * Throws if not provided (so misconfig is caught early).
 */
function requireMongoUri(): string {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    const msg =
      "MONGO_URI is not set. Please set it in your environment (.env) before starting the server.";
    logger.error(msg);
    throw new Error(msg);
  }
  return uri;
}

let isConnected = false;

/**
 * Connect to MongoDB (idempotent).
 * Safe to call multiple times; will only connect once per process.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected) {
    logger.debug("connectDB called but already connected; skipping.");
    return mongoose;
  }

  const uri = requireMongoUri();

  mongoose.connection.on("connecting", () => logger.info("MongoDB: connecting…"));
  mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
  mongoose.connection.on("open", () => logger.debug("MongoDB: connection open"));
  mongoose.connection.on("reconnected", () => logger.warn("MongoDB reconnected"));
  mongoose.connection.on("disconnecting", () => logger.warn("MongoDB: disconnecting…"));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
  mongoose.connection.on("close", () => logger.warn("MongoDB connection closed"));
  mongoose.connection.on("error", (err) => logger.error("MongoDB error", { err }));

  // Recommended Mongoose options (v7+ already uses sane defaults)
  const conn = await mongoose.connect(uri, {});
  isConnected = true;

  return conn;
}

/**
 * Return the active mongoose connection.
 * NOTE: Call after `connectDB()` (e.g., in controllers/models start).
 */
export function getDB(): mongoose.Connection {
  return mongoose.connection;
}

/**
 * Gracefully close the MongoDB connection, used on process shutdown.
 */
export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  logger.info("MongoDB connection closed gracefully.");
}
