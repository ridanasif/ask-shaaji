export const isDev = import.meta.env.DEV;
export const hasClientKey = import.meta.env.VITE_GEMINI_API_KEY;
export const useClientSide = isDev && hasClientKey; // Global temper configuration
export const TEMPER_STORAGE_KEY = "shaaji_temper_level";
import { useLanguageStore } from "../store/languageStore";

export function getTemperConfig() {
  const { language } = useLanguageStore.getState();
  return {
    0: {
      img: language === "ta" ? "tamil-head-happy.png" : "maveli-head-happy.png",
      time: "6 AM",
      bgColor: "bg-blue-100 dark:bg-blue-200",
      textColor: "text-blue-900",
      gradientColor: "#3b82f6",
      description:
        "Morning Shaaji is calm and gentle, giving thoughtful advice with patience.",
    },
    1: {
      img: language === "ta" ? "tamil-head.png" : "maveli-head.png",
      time: "12 PM",
      bgColor: "bg-orange-100 dark:bg-orange-200",
      textColor: "text-orange-900",
      gradientColor: "#f97316",
      description:
        "Neutral Shaaji is balanced, mixing wisdom with mild skepticism.",
    },
    2: {
      img: language === "ta" ? "tamil-head-angry.png" : "maveli-head-angry.png",
      time: "6 PM",
      bgColor: "bg-red-100 dark:bg-red-200",
      textColor: "text-red-900",
      gradientColor: "#ef4444",
      description:
        "Evening Shaaji is irritated and blunt, showing his true Malayalam uncle frustration.",
    },
  };
}
