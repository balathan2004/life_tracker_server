import z from "zod";

export const loginSchema = z.object({
  email: z.email("invalid email"),
  password: z.string("invalid password"),
});

z.email()

export const forgetPasswordSchema = z.object({
  email: z.email("invalid email"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string("invalid refresh token"),
});
