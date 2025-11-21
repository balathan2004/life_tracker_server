import CryptoJS from "crypto-js";
import { Response, Router } from "express";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import {
  dailyLogInterface,
  JwtRequest,
  LogsResponseConfig,
  ResponseConfig,
  SingleLogResponseConfig,
} from "../interfaces";
import { firestore } from "../utils/config";
import { print } from "../utils/logger";

const appSecret = "LIGHTlifetrackerX92A7";

const apiRoute = Router();

apiRoute.post(
  "/update_doc",
  async (req: JwtRequest, res: Response<ResponseConfig>) => {
    try {
      console.log("accessed");
      const jwt = req.jwt;

      const { data } = req.body;
      console.log({ data });

      if (!jwt || !data) {
        res.status(300).json({ message: "unauthorised" });
        return;
      }

      const docRef = doc(firestore, "userlogs", jwt.uid, "logs", data.date);

      const encryptKey = deriveKey(jwt?.uid, appSecret);

      const encryptedData = encryptText(JSON.stringify(data), encryptKey);

      await setDoc(
        docRef,
        { data: encryptedData, encrypted: true },
        { merge: true }
      )
        .then((res) => {
          console.log({ res });
        })
        .catch((err) => print(err));
      res.status(200).json({ message: "success" });
    } catch (err) {
      print(err);
      res.status(300).json({ message: JSON.stringify(err) });
    }
  }
);

apiRoute.get(
  "/get_docs",
  async (req: JwtRequest, res: Response<LogsResponseConfig>) => {
    try {
      const jwt = req.jwt;

      console.log({ jwt });

      if (!jwt) {
        res.status(300).json({ message: "unauthorised", data: [] });
        return;
      }

      const collectionRef = collection(firestore, "userlogs", jwt.uid, "logs");

      const queryForDocs = query(collectionRef);
      const encryptKey = deriveKey(jwt?.uid, appSecret);
      const fetchDoc = (await getDocs(queryForDocs)).docs.map((doc) => {
        const docData = doc.data();

        if (docData?.encrypted) {
          console.log({ docData });
          const data = decryptText(docData.data, encryptKey);

          return JSON.parse(data) as dailyLogInterface;
        } else {
          return docData as dailyLogInterface;
        }
      });

      res.status(200).json({ message: "success", data: fetchDoc });
    } catch (err) {
      print(err);
      res.status(300).json({ message: JSON.stringify(err), data: [] });
    }
  }
);

apiRoute.get(
  "/get_my_dailylog/:id",
  async (req: JwtRequest, res: Response<SingleLogResponseConfig>) => {
    console.log("logged dailylog api");

    const jwt = req?.jwt;

    const doc_id = req.params.id as string;

    console.log({ doc_id, jwt });

    if (!jwt) {
      res.status(300).json({ message: "unauthorised", data: null });
      return;
    }

    if (!doc_id) {
      res.status(300).json({ message: "unauthorised", data: null });
      return;
    }

    const docRef = doc(firestore, "userlogs", jwt.uid, "logs", doc_id);

    const docExists = await getDoc(docRef);

    if (!docExists.exists()) {
      res.status(300).json({ message: "unauthorised", data: null });
      return;
    }

    const docData = docExists.data();

    const encryptKey = deriveKey(jwt?.uid, appSecret);

    let encryptedData = docData;

    if (docData?.encrypted) {
      console.log({ docData });
      const data = decryptText(docData.data, encryptKey);

      encryptedData = JSON.parse(data) as dailyLogInterface;
    }

    res.status(200).json({
      message: "success",
      data: encryptedData as dailyLogInterface,
    });
  }
);

apiRoute.post(
  "/encrypt_doc",
  async (req: JwtRequest, res: Response<ResponseConfig>) => {
    try {
      console.log("accessed encrypt doc");
      const jwt = req.jwt;

      const data = req.body.data as dailyLogInterface;
      console.log({ data });

      if (!jwt || !data) {
        res.status(300).json({ message: "unauthorised" });
        return;
      }

      const encryptKey = deriveKey(jwt?.uid, appSecret);

      const encryptedData = encryptText(JSON.stringify(data), encryptKey);

      const docRef = doc(firestore, "userlogs", jwt.uid, "logs", data.date);

      await setDoc(
        docRef,
        { data: encryptedData, encrypted: true },
        { merge: false }
      )
        .then((res) => {
          console.log({ res });
        })
        .catch((err) => print(err));
      res.status(200).json({ message: "success" });
    } catch (err) {
      print(err);
      res.status(300).json({ message: JSON.stringify(err) });
    }
  }
);

// Crypto functions
function deriveKey(userId: string, yourSecret: string) {
  return CryptoJS.SHA256(userId + yourSecret).toString();
}

export function encryptText(text: string, secret: string) {
  return CryptoJS.AES.encrypt(text, secret).toString();
}

export function decryptText(ciphertext: string, secret: string) {
  return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8);
}

// apiRoute.get(
//   "/delete_doc",
//   async (req: JwtRequest, res: Response<ResponseConfig>) => {
//     try {

//       const user_id = req.query.user_id as string;
//       const doc_id = req.query.doc_id as string;

//       print("doc delete req from ", user_id);

//       if (!user_id || !doc_id) {
//         res.status(300).json({ message: "Missing user_id or doc_id" });
//         return;
//       }

//       const docRef = doc(firestore, "docs", user_id);

//       await updateDoc(docRef, {
//         [`logs.${doc_id}`]: deleteField(),
//       });

//       res.status(200).json({ message: "success" });
//     } catch (err) {
//       print(err);
//       res.status(300).json({ message: JSON.stringify(err) });
//     }
//   }
// );

export default apiRoute;
