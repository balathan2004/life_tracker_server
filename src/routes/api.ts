import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../utils/config";
import { Router, Request, Response } from "express";
import { print } from "../utils/logger";
import { ResponseConfig } from "../interfaces";

const apiRoute = Router();

apiRoute.post("/update_doc", async (req: Request, res: Response) => {
  try {
    const { uid, data } = req.body;

    print("doc update from ", uid);

    if (!uid || !data) {
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
    print(err)
    res.json({ status: 200, message: JSON.stringify(err) });
  }
});

export default apiRoute;
