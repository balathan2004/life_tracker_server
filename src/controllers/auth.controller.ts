import { Request, Response } from "express";
import { AuthUser, DataResponseConfig, ResponseConfig } from "../types/index";
import { AuthServices } from "../services/auth.services";

export const AuthConroller = {
  async login(req: Request, res: Response<DataResponseConfig<AuthUser>>) {
    const { email, password } = req.body;

    const data = await AuthServices.login({ email, password });

    res.status(200).json({
      message: "login Successful",
      data: data,
    });
  },
  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const data = await AuthServices.register({ email, password });

    res.status(200).json({
      message: "logged in",
      data: data,
    });
  },
  async refreshToken(req: Request, res: Response) {
    const refreshToken = (req.body.refreshToken as string) || "";

    console.log({ refreshToken }, "token placed");

    console.log(refreshToken);

    const data = await AuthServices.verifyUsingRefresh(refreshToken);

    res.status(200).json({
      message: "autheticated",
      data: data,
    });
  },

  async forgetPassword(req: Request, res: Response<ResponseConfig>) {
    const { email } = req.body;

    const data = await AuthServices.forgetPassword(email);

    res.status(200).json({ message: "Password reset mail sent " });
  },
};
