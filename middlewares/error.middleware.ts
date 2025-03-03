import { NextFunction, Request, Response } from "express";

const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    // Xử lý lỗi CastError (MongoDB)
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message) as { statusCode: number } & Error;
      error.statusCode = 404;
    }

    // Xử lý lỗi trùng lặp (MongoDB)
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message) as { statusCode: number } & Error;
      error.statusCode = 409;
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Server Error" });
    next();
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
