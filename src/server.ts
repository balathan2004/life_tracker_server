import dotenv from "dotenv";
dotenv.config();
import { print } from "./utils/logger";
global.print = print;
import express, { Request, Response } from "express";
import cors from "cors";
import apiRoute from "./routes/api";
import authRouter from "./routes/auth";

const app = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
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

app.use("/api", apiRoute);

app.use("/auth", authRouter);

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "test route", status: 200 });
});

app.listen(port, () => {
  print("server listening");
});

module.exports = app;
