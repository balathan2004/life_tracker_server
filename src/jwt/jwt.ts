import { JwtRequest, UserDataInterface } from "../types/common";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

export function verifyToken(
  token: string,
  req: JwtRequest,
  res: Response,
  next: any
) {
  jwt.verify(token, JWT_ACCESS_SECRET || "", (err, user: any) => {
    if (err) {
      if (err.name == "TokenExpiredError")
        console.log("Authentication token expired");
      return res.status(403).json({
        success: false,
        message: "Auth Token Not found in middleware",
      });
    } else {
      req.jwt = user;
      next();
    }
    return;
  });
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: any
) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  verifyToken(token, req, res, next);
}

export function generateAccessToken(user: UserDataInterface) {
  return jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn: "1D" });
}

export function generateRefreshToken(user: UserDataInterface) {
  return jwt.sign(user, JWT_REFRESH_SECRET, { expiresIn: "30D" });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
