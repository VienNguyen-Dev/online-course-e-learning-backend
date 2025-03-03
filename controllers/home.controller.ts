import { NextFunction, Request, Response } from "express";

export const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Get home page");
  } catch (error) {
    next(error);
  }
};
