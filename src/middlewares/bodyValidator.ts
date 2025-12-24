import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {

console.log(req.body)

    const result = schema.safeParse(req.body.data);



    if (!result.success) {

    console.log(result.error.issues.map(item=>item.message).join(','))
      throw new AppError(
        result.error.issues.map((item) => item.message).join(","),
        400
      );
    }

    req.body = result.data;

    next();
  };
