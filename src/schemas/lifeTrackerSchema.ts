import { date } from "zod";
import z from "zod";

export const dailyLogSchema = z.object({
  date: z.string(), // e.g. "2025-05-22"
  wakeUpTime: z.number(),
  sleepTime: z.number(),

  meals: z.object({
    breakfast: z.string(),
    lunch: z.string(),
    dinner: z.string(),
    snacks: z.string(),
  }),

  workout: z.string(),
  bodyMeasurements: z.object({
    height: z.string(),
    weight: z.string(),
  }),

  mood: z.enum(["great", "good", "okay", "low", "bad"]),

  screenTimeMinutes: z.number(),
  somethingProductive: z.string(),
  isBathTaken: z.boolean(),
  travel: z.string(),
  notes: z.string(),
}).strict();
