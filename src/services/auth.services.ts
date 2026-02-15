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
import { AuthUser, User } from "../types/index";
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

    const user = (await getDoc(docRef)).data() as User;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return {user, accessToken, refreshToken}  as AuthUser;
  },

  async register({ email, password }: { email: string; password: string }) {
    const uid = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    ).then((res) => res.user.uid);

    const user: User = {
      email,
      created_at: new Date().getTime(),
      display_name: generateUsername("-", 5),
      uid: uid,
    };

    await setDoc(doc(firestore, "users", uid), user);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

  return {user, accessToken, refreshToken}  as AuthUser;  },

  async verifyUsingRefresh(token: string) {
    const payload = verifyRefreshToken(token);

    const { created_at, display_name, email, uid } = payload as User;

    const user = {
      created_at,
      display_name,
      email,
      uid,
    };

    if (!user) {
      print("data not found");
      throw new AppError("unauthorised", 400);
    }

    const accessToken = generateAccessToken(user);

   return {user, accessToken}  as AuthUser;
  },

  async forgetPassword(email: string) {
    const res = await sendPasswordResetEmail(auth, email);
  },
};
