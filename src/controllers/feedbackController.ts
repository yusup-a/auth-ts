import { Request, Response } from "express";
import { Feedback } from "../models/Feedback";


export const createFeedback = async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!message) return res.status(400).json({ message: "message is required" });


    const imageUrl = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : undefined;


    const doc = await Feedback.create({ message, imageUrl, user: (req.user as any)._id || req.user._id });
    res.status(201).json(doc);
};


export const listFeedback = async (_req: Request, res: Response) => {
    const docs = await Feedback.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(docs);
};