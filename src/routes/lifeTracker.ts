import { Router } from "express";
import { LifeTrackerController } from "../controllers/lifeTracker.controller";
import { validateBody } from "../middlewares/bodyValidator";
import { dailyLogSchema } from "../schemas/lifeTrackerSchema";
const LifeTrackerRouter = Router();

LifeTrackerRouter.get("/docs", LifeTrackerController.get);

LifeTrackerRouter.get("/docs/:id", LifeTrackerController.getSingle);

LifeTrackerRouter.put(
  "/docs/:id",
  validateBody(dailyLogSchema),
  LifeTrackerController.update
);

LifeTrackerRouter.put(
  "/encrypt/:id",
  validateBody(dailyLogSchema),
  LifeTrackerController.encrypt
);

export default LifeTrackerRouter;
