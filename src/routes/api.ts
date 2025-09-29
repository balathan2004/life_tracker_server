import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../utils/config";
import { Router, Response } from "express";
import { print } from "../utils/logger";
import { JwtRequest } from "../interfaces";

const apiRoute = Router();

apiRoute.post("/update_doc", async (req: JwtRequest, res: Response) => {
  try {
    console.log("accessed");
    const jwt = req.jwt;

    const { data } = req.body;
    console.log({ data });

    if (!jwt || !data) {
      res.status(300).json({ message: "unauthorised", docs: [] });
      return;
    }

    const docRef = doc(firestore, "userlogs", jwt.uid, "logs", data.date);

    await setDoc(docRef, {...data}, { merge: true })
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => print(err));
    res.json({ status: 200, message: "success" });
  } catch (err) {
    print(err);
    res.json({ status: 300, message: JSON.stringify(err) });
  }
});

apiRoute.get("/get_docs", async (req: JwtRequest, res: Response) => {
  try {
    const jwt = req.jwt;

    console.log({ jwt });

    if (!jwt) {
      res.status(300).json({ message: "unauthorised", docs: [] });
      return;
    }

    const collectionRef = collection(firestore, "userlogs", jwt.uid, "logs");

    const queryForDocs = query(collectionRef, orderBy("date", "desc"));

    const fetchDoc = (await getDocs(queryForDocs)).docs.map((doc) =>
      doc.data()
    );

    res.status(200).json({ message: "success", docs: fetchDoc });
  } catch (err) {
    print(err);
    res.status(300).json({ message: JSON.stringify(err) });
  }
});

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
