import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../utils/config";
import {
  decryptText,
  decryptTextParse,
  deriveKey,
  encryptText,
} from "../utils/encrypt";
import { Thought, EncryptedThought } from "../types/mindSpace";
import { generateUUID } from "../utils/helpers";
import { docGetter, docRefMaker } from "../db/db.functions";
import { AppError } from "../utils/appError";

export const ThoughtService = {
  async get(uid: string) {
    const collectionRef = collection(firestore, `mindspace/${uid}/thoughts`);

    const encryptKey = deriveKey(uid);

    const docs = await getDocs(collectionRef);

    const newDocs = docs.docs.map((item) => item.data() as EncryptedThought);

    const decryptedData = newDocs.map((item) => {
      return JSON.parse(decryptText(item.data, encryptKey)) as Thought;
    });
    return decryptedData;
  },

  async getSingle(uid: string, doc_id: string) {
    const encryptKey = deriveKey(uid);

    const docData = await docGetter("mindspace", uid, "thoughts", doc_id);

    if (docData) {
      const decryptedData = decryptTextParse(docData?.data.data, encryptKey);
      return decryptedData as Thought;
    } else throw new AppError("Document not found", 400);
  },

  async create(uid: string, note: Thought) {
    const now = new Date().toISOString();

    const newThought: Thought = {
      _id: note._id ?? generateUUID(16),
      title: note.title ?? "",
      desc: note.desc ?? "",

      occurredAt: note.occurredAt ?? now,

      createdAt: note.createdAt ?? now,
      lastModified: note.lastModified ?? now,

      readsAt: note.readsAt ?? [],
      tags: note.tags ?? [],
    };

    const encryptKey = deriveKey(uid);

    const encryptedData: EncryptedThought = {
      encrypted: true,
      data: encryptText(newThought, encryptKey),
    };

    const docRef = docRefMaker("mindspace", uid, "thoughts", newThought._id);

    await setDoc(docRef, encryptedData);
    return newThought;
  },

  async update(uid: string, note: Thought) {
    const encryptKey = deriveKey(uid);

    const encryptedData: EncryptedThought = {
      encrypted: true,
      data: encryptText(note, encryptKey),
    };

    const docRef = docRefMaker("mindspace", uid, "thoughts", note._id);

    await setDoc(docRef, encryptedData);

    return { note };
  },
};
