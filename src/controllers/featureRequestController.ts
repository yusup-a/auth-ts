import { Request, Response } from "express";
import { FeatureRequest } from "../models/FeatureRequest";


export const createFeature = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !description) return res.status(400).json({ message: "title and description required" });


    const imageUrl = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : undefined;


    const doc = await FeatureRequest.create({ title, description, imageUrl, user: (req.user as any)._id || req.user._id });
    res.status(201).json(doc);
};


export const listFeatures = async (_req: Request, res: Response) => {
    const docs = await FeatureRequest.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(docs);
};