import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { FirebaseError } from "firebase/app";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof FirebaseError) {
    statusCode = 400;
    message = err.code;
  } else if (!err.isOperational) {
    console.error("Unhandled error:", err);
  }
  res.status(statusCode).json({
    message: message,
  });
}
