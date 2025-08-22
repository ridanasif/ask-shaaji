import { GoogleGenAI } from "@google/genai";
import {
  generateShaajiPrompt,
  parseGeminiResponse,
} from "../src/utils/promptUtils.js";

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter((key) => key);

// Function to check if error is rate limit related
function isRateLimitError(error) {
  const errorMessage = error.message?.toLowerCase() || "";
  const errorCode = error.code || error.status;
  const errorStatus = error.error?.status?.toLowerCase() || "";

  return (
    errorCode === 429 ||
    errorStatus === "resource_exhausted" ||
    errorMessage.includes("rate limit") ||
    errorMessage.includes("quota exceeded") ||
    errorMessage.includes("too many requests")
  );
}

async function attemptWithFallback(query, temperLevel) {
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });

      const res_ai = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: generateShaajiPrompt(query, temperLevel),
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });

      return parseGeminiResponse(res_ai.text);
    } catch (error) {
      if (!isRateLimitError(error)) {
        throw new Error("Service temporarily unavailable");
      }

      if (i === API_KEYS.length - 1) {
        throw new Error("Service temporarily unavailable due to high demand");
      }
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, temperLevel } = req.body;

  if (!query.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (API_KEYS.length === 0) {
    return res.status(500).json({ error: "Service configuration error" });
  }

  try {
    const parsedData = await attemptWithFallback(query, temperLevel);
    res.status(200).json(parsedData);
  } catch (error) {
    if (isRateLimitError(error)) {
      res.status(429).json({
        error:
          "Service temporarily unavailable due to high demand. Please try again later.",
      });
    } else {
      res.status(500).json({ error: "Service temporarily unavailable" });
    }
  }
}
