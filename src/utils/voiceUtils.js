import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// This function creates the 44-byte WAV header.
// It's needed because the API sends raw audio data.
function createWavHeader(dataLength, options) {
  const { numChannels = 1, sampleRate = 24000, bitsPerSample = 16 } = options;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint8(0, 82);
  view.setUint8(1, 73);
  view.setUint8(2, 70);
  view.setUint8(3, 70); // "RIFF"
  // File size
  view.setUint32(4, 36 + dataLength, true);
  // WAVE identifier
  view.setUint8(8, 87);
  view.setUint8(9, 65);
  view.setUint8(10, 86);
  view.setUint8(11, 69); // "WAVE"
  // FMT chunk identifier
  view.setUint8(12, 102);
  view.setUint8(13, 109);
  view.setUint8(14, 116);
  view.setUint8(15, 32); // "fmt "
  // FMT chunk length
  view.setUint32(16, 16, true);
  // Audio format (1 for PCM)
  view.setUint16(20, 1, true);
  // Number of channels
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate
  view.setUint32(28, byteRate, true);
  // Block align
  view.setUint16(32, blockAlign, true);
  // Bits per sample
  view.setUint16(34, bitsPerSample, true);
  // DATA chunk identifier
  view.setUint8(36, 100);
  view.setUint8(37, 97);
  view.setUint8(38, 116);
  view.setUint8(39, 97); // "data"
  // DATA chunk size
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

// This is our main function that will be exported and used by the hook.
export async function generateAndPlayVoice(text, temperLevel = 0) {
  try {
    // 1. Call the Gemini API to get the raw audio data.
    const config = {
      temperature: 1,
      responseModalities: ["audio"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Orus" } },
      },
    };
    switch (temperLevel) {
      case 1:
        text = `Say neutrally: ${text}`;
        break;
      case 2:
        text = `Say angrily and in an unpleasant tone: ${text}`;
        break;
      default:
        text = `Say happily: ${text}`;
        break;
    }
    const model = "gemini-2.5-flash-preview-tts";
    const contents = [{ role: "user", parts: [{ text }] }];

    // Use the non-streaming version for simplicity, as TTS audio is usually small.
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
    const inlineData =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (inlineData && inlineData.data) {
      // 2. Decode the base64 raw PCM data into a binary buffer.
      const pcmData = Uint8Array.from(atob(inlineData.data), (c) =>
        c.charCodeAt(0)
      );

      // 3. Create the WAV header for this PCM data.
      // The API returns 24000Hz, 16-bit audio.
      const header = createWavHeader(pcmData.length, { sampleRate: 24000 });

      // 4. Combine the header and the PCM data to create a full WAV file in memory.
      const wavData = new Uint8Array(header.length + pcmData.length);
      wavData.set(header, 0);
      wavData.set(pcmData, header.length);

      // 5. Create a Blob and an <audio> element from our in-memory WAV file
      const blob = new Blob([wavData], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      // 6. Play the audio and return the element so we can control it (pause, etc.)
      await audio.play();
      return { audio, audioUrl };
    } else {
      throw new Error("No audio data received from API");
    }
  } catch (error) {
    console.error("Error in generateAndPlayVoice:", error);
    return null;
  }
}
