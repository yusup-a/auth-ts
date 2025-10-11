import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB, getDB } from "../config/db";
import { logger } from "../utils/logger";

const TempSchema = new mongoose.Schema(
  { key: { type: String, required: true }, when: { type: Date, default: Date.now } },
  { collection: "selftest_temp" }
);
const TempModel = mongoose.model("SelfTestTemp", TempSchema);
const uri = 'mongodb+srv://kvharini191981_db_user:b71aY4O1kT4iAqS0@mongodbcluster.c6i2irl.mongodb.net/'; 

async function main() {
  logger.info("DB self-test starting…");

  if (!process.env.MONGO_URI) {
    logger.warn("MONGO_URI not set; test will fail intentionally.");
  }
  process.env.MONGODB_URI = uri; // Set the environment variable for the test

  await connectDB();

  const conn = getDB();
  logger.info("Connected DB name", { name: conn.name });

  const doc = await TempModel.create({ key: "ping" });
  const found = await TempModel.findOne({ _id: doc._id }).lean();
  logger.info("CRUD sanity ok", { id: doc._id.toString(), found: !!found });

  await TempModel.deleteOne({ _id: doc._id });
  await disconnectDB();

  logger.info("DB self-test completed successfully.");
}

main().catch((err) => {
  logger.error("DB self-test failed", { err });
  process.exit(1);
});
