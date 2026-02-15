
export interface ResponseConfig {
  message: string;
}

export interface JwtRequest extends Request {
  jwt?: User;
}

export interface VerifiedJwtRequest extends Request {
  jwt: User;
}

export interface QuoteResponseConfig {
  quote: string;
}

export type encryptedDoc = {
  encrypted: boolean;
  data: string;
};

export interface User {
  display_name: string;
  uid: string;
  created_at: number;
  email: string;
}

export interface ResponseConfig {
  message: string;
}

export type DataResponseConfig<T> = ResponseConfig & {
  data: T;
};

export type DataListResponseConfig<T> = ResponseConfig & {
  data: T[];
};

export interface AuthUser {
  user: User;
  accessToken: string;
  refreshToken: string;
}





export interface QuoteResponse extends ResponseConfig {
  quote: {
    quoteId: string;
    quote: string;
    author: string;
    userId: string;
    createdAt: number;
    username: string;
  }[];
}


export type foods = "breakfast" | "lunch" | "dinner" | "snacks";



export interface dailyLogInterface {
  date: string; // e.g. "2025-05-22"
  wakeUpTime: number;
  sleepTime: number;

  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };

  workout: string;
  bodyMeasurements: {
    height: string;
    weight: string;
  };

  screenTimeMinutes: number;
  somethingProductive: string;
  isBathTaken: boolean;
  travel: string;
  notes: string;
  encrypted?: boolean;
}
