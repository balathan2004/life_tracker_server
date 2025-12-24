import { Router } from "express";

import { AuthConroller } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/bodyValidator";
import {
  loginSchema,
  forgetPasswordSchema,
  refreshTokenSchema,
} from "../schemas/auth.schema";
const AuthApiRoute = Router();

AuthApiRoute.post("/login", validateBody(loginSchema), AuthConroller.login);

AuthApiRoute.post(
  "/register",
  validateBody(loginSchema),
  AuthConroller.register
);
AuthApiRoute.post(
  "/reset_password",
  validateBody(forgetPasswordSchema),
  AuthConroller.forgetPassword
);
AuthApiRoute.post(
  "/refreshToken",
  validateBody(refreshTokenSchema),
  AuthConroller.refreshToken
);

export default AuthApiRoute;
