import {
  DataListResponseConfig,
  DataResponseConfig,
  ResponseConfig,
  VerifiedJwtRequest,
} from "../types/index";
import { Response, Request } from "express";
import { lifeTrackerService } from "../services/lifeTracker.services";
import { AppError } from "../utils/appError";
import { dailyLogInterface } from "../types";


export const LifeTrackerController = {
  async get(
    req: Request,
    res: Response<DataListResponseConfig<dailyLogInterface>>
  ) {
    const { jwt } = req as unknown as VerifiedJwtRequest;
    const { uid } = jwt;

    const { cursor } = req.query as { cursor?: string };

    const data = await lifeTrackerService.getLogs(uid, cursor);

    res.status(200).json({ data: data, message: "docs fetched" });
  },

  async getSingle(
    req: Request,
    res: Response<DataResponseConfig<dailyLogInterface>>
  ) {
       const { jwt } = req as unknown as VerifiedJwtRequest;
    const { uid } = jwt;

    const doc_id = req.params.id as string;

    if (!doc_id) {
      throw new AppError("Document ID not found", 400);
    }

    const data = await lifeTrackerService.getSingle(uid, doc_id);

    res.status(200).json({ data: data, message: "doc fetched" });
  },

  async update(req: Request, res: Response<ResponseConfig>) {
     const { jwt } = req as unknown as VerifiedJwtRequest;
    const { uid } = jwt;
    const doc_id = req.params.id as string;
    const log = req.body;

    console.log({log})

    console.log({ doc_id });

    if (doc_id !== log.date) {
      throw new AppError("Document ID does not match log date", 400);
    }

    const data = await lifeTrackerService.updateLog(uid, log);
    res.status(200).json({ message: "docs updated" });
  },
  async encrypt(req: Request, res: Response<ResponseConfig>) {
     const { jwt } = req as unknown as VerifiedJwtRequest;
    const { uid } = jwt;
    const log = req.body;

    const doc_id = req.params.id as string;

    if (doc_id !== log.date) {
      throw new AppError("Document ID does not match log date", 400);
    }

    const data = await lifeTrackerService.encryptDoc(uid, log);
    res.status(200).json({ message: "document encrypted" });
  },
};
