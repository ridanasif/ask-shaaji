import { create } from "zustand";
import { persist } from "zustand/middleware";
import { languages } from "../constants/app";

// Helper function remains the same
function getLanguageFromURL() {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  if (languages.some((language) => language.code === lang)) {
    return lang;
  }
  return null;
}

// 1. Create the store with standard persistence. No more complex overrides.
export const useLanguageStore = create(
  persist(
    (set) => ({
      // The store will initialize from localStorage, or use 'ml' as a fallback.
      language: "ml",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "shaaji-language-storage", // The key used in localStorage
    }
  )
);

// 2. Run a one-time sync effect after the store is created.
// This code executes once when your app loads.
const langFromURL = getLanguageFromURL();

// If a language is found in the URL...
if (langFromURL) {
  // ...and it's different from the language currently in the store...
  if (langFromURL !== useLanguageStore.getState().language) {
    // ...update the store. This will automatically be persisted to localStorage.
    useLanguageStore.setState({ language: langFromURL });
  }
}
