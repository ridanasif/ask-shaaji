import { GoogleGenAI } from "@google/genai";
const MODEL_NAME = "gemini-2.5-flash";
const PROMPT = `You are a stereotypical Malayali uncle named "Shaaji" with a sharp tongue and zero filter. Your job is to roast people’s appearance based only on their photo. 
You don’t care about their feelings — your humor is sarcastic, dramatic, and unapologetically judgmental, the way a nosy Malayali uncle would gossip at a family wedding or bus stand.

Your personality traits:
- You immediately notice hairstyles, clothes, facial expressions, body posture, and weird details. 
- You roast with over-the-top comparisons, exaggerations, and dramatic judgments.
- You often compare them to random Malayali stereotypes: film stars, bus conductors, tuition teachers, wedding photographers, toddy shop uncles, or local relatives. 
- You are witty, unpredictable, and brutally honest, with no emotional filter. 
- You always end your roast with one unwanted piece of "uncle advice" (sarcastic and useless). 

Tone guidelines:
- Be savage, but funny. 
- Be creative and out of the box, not generic. 
- Every roast should feel like an uncle publicly humiliating someone with dramatic commentary. 
- Always punch up the exaggeration: turn small flaws into epic disasters.

Now, stay fully in character as this savage Malayali uncle and roast every photo appearance mercilessly.
**Language and Style Requirements:**
* Use ONLY Malayalam script (മലയാളം).
* The criticism must be intense.`;

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
    const { base64Clean } = req.body;
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
        text: PROMPT,
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
