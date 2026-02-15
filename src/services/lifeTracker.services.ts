import { collection, setDoc } from "firebase/firestore";
import { dailyLogInterface } from "../types";
import { firestore } from "../utils/config";
import { decryptTextParse, deriveKey, encryptText } from "../utils/encrypt";
import { docGetter, docRefMaker, paginatedDocs } from "../db/db.functions";

export const lifeTrackerService = {
  async getLogs(uid: string, cursor?: string) {
    const collectionRef = collection(firestore, "userlogs", uid, "logs");
    const docs = await paginatedDocs(collectionRef, cursor);
    const encryptKey = deriveKey(uid);

    const decrypted = docs.map((item) => {
      if (
        "encrypted" in item &&
        "data" in item &&
        item.encrypted &&
        item.data
      ) {
        return decryptTextParse(item.data, encryptKey) as dailyLogInterface;
      }
      return item as dailyLogInterface;
    });

    return decrypted;
  },

  async getSingle(uid: string, doc_id: string) {
    const docFetch = await docGetter("userlogs", uid, "logs", doc_id);
    const docData = docFetch?.data;

    const encryptKey = deriveKey(uid);

    let decryptedData = docData;

    if (docData?.encrypted) {
      decryptedData = decryptTextParse(docData.data, encryptKey);
    }
    return decryptedData as dailyLogInterface;
  },

  async updateLog(uid: string, data: dailyLogInterface) {
    const docRef = docRefMaker("userlogs", uid, "logs", data.date);

    const encryptKey = deriveKey(uid);

    const encryptedData = encryptText({ ...data, encrypted: true }, encryptKey);

   console.log({encryptedData}) 

    await setDoc(docRef, { data: encryptedData, encrypted: true });
    return data;
  },

  // ⚠️ LEGACY ONLY – remove after migration

  async encryptDoc(uid: string, data: dailyLogInterface) {
    if (data?.encrypted) {
      console.log("already encrypted");
      return data;
    }

    const encryptKey = deriveKey(uid);

    const newData = { ...data, encrypted: true } as dailyLogInterface;

    const encryptedData = encryptText(newData, encryptKey);

    const docRef = docRefMaker("userlogs", uid, "logs", data.date);

    await setDoc(docRef, { data: encryptedData, encrypted: true });
    return data;
  },
};
