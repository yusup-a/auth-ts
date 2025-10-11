import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/userService";

// Utility function remains here as it deals with token generation (Controller/Auth concern)
const sign = (payload: Record<string, any>) =>
  jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES || "1h",
  });

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as { username: string; email: string; password: string };
  
  // 1. Validation (remains in controller)
  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email, password are required" });
  }

  try {
    // 2. Check existence using service
    const exists = await userService.findUserByEmailOrUsername(email, username);
    if (exists) return res.status(409).json({ message: "Email or username already registered" });

    // 3. Hash password using service
    const hash = await userService.hashPassword(password);
    
    // 4. Create user using service
    const user = await userService.createUser({ username, email, password: hash });

    // 5. Generate token and map user profile
    const userProfile = userService.mapToUserProfile(user);
    console.log(process.env.JWT_SECRET)
    const token = sign(userProfile);
    console.log("Generated Token:", token); // Debug log
    // 6. Respond
    res.status(201).json({
      user: userProfile,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "An unexpected error occurred during signup." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  
  // 1. Validation (remains in controller)
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    // 2. Find user by email using service
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 3. Compare passwords using service
    const ok = await userService.comparePasswords(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // 4. Generate token and map user profile
    const userProfile = userService.mapToUserProfile(user);
    console.log("jwt secret",process.env.JWT_SECRET) 
    const token = sign(userProfile);
    
    // 5. Respond
    res.json({
      user: userProfile,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An unexpected error occurred during login." });
  }
};