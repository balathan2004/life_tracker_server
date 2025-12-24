import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AppError } from "../utils/appError";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../utils/config";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../jwt/jwt";
import { UserDataInterface } from "../types/common";
import { generateUsername } from "unique-username-generator";
import { print } from "../utils/logger";

export const AuthServices = {
  async login({ email, password }: { email: string; password: string }) {
    const uid = (await signInWithEmailAndPassword(auth, email, password)).user
      .uid;

    if (!uid) {
      throw new AppError("Account not found", 400);
    }
    const docRef = doc(firestore, "users", uid);

    const credentials = (await getDoc(docRef)).data() as UserDataInterface;
    const accessToken = generateAccessToken(credentials);
    const refreshToken = generateRefreshToken(credentials);
    return { credentials, accessToken, refreshToken };
  },

  async register({ email, password }: { email: string; password: string }) {
    const uid = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((user) => user.user.uid);

    const credentials: UserDataInterface = {
      email,
      created_at: new Date().getTime(),
      display_name: generateUsername("-", 5),
      uid: uid,
    };

    await setDoc(doc(firestore, "users", uid), credentials);
    const accessToken = generateAccessToken(credentials);
    const refreshToken = generateRefreshToken(credentials);

    return { credentials, accessToken, refreshToken };
  },

  async verifyUsingRefresh(token: string) {
    const payload = verifyRefreshToken(token);

    const { created_at, display_name, email, uid } =
      payload as UserDataInterface;

    const credentials = {
      created_at,
      display_name,
      email,
      uid,
    };

    if (!credentials) {
      print("data not found");
      throw new AppError("unauthorised", 400);
    }

    const accessToken = generateAccessToken(credentials);

    return { credentials, accessToken };
  },

  async forgetPassword(email: string) {
    const res = await sendPasswordResetEmail(auth, email);
  },
};
