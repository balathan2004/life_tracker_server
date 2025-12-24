import { Router } from "express";
import { MindSpaceContoller } from "../controllers/mindSpace.controller";
import { Request, Response } from "express";
import { validateBody } from "../middlewares/bodyValidator";
import { thoughtSchema } from "../schemas/mindSpaceSchema";
const mindSpaceRouter = Router();

mindSpaceRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "MindSpace Router is working" });
});

mindSpaceRouter.get("/thoughts", MindSpaceContoller.get);

mindSpaceRouter.get("/thoughts/:id", MindSpaceContoller.getSingle);

mindSpaceRouter.post(
  "/thoughts",
  validateBody(thoughtSchema),
  MindSpaceContoller.create
);

mindSpaceRouter.put(
  "/thoughts/:id",
  validateBody(thoughtSchema),
  MindSpaceContoller.update
);

export default mindSpaceRouter;
