import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createBug, listBugs } from "../controllers/bugReportController";

const router = Router();

// POST /api/bugs  (create bug report, authenticated)
router.post("/bugs", protect, upload.array("images", 5), asyncHandler(createBug));

// GET /api/bugs  (list all bug reports)
router.get("/bugs", asyncHandler(listBugs));

export default router;
