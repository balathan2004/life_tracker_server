export interface ResponseConfig {
  status: 200 | 300;
  message: string;
}

export interface QuoteResponseConfig {
  quote: string;
}

export interface AuthResponseConfig extends ResponseConfig {
  credentials: UserDataInterface | null;
}

export interface UserDataInterface {
  display_name: string;
  email: string;
  uid: string;
  created_at: number;
}

export interface dailyLogInterface {
  date: number; // e.g. "2025-05-22"
  wakeUpTime: number;
  sleepTime: number;

  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };

  workout?: string;
  bodyMeasurements?: {
    height: number;
    weight: number;
  };

  screenTimeMinutes?: number;
  somethingProductive?: string;
  isBathTaken: boolean;
  travel?: string;
  notes?: string;
}

export interface ResponseConfig {
  status: 200 | 300;
  message: string;
}

export interface QuoteResponseConfig {
  quote: string;
}

export interface UserDataInterface {
  display_name: string;
  uid: string;
  created_at: number;
}

export type foods = "breakfast" | "lunch" | "dinner" | "snacks";
