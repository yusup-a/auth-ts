import { Request, Response } from "express";
import { BugReport } from "../models/BugReport";


export const createBug = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !description) return res.status(400).json({ message: "title and description required" });


    const imageUrl = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : undefined;


    const doc = await BugReport.create({ title, description, imageUrl, user: (req.user as any)._id || req.user._id });
    res.status(201).json(doc);
};


export const listBugs = async (_req: Request, res: Response) => {
    const docs = await BugReport.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(docs);
};