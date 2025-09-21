import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createBug, listBugs } from "../controllers/bugReportController";


const router = Router();


router.post("/bugs", protect, upload.single("image"), asyncHandler(createBug));
router.get("/bugs", asyncHandler(listBugs));


export default router;