/**
 * @openapi
 * /api/feedback:
 *   post:
 *     summary: Submit general feedback
 *     description: Submit general product feedback with optional images. Requires authentication.
 *     tags:
 *       - Feedback
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Love the new dashboard!
 *               description:
 *                 type: string
 *                 example: The new interface feels much smoother and faster.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: string
 *                   example: 6704bfeab512ab34ef789012
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all feedback submissions
 *     description: Retrieve a list of all user feedback entries.
 *     tags:
 *       - Feedback
 *     responses:
 *       200:
 *         description: List of feedback submissions
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
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "https://example.com/feedback.png"
 *                   submittedBy:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */

import { Router } from "express";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createFeedback, listFeedback } from "../controllers/feedbackController";

const router = Router();

// Allow up to 5 uploaded images
router.post("/feedback", protect, upload.array("images", 5), asyncHandler(createFeedback));
router.get("/feedback", asyncHandler(listFeedback));

export default router;
