/**
 * Server bootstrap:
 * - Load env before anything else
 * - Initialize DB connector
 * - Start HTTP server
 * - Gracefully handle shutdown signals and fatal errors
 */

import "dotenv/config";
import http from "http";
import app from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { logger } from "./utils/logger";

const PORT = Number(process.env.PORT ?? 4000);

let server: http.Server | null = null;

async function start() {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    // Handle SIGINT/SIGTERM for graceful shutdown
    const shutdown = async (signal: NodeJS.Signals) => {
      try {
        logger.warn(`Received ${signal}. Shutting down gracefully…`);
        if (server) {
          // stop accepting new connections
          await new Promise<void>((resolve) => {
            server?.close(() => resolve());
          });
        }
        await disconnectDB();
        logger.info("Shutdown complete. Exiting.");
        process.exit(0);
      } catch (err) {
        logger.error("Error during shutdown", { err });
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Crash safety: log and exit
    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled promise rejection", { reason });
      process.exit(1);
    });
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught exception", { err });
      process.exit(1);
    });
  } catch (err) {
    logger.error("Failed to start server", { err });
    process.exit(1);
  }
}

start();
