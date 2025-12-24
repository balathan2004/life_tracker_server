import { Request } from "express";
export interface ResponseConfig {
  message: string;
}

export interface JwtRequest extends Request {
  jwt?: UserDataInterface;
}

export interface VerifiedJwtRequest extends Request {
  jwt: UserDataInterface;
}

export interface QuoteResponseConfig {
  quote: string;
}

export interface AuthResponseConfig extends ResponseConfig {
  credentials: UserDataInterface | null;
  accessToken?: string;
  refreshToken?: string;
}

export interface UserDataInterface {
  display_name: string;
  email: string;
  uid: string;
  created_at: number;
}

export type DataResponseConfig<T> = {
  data: T;
  message: string;
};

export type DataListResponseConfig<T> = {
  data: T[];
  message: string;
};

export type encryptedDoc = {
  encrypted: boolean;
  data: string;
};

export interface QuoteResponseConfig {
  quote: string;
}

export interface UserDataInterface {
  display_name: string;
  uid: string;
  created_at: number;
}

// mind space
