import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User, { IUser } from "../models/User.model";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      // user?: IUser;
    }
  }
}

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token!, JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) res.status(401).json({ message: "Unauthorized" });
    req.userId = user?._id.toString();
    // req.user = user as IUser;
    next();
  } catch (error) {
    next(error);
  }
};
