import { Request, Response } from "express";
import { FeatureRequestModel } from "../models/FeatureRequest";
import { notifySlack } from "../config/slack";

export const createFeature = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { title, description, priority, targetAudience, expectedBenefit } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "title, description, priority are required" });
  }

  const files = (req.files as Express.Multer.File[]) || [];
  const base = `/${process.env.UPLOAD_DIR || "uploads"}`;
  const images = files.map((f) => `${base}/${f.filename}`);

  const doc = await FeatureRequestModel.create({
    title,
    description,
    images,
    priority,
    targetAudience,
    expectedBenefit,
    submittedBy: (req.user as any)._id,
  });

  const u = req.user as any;
  notifySlack("feature", {
    title: doc.title,
    description: doc.description,
    priority: doc.priority,
    user: { username: u?.username, email: u?.email },
  }).catch((err) => console.warn("Slack feature notify error:", err.message));

  res.status(201).json(doc);
};

export const listFeatures = async (_req: Request, res: Response) => {
  const docs = await FeatureRequestModel.find().sort({ createdAt: -1 }).populate("submittedBy", "username email");
  res.json(docs);
};
