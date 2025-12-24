import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../utils/config";

import { encryptedDoc } from "../types/common";

import { dailyLogInterface } from "../types/lifeTracker";

export const collectionRefMaker = (uid: string) => {
  const collectionRef = collection(firestore, `mindspace/${uid}/thoughts`);

  return collectionRef;
};

export const docRefMaker = (
  collectionName: "mindspace" | "userlogs",
  uid: string,
  subCollection: "logs" | "thoughts",
  doc_id: string
) => {
  const docRef = doc(firestore, collectionName, uid, subCollection, doc_id);

  return docRef;
};

export const docGetter = async (
  collectionName: "mindspace" | "userlogs",
  uid: string,
  subCollection: "logs" | "thoughts",
  doc_id: string
) => {
  const docRef = docRefMaker(collectionName, uid, subCollection, doc_id);
  const doc = await getDoc(docRef);

  if (doc.exists()) {
    return { data: doc.data(), ref: docRef };
  }

  return null;
};

export async function paginatedDocs(
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  cursor?: string
) {
  let q;

  if (!cursor) {
    q = query(collectionRef, orderBy("__name__", "desc"), limit(Number(10)));
  } else {
    q = query(
      collectionRef,
      orderBy("__name__", "desc"),
      startAfter(cursor),
      limit(10)
    );
  }

  const snap = await getDocs(q);
  const docs = snap.docs.map(
    (doc) => doc.data() as dailyLogInterface | encryptedDoc
  );

  return docs;
}
