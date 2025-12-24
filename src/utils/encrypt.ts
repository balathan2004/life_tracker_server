import CryptoJS from "crypto-js";

const APP_SECRET = process.env.APP_SECRET || "";

export function deriveKey(userId: string) {
  return CryptoJS.SHA256(userId + APP_SECRET).toString();
}

export function encryptText(data: any, secret: string) {
  const text = JSON.stringify(data);
  return CryptoJS.AES.encrypt(text, secret).toString();
}

export function decryptText(ciphertext: string, secret: string) {
  return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8);
}

export function decryptTextParse(ciphertext: string, secret: string) {
  const jsonString = decryptText(ciphertext, secret);
  return JSON.parse(jsonString);
}
