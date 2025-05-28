export interface ResponseConfig {
    status: 200 | 300;
    message: string;
  }
  
  export interface QuoteResponseConfig {
    quote: string;
  }
  
  export interface AuthResponseConfig extends ResponseConfig {
    credentials: UserDataInterface|null;
  }
  
  export interface UserDataInterface {
    display_name: string;
    profile_url: string;
    uid: string;
    created_at: number;
  }
  
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
  
  export const initDailyLog = () => {
    const data: dailyLogInterface = {
      date: "",
      wakeUpTime: 0,
      sleepTime: 0,
      meals: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snacks: "",
      },
      workout: "",
      bodyMeasurements: {
        height: 0,
        weight: 0,
      },
      screenTimeMinutes: 0,
      somethingProductive: "",
      isBathTaken: false,
      travel: "",
      notes: "",
    };
    return data;
  };
  