import {
  DataListResponseConfig,
  DataResponseConfig,
  ResponseConfig,
  VerifiedJwtRequest,
} from "../types/common";
import { ThoughtService } from "../services/mindSpace.services";
import { Response, Request } from "express";
import { AppError } from "../utils/appError";
import { Thought } from "../types/mindSpace";
export const MindSpaceContoller = {
  async get(req: Request, res: Response<DataListResponseConfig<Thought>>) {
    const { jwt } = req as VerifiedJwtRequest;
    const { uid } = jwt;
    const data = await ThoughtService.get(uid);
    res.status(200).json({ data, message: "documents fetched" });
  },

  async getSingle(req: Request, res: Response<DataResponseConfig<Thought>>) {
    const { jwt } = req as VerifiedJwtRequest;
    const { uid } = jwt;
    const { id } = req.params;
    if (!id) throw new AppError("Document id is required", 400);

    const data = await ThoughtService.getSingle(uid, id);

    res.json({ data, message: "document fetched" });
  },

  async create(req: Request, res: Response<ResponseConfig>) {
    const { jwt } = req as VerifiedJwtRequest;
    const { uid } = jwt;
    const note = req.body.data;
    const data = await ThoughtService.create(uid, note);
    res.status(201).json({ message: "Document created" });
  },

  async update(req: Request, res: Response<ResponseConfig>) {
    const { jwt } = req as VerifiedJwtRequest;
    const { uid } = jwt;
    const doc_id = req.params.id as string;

    const note = req.body.data;

    if (doc_id !== note._id) {
      throw new AppError("Document ID does not match thought ID", 400);
    }

    const data = await ThoughtService.update(uid, note);
    res.json({ message: "Document updated" });
  },
};
