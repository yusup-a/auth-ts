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


/**
 * Temporary authentication middleware.
 * It simulates a logged-in user for development purposes.
 */
export const protect = (req: Request, _res: Response, next: NextFunction) => {
  // 👇 Attach a fake user object to req
  (req as any).user = {
    _id: "652fa14c2b3f5c0012ab1234", // <-- must look like a valid MongoDB ObjectId
    username: "guest_user",
    email: "guest@example.com",
  };

  next();
};

