import dotenv from "dotenv";
dotenv.config();
import { print } from "./utils/logger";
global.print = print;
import express, { Request, Response } from "express";
import cors from "cors";
import apiRoute from "./routes/api";
import authRouter from "./routes/auth";
import jwt from "jsonwebtoken";
import { JwtRequest } from "./interfaces";

const app = express();

const port = process.env.PORT || 3000;

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:8081"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send(`
  <html>
    <head><title>Test</title></head>
    <body>
      <h1>Hello from Express</h1>
      <p>This is a simple HTML response.</p>
    </body>
  </html>
`);
});

export function verifyToken(
  token: string,
  req: JwtRequest,
  res: Response,
  next: any
) {
  jwt.verify(token, JWT_ACCESS_SECRET || "", (err, user: any) => {
    if (err) {
      console.log({ err });
      return res.status(403).json({
        success: false,
        message: "Auth Token Not found",
      });
    } else {
      req.jwt = user as any;
      next();
    }
    return;
  });
}

async function authenticateToken(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  verifyToken(token, req, res, next);
}

app.use("/api", authenticateToken, apiRoute);

app.use("/auth", authRouter);

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "test route", status: 200 });
});

app.listen(port, () => {
  print("server listening");
});

module.exports = app;
