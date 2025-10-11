import { Request, Response } from "express";
import * as bugReportService from "../services/bugReportService";
// NOTE: We rely on a global declaration file (e.g., src/types/express.d.ts) 
// to correctly augment the 'Request' type with 'user' and 'files'.

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

    // 2. Prepare data object for service
    const reportData: bugReportService.CreateBugReportData = {
      title,
      description,
      images,
      priority,
      browser,
      reproducibleSteps,
      // TypeScript now recognizes req.user (from Auth Middleware)
      // We cast req.user to any temporarily for the conditional spreading, 
      // though the augmented type should handle this if configured well.
      ...(req.user ? { submittedBy: (req.user as any)._id } : {}), 
    };

    // 3. Call Service Layer
    const doc = await bugReportService.createBugReport(reportData);

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
  try {
    // 1. Call Service Layer
    const docs = await bugReportService.listBugReports();

    // 2. Respond
    res.json(docs);
  } catch (error) {
    console.error("Error listing bug reports:", error);
    res.status(500).json({ message: "Failed to list bug reports." });
  }
};

// You would add other controller functions here (e.g., getBugById, updateBug, deleteBug)
// using the corresponding service functions.