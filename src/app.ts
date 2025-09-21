import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bugRoutes from "./routes/bugRoutes";
import featureRoutes from "./routes/featureRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

// serve uploaded images statically
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.resolve(uploadDir)));

// Homepage: simple JSON landing route
app.get("/", (_req, res) => {
  res.json({
    name: "Feedback API",
    status: "ok",
    endpoints: [
      "/health",
      "/api/auth/signup",
      "/api/auth/login",
      "/api/bugs",
      "/api/features",
      "/api/feedback"
    ]
  });
});

// mount routes under /api
app.use("/api", bugRoutes);
app.use("/api", featureRoutes);
app.use("/api", feedbackRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;
