import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createFeedback, listFeedback } from "../controllers/feedbackController";


const router = Router();


router.post("/feedback", protect, upload.single("image"), asyncHandler(createFeedback));
router.get("/feedback", asyncHandler(listFeedback));


export default router;