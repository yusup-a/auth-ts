import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createFeature, listFeatures } from "../controllers/featureRequestController";

const router = Router();

router.post("/features", protect, upload.array("images", 5), asyncHandler(createFeature));
router.get("/features", asyncHandler(listFeatures));

export default router;
