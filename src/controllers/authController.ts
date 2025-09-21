import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

const sign = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES || "1h",
  });

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as { username: string; email: string; password: string };
  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email, password are required" });
  }

  const exists = await UserModel.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: "Email or username already registered" });

  const hash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ username, email, password: hash });

  const token = sign({ _id: user._id.toString(), username: user.username, email: user.email });
  res.status(201).json({
    user: { _id: user._id, username: user.username, email: user.email },
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = sign({ _id: user._id.toString(), username: user.username, email: user.email });
  res.json({
    user: { _id: user._id, username: user.username, email: user.email },
    token,
  });
};
