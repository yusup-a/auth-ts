import { Request, Response } from "express";
import { BugReportModel } from "../models/BugReport";
import { notifySlack } from "../config/slack";


/**
 * POST /api/bugs
 * Creates a new bug report.
 */
// Using the standard Express Request type, which is globally augmented.
export const createBug = async (req: Request, res: Response) => {
  const { title, description, priority, browser, reproducibleSteps } = req.body;

  // 1. Validation
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "title, description, priority are required" });
  }

  try {
    // TypeScript now recognizes req.files (from Multer)
    const files = (req.files as Express.Multer.File[] | undefined) || []; 
    const base = `/${process.env.UPLOAD_DIR || "uploads"}`;
    const images = files.map((f) => `${base}/${f.filename}`);

  const doc = await BugReportModel.create({
    title,
    description,
    images,
    priority,
    browser,
    reproducibleSteps,
    submittedBy: (req.user as any)._id,
  });

  const u = req.user as any;
  notifySlack("bug", {
    title: doc.title,
    description: doc.description,
    priority: doc.priority,
    user: { username: u?.username, email: u?.email },
  }).catch((err) => console.warn("Slack bug notify error:", err.message));
  
    // 4. Respond
    res.status(201).json(doc);
  } catch (error) {
    console.error("Error creating bug report:", error);
    res.status(500).json({ message: "Failed to create bug report." });
  }
};

/**
 * GET /api/bugs
 * Lists all bug reports.
 */
export const listBugs = async (_req: Request, res: Response) => {
  const docs = await BugReportModel.find()
    .sort({ createdAt: -1 })
    .populate("submittedBy", "username email");
  res.json(docs);
};

// You would add other controller functions here (e.g., getBugById, updateBug, deleteBug)
// using the corresponding service functions.

// Fire-and-forget Slack notification

