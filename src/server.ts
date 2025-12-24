import dotenv from "dotenv";
dotenv.config();
import { print } from "./utils/logger";
global.print = print;
import express, { Request, Response } from "express";
import cors from "cors";
// import apiRoute from "./routes/api";
// import authRouter from "./routes/auth";
import mindSpaceRouter from "./routes/mindspace";
import { authenticateToken } from "./jwt/jwt";
import { errorHandler } from "./middlewares/errorHandler";
import LifeTrackerRouter from "./routes/lifeTracker";
import AuthApiRoute from "./routes/authApi";

const app = express();

const port = process.env.PORT || 3000;

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

app.use("/auth", AuthApiRoute);
app.use("/api", authenticateToken, LifeTrackerRouter);
app.use("/mindspace", authenticateToken, mindSpaceRouter);

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "test route", status: 200 });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);

app.listen(port, () => {
  print("server listening");
});

module.exports = app;
