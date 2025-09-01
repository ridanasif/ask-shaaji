import { GoogleGenAI } from "@google/genai";
import { useState, useEffect, useRef } from "react";
import {
  generateShaajiPrompt,
  parseGeminiResponse,
} from "../utils/promptUtils";
import { getTemperLevel } from "../utils/temperUtils";
import { useClientSide, TEMPER_STORAGE_KEY } from "../constants/app";
import { useAlert } from "../context/AlertContext";
import { useLanguageStore } from "../store/languageStore";

let ai;
if (useClientSide) {
  ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
}

export function useShaajiSearch(query) {
  const { language } = useLanguageStore();
  const { showAlert } = useAlert();
  const [searchData, setSearchData] = useState({
    query: "",
    uncle_opinion: "",
    results: [],
  });
  const [loading, setLoading] = useState(false);
  const [temperLevel, setTemperLevel] = useState(getTemperLevel());
  const pendingTemperLevel = useRef(getTemperLevel());

  // Listen for localStorage changes (in case user changes settings in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === TEMPER_STORAGE_KEY) {
        pendingTemperLevel.current = getTemperLevel();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!query || !query.trim()) return;

    async function fetchSearchData() {
      setLoading(true);

      const temperForThisSearch = pendingTemperLevel.current;
      setTemperLevel(temperForThisSearch);

      try {
        let parsedData;

        if (useClientSide) {
          const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: generateShaajiPrompt(
              query,
              temperForThisSearch,
              language
            ),
            config: {
              thinkingConfig: {
                thinkingBudget: 0,
              },
            },
          });

          parsedData = parseGeminiResponse(res.text);
        } else {
          // Production with server-side API
          const response = await fetch("/api/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: query,
              temperLevel: temperForThisSearch,
              language: language,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch search data");
          }

          parsedData = await response.json();
        }

        setSearchData(parsedData);
      } catch (err) {
        console.error("Search error:", err);
        showAlert("Oops, the search failed. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchSearchData();
  }, [query]);
  return { searchData, loading, temperLevel };
}
