export const isDev = import.meta.env.DEV;
export const hasClientKey = import.meta.env.VITE_GEMINI_API_KEY;
export const useClientSide = isDev && hasClientKey; // Global temper configuration
export const TEMPER_STORAGE_KEY = "shaaji_temper_level";
import { useLanguageStore } from "../store/languageStore";

export function getUncleName() {
  const { language } = useLanguageStore.getState();
  return language === "ar" ? "Hakeem" : "Shaaji";
}

export function getMascotHead(language = "ml", temper = 1 /* Neutral */) {
  const languagesWithMascotHeads = ["ta", "mr", "ar", "bn"];
  let imgPrefix = "/mascot-head/";
  if (languagesWithMascotHeads.includes(language)) {
    imgPrefix += language;
  } else {
    imgPrefix += "ml";
  }
  switch (temper) {
    case 0:
      return `${imgPrefix}-happy.png`;
    case 1:
      return `${imgPrefix}.png`;
    case 2:
      return `${imgPrefix}-angry.png`;
    default:
      return `${imgPrefix}.png`;
  }
}

export function getTemperConfig() {
  const { language } = useLanguageStore.getState();
  return {
    0: {
      img: getMascotHead(language, 0),
      time: "6 AM",
      bgColor: "bg-blue-100 dark:bg-blue-200",
      textColor: "text-blue-900",
      gradientColor: "#3b82f6",
      description: `Morning ${getUncleName()} is calm and gentle, giving thoughtful advice with patience.`,
    },
    1: {
      img: getMascotHead(language, 1),
      time: "12 PM",
      bgColor: "bg-orange-100 dark:bg-orange-200",
      textColor: "text-orange-900",
      gradientColor: "#f97316",
      description: `Neutral ${getUncleName()} is balanced, mixing wisdom with mild skepticism.`,
    },
    2: {
      img: getMascotHead(language, 2),
      time: "6 PM",
      bgColor: "bg-red-100 dark:bg-red-200",
      textColor: "text-red-900",
      gradientColor: "#ef4444",
      description: `Evening ${getUncleName()} is irritated and blunt, showing his true Malayalam uncle frustration.`,
    },
  };
}
