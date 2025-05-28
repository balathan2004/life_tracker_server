// src/utils/logger.ts
export const print = (...args: any[]) => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(`[🧠 LOG] ${timestamp} →`, ...args);
};
