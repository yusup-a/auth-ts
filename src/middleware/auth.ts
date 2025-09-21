import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthUser {
    _id: string;
    email: string;
}


declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}


export const protect = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
        req.user = decoded;
        next();
    } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
    }
};