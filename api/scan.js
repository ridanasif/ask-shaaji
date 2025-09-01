import { GoogleGenAI } from "@google/genai";
import { getShaajiScanPrompt } from "../src/utils/promptUtils.js";
const MODEL_NAME = "gemini-2.5-flash";

const API_KEYS = [
  process.env.SHAAJI_SCAN_KEY,
  process.env.SHAAJI_SCAN_KEY_2,
  process.env.SHAAJI_SCAN_KEY_3,
  process.env.SHAAJI_SCAN_KEY_4,
  process.env.SHAAJI_SCAN_KEY_5,
].filter((key) => key);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { base64Clean, language } = req.body;
    if (!base64Clean) {
      res.status(400).json({ error: "Missing image data" });
    }
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Clean,
        },
      },
      {
        text: getShaajiScanPrompt(language || "ml"),
      },
    ];
    for (const key of API_KEYS) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });

        const result = await ai.models.generateContentStream({
          model: MODEL_NAME,
          contents,
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.writeHead(200);

        for await (const chunk of result) {
          res.write(chunk.text);
        }
        res.end();
        return;
      } catch (err) {}
    }
    res
      .status(503)
      .json({ error: "Service Unavailable. Please try again later." });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate caption" });
  }
}
