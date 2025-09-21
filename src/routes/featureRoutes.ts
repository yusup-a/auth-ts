import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createFeature, listFeatures } from "../controllers/featureRequestController";


const router = Router();


router.post("/features", protect, upload.single("image"), asyncHandler(createFeature));
router.get("/features", asyncHandler(listFeatures));


export default router;