import { Request, Response } from "express";
import * as feedbackService from "../services/feedbackService";
import { notifySlack } from "../config/slack";

// NOTE: Relying on global module augmentation (e.g., in src/types/express.d.ts)
// to correctly include req.user and req.files on the Request type.

/**
 * POST /api/feedback
 * Creates a new feedback entry using the service layer.
 */
export const createFeedback = async (req: Request, res: Response) => {
  // Authentication check (remains in controller)
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { title, description } = req.body;
  
  // Validation
  if (!title || !description) {
    return res.status(400).json({ message: "title and description are required" });
  }

  try {
    // 1. Prepare file paths
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const base = `/${process.env.UPLOAD_DIR || "uploads"}`;
    const images = files.map((f) => `${base}/${f.filename}`);
    
    // Get submittedBy ID from the authenticated user
    const submittedByUserId = (req.user as any)._id;

    // 2. Prepare data for service layer
    const feedbackData: feedbackService.CreateFeedbackData = {
      title,
      description,
      images,
      submittedBy: submittedByUserId,
    };

    // 3. Call Service Layer to create the document
    const doc = await feedbackService.createGeneralFeedback(feedbackData);
      const u = req.user as any;
  notifySlack("feedback", {
    title: doc.title,
    description: doc.description,
    user: { username: u?.username, email: u?.email },
  }).catch((err) => console.warn("Slack feedback notify error:", err.message));

  res.status(201).json(doc);

    // 4. Respond
    res.status(201).json(doc);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Failed to create feedback." });
  }
}

/**
 * GET /api/feedback
 * Lists all feedback entries using the service layer.
 */
export const listFeedback = async (_req: Request, res: Response) => {
  try {
    // 1. Call Service Layer to fetch documents
    // Sorting and population logic is now encapsulated in the service.
    const docs = await feedbackService.listGeneralFeedback();
    
    // 2. Respond
    res.json(docs);
  } catch (error) {
    console.error("Error listing feedback:", error);
    res.status(500).json({ message: "Failed to list feedback." });
  }
};
