import { Request, Response } from "express";
import { GeneralFeedbackModel } from "../models/Feedback";
import { notifySlack } from "../config/slack";

export const createFeedback = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "title and description are required" });
  }

  const files = (req.files as Express.Multer.File[]) || [];
  const base = `/${process.env.UPLOAD_DIR || "uploads"}`;
  const images = files.map((f) => `${base}/${f.filename}`);

  const doc = await GeneralFeedbackModel.create({
    title,
    description,
    images,
    submittedBy: (req.user as any)._id,
  });

  const u = req.user as any;
  notifySlack("feedback", {
    title: doc.title,
    description: doc.description,
    user: { username: u?.username, email: u?.email },
  }).catch((err) => console.warn("Slack feedback notify error:", err.message));

  res.status(201).json(doc);
};

export const listFeedback = async (_req: Request, res: Response) => {
  const docs = await GeneralFeedbackModel.find().sort({ createdAt: -1 }).populate("submittedBy", "username email");
  res.json(docs);
};
