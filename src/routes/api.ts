import {
  arrayUnion,
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../utils/config";
import { Router, Request, Response } from "express";
import { print } from "../utils/logger";
import { dailyLogInterface, ResponseConfig } from "../interfaces";

const apiRoute = Router();

apiRoute.post("/update_doc", async (req: Request, res: Response) => {
  try {
    const { uid, data } = req.body;

    print("doc update from ", uid);

    if (!uid || !data) {
      res.json({ status: 300, message: "fields missing" });
      return;
    }

    const docRef = doc(firestore, "docs", uid);

    const fetchDoc = await getDoc(docRef);

    if (!fetchDoc.exists()) {
      await setDoc(docRef, { logs: { [data.date]: data } });
      return;
    }

    await setDoc(
      docRef,
      {
        logs: {
          [data.date]: data,
        },
      },
      { merge: true }
    );
    res.json({ status: 200, message: "success" });
  } catch (err) {
    print(err);
    res.json({ status: 300, message: JSON.stringify(err) });
  }
});

apiRoute.get("/get_docs", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    print("doc fetch from ", userId);

    if (!userId) {
      return;
    }

    const docRef = doc(firestore, "docs", userId);

    const fetchDoc = (await getDoc(docRef)).data()?.logs as {
      [date: string]: dailyLogInterface;
    };

    res.json({ status: 200, message: "success", docs: fetchDoc });
  } catch (err) {
    print(err);
    res.json({ status: 300, message: JSON.stringify(err) });
  }
});

apiRoute.get(
  "/delete_doc",
  async (req: Request, res: Response<ResponseConfig>) => {
    try {
      const user_id = req.query.user_id as string;
      const doc_id = req.query.doc_id as string;

      print("doc delete req from ", user_id);

      if (!user_id || !doc_id) {
        res.json({ status: 200, message: "Missing user_id or doc_id" });
        return;
      }

      const docRef = doc(firestore, "docs", user_id);

      await updateDoc(docRef, {
        [`logs.${doc_id}`]: deleteField(),
      });

      res.json({ status: 200, message: "success" });
    } catch (err) {
      print(err);
      res.json({ status: 300, message: JSON.stringify(err) });
    }
  }
);

export default apiRoute;
