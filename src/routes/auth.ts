import { Router, Request, Response } from "express";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firestore, auth } from "../utils/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthResponseConfig, UserDataInterface } from "../interfaces";
import { print } from "../utils/logger";
import { generateUsername } from "unique-username-generator";
import { FirebaseError } from "firebase/app";

const authRouter = Router();

authRouter.post(
  "/login",
  async (req: Request, res: Response<AuthResponseConfig>) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        res.json({ message: "fields missing", status: 300, credentials: null });

        print(req.body, "fields missing");

        return;
      }

      const uid = (await signInWithEmailAndPassword(auth, email, password)).user
        .uid;

      if (!uid) {
        res.json({
          message: "account not found",
          status: 300,
          credentials: null,
        });
        return;
      }

      const docRef = doc(firestore, "users", uid);

      const userData = (await getDoc(docRef)).data() as UserDataInterface;

      print(userData);

      res.json({ message: "logged in", status: 300, credentials: userData });
    } catch (err) {
      if (err instanceof FirebaseError) {
        res.json({ message: err.code, status: 300, credentials: null });
        return;
      }

      res.json({ message: err as string, status: 300, credentials: null });
    }
  }
);

authRouter.post(
  "/register",
  async (req: Request, res: Response<AuthResponseConfig>) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.json({ message: "fields missing", status: 300, credentials: null });
        print(req.body, "fields missing");
        return;
      }

      const uid = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((user) => user.user.uid);

      const userData: UserDataInterface = {
        email,
        created_at: new Date().getTime(),
        display_name: generateUsername("-", 5),
        uid: uid,
      };

      await setDoc(doc(firestore, "users", uid), userData);

      print(userData);
      res.json({ message: "logged in", status: 300, credentials: userData });
    } catch (err) {
      console.log(err);

      if (err instanceof FirebaseError) {
        res.json({ message: err.code, status: 300, credentials: null });
        return;
      }

      res.json({ message: err as string, status: 300, credentials: null });
    }
  }
);

//authRouter.post("/forget_password");

export default authRouter;
