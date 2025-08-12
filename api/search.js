import { GoogleGenAI } from "@google/genai";
import {
  generateShaajiPrompt,
  parseGeminiResponse,
} from "../src/utils/promptUtils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, temperLevel } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
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

    const parsedData = parseGeminiResponse(res_ai.text);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
