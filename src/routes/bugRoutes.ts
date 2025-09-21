import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createBug, listBugs } from "../controllers/bugReportController";

const router = Router();

// allow up to 5 images: form-data field name must be "images"
router.post("/bugs", protect, upload.array("images", 5), asyncHandler(createBug));
router.get("/bugs", asyncHandler(listBugs));

export default router;
