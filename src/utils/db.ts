import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * This should be imported and called once at app startup.
 */

export const connectDB = async (): Promise<void> => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      "mongodb+srv://kvharini191981_db_user:b71aY4O1kT4iAqS0@mongodbcluster.c6i2irl.mongodb.net/";

    if (!uri) {
      throw new Error("❌ MongoDB connection URI not provided");
    }

    // prevent multiple connections in dev hot-reload
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Using existing MongoDB connection");
      return;
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
