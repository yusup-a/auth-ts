/**
 * @openapi
 * /api/features:
 *   post:
 *     summary: Submit a new feature request
 *     description: Create a new feature request with optional images. Requires authentication.
 *     tags:
 *       - Feature Requests
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
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: Add dark mode
 *               description:
 *                 type: string
 *                 example: It would be great to have a dark theme for better visibility at night.
 *               priority:
 *                 type: string
 *                 enum: [Nice-to-have, Important, Critical]
 *                 example: Important
 *               targetAudience:
 *                 type: string
 *                 example: Power users or frequent night users
 *               expectedBenefit:
 *                 type: string
 *                 example: Reduces eye strain and improves user satisfaction
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Feature request created successfully
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
 *                   example: 6703df41b512ab34ef789012
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all feature requests
 *     description: Retrieve a list of all submitted feature requests.
 *     tags:
 *       - Feature Requests
 *     responses:
 *       200:
 *         description: List of feature requests
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
 *                     enum: [Nice-to-have, Important, Critical]
 *                   targetAudience:
 *                     type: string
 *                   expectedBenefit:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "https://example.com/feature.png"
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
import { createFeature, listFeatures } from "../controllers/featureRequestController";

const router = Router();

router.post("/features", protect, upload.array("images", 5), asyncHandler(createFeature));
router.get("/features", asyncHandler(listFeatures));

export default router;
