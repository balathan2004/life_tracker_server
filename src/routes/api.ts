// import { Response, Router } from "express";
// import {
//   collection,
//   CollectionReference,
//   doc,
//   DocumentData,
//   getDoc,
//   getDocs,
//   limit,
//   orderBy,
//   query,
//   setDoc,
//   startAfter,
// } from "firebase/firestore";
// import {
//   dailyLogInterface,
//   encryptedDoc,
//   JwtRequest,
//   LogsResponseConfig,
//   ResponseConfig,
//   SingleLogResponseConfig,
// } from "../types/common";
// import { firestore } from "../utils/config";
// import { print } from "../utils/logger";
// import { deriveKey, encryptText, decryptText } from "../utils/encrypt";

// 

// const apiRoute = Router();

// apiRoute.post(
//   "/update_doc",
//   async (req: JwtRequest, res: Response<ResponseConfig>) => {
//     try {
//       console.log("accessed");
//       const jwt = req.jwt;

//       const { data } = req.body;
//       console.log({ data });

//       if (!jwt || !data) {
//         res.status(300).json({ message: "unauthorised" });
//         return;
//       }

//       const docRef = doc(firestore, "userlogs", jwt.uid, "logs", data.date);

//       const encryptKey = deriveKey(jwt?.uid);

//       const encryptedData = encryptText(
//         { ...data, encrypted: true },
//         encryptKey
//       );

//       await setDoc(docRef, { data: encryptedData, encrypted: true })
//         .then((res) => {
//           console.log({ res });
//         })
//         .catch((err) => print(err));
//       res.status(200).json({ message: "success" });
//     } catch (err) {
//       print(err);
//       res.status(300).json({ message: JSON.stringify(err) });
//     }
//   }
// );

// apiRoute.get(
//   "/get_docs",
//   async (req: JwtRequest, res: Response<LogsResponseConfig>) => {
//     try {
//       const jwt = req.jwt;

//       const { cursor } = req.query as { cursor?: string };

//       console.log(cursor, "cursor");

//       if (!jwt) {
//         res.status(300).json({ message: "unauthorised", data: [] });
//         return;
//       }
//       const collectionRef = collection(firestore, "userlogs", jwt.uid, "logs");
//       const docs = await paginatedDocs(collectionRef, cursor);
//       const encryptKey = deriveKey(jwt?.uid);

//       const decrypted = docs.map((item) => {
//         if (
//           "encrypted" in item &&
//           "data" in item &&
//           item.encrypted &&
//           item.data
//         ) {
//           return JSON.parse(
//             decryptText(item.data, encryptKey)
//           ) as dailyLogInterface;
//         }
//         return item as dailyLogInterface;
//       });

//       res.status(200).json({ message: "success", data: decrypted });
//     } catch (err) {
//       print(err);
//       res.status(300).json({ message: JSON.stringify(err), data: [] });
//     }
//   }
// );

// apiRoute.get(
//   "/get_my_dailylog/:id",
//   async (req: JwtRequest, res: Response<SingleLogResponseConfig>) => {
//     console.log("logged dailylog api");

//     const jwt = req?.jwt;

//     const doc_id = req.params.id as string;

//     if (!jwt) {
//       res.status(300).json({ message: "unauthorised", data: null });
//       return;
//     }

//     if (!doc_id) {
//       res.status(300).json({ message: "unauthorised", data: null });
//       return;
//     }

//     const docRef = doc(firestore, "userlogs", jwt.uid, "logs", doc_id);

//     const docExists = await getDoc(docRef);

//     if (!docExists.exists()) {
//       res.status(300).json({ message: "unauthorised", data: null });
//       return;
//     }

//     const docData = docExists.data();

//     const encryptKey = deriveKey(jwt?.uid);

//     let encryptedData = docData as dailyLogInterface;

//     if (docData?.encrypted) {
//       console.log({ docData });
//       const data = decryptText(docData.data, encryptKey);

//       encryptedData = JSON.parse(data) as dailyLogInterface;
//       encryptedData = { ...encryptedData };
//     }

//     res.status(200).json({
//       message: "success",
//       data: encryptedData as dailyLogInterface,
//     });
//   }
// );

// apiRoute.post(
//   "/encrypt_doc",
//   async (req: JwtRequest, res: Response<ResponseConfig>) => {
//     try {
//       console.log("accessed encrypt doc");
//       const jwt = req.jwt;

//       const data = req.body.data as dailyLogInterface;

//       if (!jwt || !data) {
//         res.status(300).json({ message: "unauthorised" });
//         return;
//       }

//       if (data?.encrypted) {
//         console.log("already encrypted");
//         res.status(200).json({ message: "doc already encrypted" });
//         return;
//       }

//       const encryptKey = deriveKey(jwt?.uid);

//       const newData = { ...data, encrypted: true } as dailyLogInterface;

//       const encryptedData = encryptText(newData, encryptKey);

//       const docRef = doc(firestore, "userlogs", jwt.uid, "logs", data.date);

//       await setDoc(
//         docRef,
//         { data: encryptedData, encrypted: true },
//         { merge: false }
//       ).catch((err) => print(err));
//       res.status(200).json({ message: "success" });
//     } catch (err) {
//       print(err);
//       res.status(300).json({ message: JSON.stringify(err) });
//     }
//   }
// );

// // Crypto functions

// async function paginatedDocs(
//   collectionRef: CollectionReference<DocumentData, DocumentData>,
//   cursor?: string
// ) {
//   let q;

//   if (!cursor) {
//     q = query(collectionRef, orderBy("__name__", "desc"), limit(Number(10)));
//   } else {
//     q = query(
//       collectionRef,
//       orderBy("__name__", "desc"),
//       startAfter(cursor),
//       limit(10)
//     );
//   }

//   const snap = await getDocs(q);
//   const docs = snap.docs.map(
//     (doc) => doc.data() as dailyLogInterface | encryptedDoc
//   );

//   return docs;
// }

// // apiRoute.get(
// //   "/delete_doc",
// //   async (req: JwtRequest, res: Response<ResponseConfig>) => {
// //     try {

// //       const user_id = req.query.user_id as string;
// //       const doc_id = req.query.doc_id as string;

// //       print("doc delete req from ", user_id);

// //       if (!user_id || !doc_id) {
// //         res.status(300).json({ message: "Missing user_id or doc_id" });
// //         return;
// //       }

// //       const docRef = doc(firestore, "docs", user_id);

// //       await updateDoc(docRef, {
// //         [`logs.${doc_id}`]: deleteField(),
// //       });

// //       res.status(200).json({ message: "success" });
// //     } catch (err) {
// //       print(err);
// //       res.status(300).json({ message: JSON.stringify(err) });
// //     }
// //   }
// // );

// export default apiRoute;
