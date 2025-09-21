import { Request, Response } from "express";
import { BugReportModel } from "../models/BugReport";

export const createBug = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { title, description, priority, browser, reproducibleSteps } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "title, description, priority are required" });
  }

  const files = (req.files as Express.Multer.File[]) || [];
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

  res.status(201).json(doc);
};

export const listBugs = async (_req: Request, res: Response) => {
  const docs = await BugReportModel.find()
    .sort({ createdAt: -1 })
    .populate("submittedBy", "username email");
  res.json(docs);
};
