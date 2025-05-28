import { Router, Request, Response } from "express";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firestore, auth } from "../utils/config";
import { doc, getDoc } from "firebase/firestore";
import { AuthResponseConfig, UserDataInterface } from "../interfaces";
import { print } from "../utils/logger";

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

      const userCred = (await signInWithEmailAndPassword(auth, email, password))
        .user;

      if (!userCred) {
        res.json({
          message: "account not found",
          status: 300,
          credentials: null,
        });
        return;
      }

      const docRef = doc(firestore, "users", userCred.uid);

      const userData = (await getDoc(docRef)).data() as UserDataInterface;
      res.json({ message: "logged in", status: 300, credentials: userData });
    } catch (err) {
      res.json({ message: err as string, status: 300, credentials: null });
    }
  }
);

authRouter.post("/register", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ message: "fields missing", status: 300 });
    print(req.body, "fields missing");
    return;
  }
});

//authRouter.post("/forget_password");

export default authRouter;
