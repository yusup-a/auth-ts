import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";  // ✅ NEW
import { swaggerSpec } from "./Swagger";      // ✅ NEW
import bugRoutes from "./routes/bugRoutes";
import featureRoutes from "./routes/featureRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// --- Middleware setup ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Auth routes ---
app.use("/api/auth", authRoutes);

// --- Static uploads ---
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.resolve(uploadDir)));

// --- Swagger Documentation --- ✅ NEW
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// --- Homepage route ---
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
      "/api/feedback",
      "/docs"
    ]
  });
});

// --- API routes ---
app.use("/api", bugRoutes);
app.use("/api", featureRoutes);
app.use("/api", feedbackRoutes);

// --- Health check ---
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/test", (_req, res) => res.send("Server is up!"));

// --- Error handler ---
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;
