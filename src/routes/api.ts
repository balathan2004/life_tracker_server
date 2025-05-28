import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../utils/config";
import { Router, Request, Response } from "express";

const apiRoute = Router();

apiRoute.post("/", async (req: Request, res: Response) => {});


export default apiRoute