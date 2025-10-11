import { Router } from "express";
import { upload } from "../config/multer";
import { asyncHandler } from "../middleware/asyncHandler";
import { createBug, listBugs } from "../controllers/bugReportController";
import { protect } from "../middleware/auth";


const router = Router();

/**
 * @openapi
 * /api/bugs:
 *   post:
 *     summary: Submit a new bug report
 *     description: Create a new bug report (allows up to 5 image uploads). Requires authentication if protect is enabled.
 *     tags:
 *       - Bug Reports
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "App crashes on save"
 *               description:
 *                 type: string
 *                 example: "The app crashes when clicking Save in Chrome 118."
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               browser:
 *                 type: string
 *                 example: "Chrome 118"
 *               reproducibleSteps:
 *                 type: string
 *                 example: "1. Open the app, 2. Click Save"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Bug created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all bug reports
 *     description: Retrieve all submitted bug reports.
 *     tags:
 *       - Bug Reports
 *     responses:
 *       200:
 *         description: List of all bug reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   submittedBy:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 */

router.post("/bugs", protect,upload.array("images", 5), asyncHandler(createBug));
router.get("/bugs", asyncHandler(listBugs));

export default router;
