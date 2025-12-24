// import { Router, Request, Response } from "express";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { firestore, auth } from "../utils/config";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { AuthResponseConfig, UserDataInterface } from "../types/common";
// import { print } from "../utils/logger";
// import { generateUsername } from "unique-username-generator";
// import { FirebaseError } from "firebase/app";
// import jwt from "jsonwebtoken";
// import {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyRefreshToken,
// } from "../jwt/jwt";

// const authRouter = Router();

// authRouter.post(
//   "/login",
//   async (req: Request, res: Response<AuthResponseConfig>) => {
//     const { email, password } = req.body;

//     try {
//       if (!email || !password) {
//         res.status(300).json({
//           message: "fields missing",
//           credentials: null,
//         });
//         print(req.body, "fields missing");
//         return;
//       }

//       const uid = (await signInWithEmailAndPassword(auth, email, password)).user
//         .uid;

//       if (!uid) {
//         res.status(300).json({
//           message: "account not found",
//           credentials: null,
//         });
//         return;
//       }

//       const docRef = doc(firestore, "users", uid);

//       const userData = (await getDoc(docRef)).data() as UserDataInterface;
//       const jwt = generateAccessToken(userData);

//       res.status(200).json({
//         message: "logged in",
//         credentials: userData,
//         accessToken: jwt,
//         refreshToken: generateRefreshToken(userData),
//       });
//     } catch (err) {
//       if (err instanceof FirebaseError) {
//         res.status(300).json({
//           message: err.code,
//           credentials: null,
//         });
//         return;
//       }
//       res.status(300).json({
//         message: err as string,
//         credentials: null,
//       });
//     }
//   }
// );

// authRouter.post(
//   "/register",
//   async (req: Request, res: Response<AuthResponseConfig>) => {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         res.status(300).json({
//           message: "fields missing",
//           credentials: null,
//         });
//         print(req.body, "fields missing");
//         return;
//       }

//       const uid = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       ).then((user) => user.user.uid);

//       const userData: UserDataInterface = {
//         email,
//         created_at: new Date().getTime(),
//         display_name: generateUsername("-", 5),
//         uid: uid,
//       };

//       await setDoc(doc(firestore, "users", uid), userData);
//       const jwt = generateAccessToken(userData);

//       res.status(200).json({
//         message: "logged in",
//         credentials: userData,
//         accessToken: jwt,
//         refreshToken: generateRefreshToken(userData),
//       });
//     } catch (err) {
//       console.log(err);

//       if (err instanceof FirebaseError) {
//         res.status(300).json({
//           message: err.code,
//           credentials: null,
//         });
//         return;
//       }

//       res.status(300).json({
//         message: err as string,
//         credentials: null,
//       });
//     }
//   }
// );

// authRouter.post(
//   "/refreshToken",
//   (req: Request, res: Response<AuthResponseConfig>) => {
//     const refreshToken = (req.body.refreshToken as string) || "";

//     if (!refreshToken) {
//       res.status(300).json({
//         credentials: null,
//         message: "autheticated",
//       });
//       return;
//     }

//     try {
//       // const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET || "");

//       const payload = verifyRefreshToken(refreshToken);

//       const { created_at, display_name, email, uid } =
//         payload as UserDataInterface;

//       const userData = {
//         created_at,
//         display_name,
//         email,
//         uid,
//       };

//       if (!userData) {
//         print("data not found");
//         res.status(300).json({
//           credentials: null,
//           message: "unAuthorised",
//           accessToken: "",
//         });
//         return;
//       }

//       const newAccessToken = generateAccessToken(userData);

//       res.status(200).json({
//         credentials: userData,
//         message: "autheticated",
//         accessToken: newAccessToken,
//       });
//     } catch (err) {
//       console.log({ err });

//       res.status(300).json({
//         credentials: null,
//         message: "not authenticated",
//         accessToken: "",
//       });
//     }
//   }
// );

// export default authRouter;
