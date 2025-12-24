import {  ResponseConfig } from "./common";

export interface LogsResponseConfig extends ResponseConfig {
  data: dailyLogInterface[];
}

export interface SingleLogResponseConfig extends ResponseConfig {
  data: dailyLogInterface | null;
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
