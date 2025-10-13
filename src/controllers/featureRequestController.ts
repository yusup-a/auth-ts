import { Request, Response } from "express";
import * as featureRequestService from "../services/featureRequestService";
import { notifySlack } from "../config/slack";

// NOTE: Using 'Request' and relying on global module augmentation 
// (e.g., in src/types/express.d.ts) to include req.user and req.files.

/**
 * POST /api/features
 * Creates a new feature request using the service layer.
 */
export const createFeature = async (req: Request, res: Response) => {
  // Authentication check (This part remains in the controller/middleware)
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { title, description, priority, targetAudience, expectedBenefit } = req.body;
  
  // Validation
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "title, description, priority are required" });
  }

  try {
    // 1. Prepare file paths
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const base = `/${process.env.UPLOAD_DIR || "uploads"}`;
    const images = files.map((f) => `${base}/${f.filename}`);
    
    // Get submittedBy ID from the authenticated user
    const submittedByUserId = (req.user as any)._id;

    // 2. Prepare data for service layer
    const requestData: featureRequestService.CreateFeatureRequestData = {
      title,
      description,
      images,
      priority,
      targetAudience,
      expectedBenefit,
      submittedBy: submittedByUserId, // Required field in the model
    };

    // 3. Call Service Layer to create the document
    const doc = await featureRequestService.createFeatureRequest(requestData);
      const u = req.user as any;
    notifySlack("feature", {
    title: doc.title,
    description: doc.description,
    priority: doc.priority,
    user: { username: u?.username, email: u?.email },
  }).catch((err) => console.warn("Slack feature notify error:", err.message));

  res.status(201).json(doc);
    // 4. Respond
    res.status(201).json(doc);
  } catch (error) {
    console.error("Error creating feature request:", error);
    res.status(500).json({ message: "Failed to create feature request." });
  }
};

/**
 * GET /api/features
 * Lists all feature requests using the service layer.
 */
export const listFeatures = async (_req: Request, res: Response) => {
  try {
    // 1. Call Service Layer to fetch documents
    // The population (.populate) and sorting (.sort) logic is now handled in the service
    const docs = await featureRequestService.listFeatureRequests();
    
    // 2. Respond
    res.json(docs);
  } catch (error) {
    console.error("Error listing feature requests:", error);
    res.status(500).json({ message: "Failed to list feature requests." });
  }
};
