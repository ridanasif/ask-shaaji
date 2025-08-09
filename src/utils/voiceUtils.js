import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Convert base64 audio to playable blob
function convertToWav(rawData, mimeType) {
  const options = parseMimeType(mimeType);
  const wavHeader = createWavHeader(rawData.length, options);
  const buffer = Uint8Array.from(atob(rawData), (c) => c.charCodeAt(0));

  // Combine header and audio data
  const combinedArray = new Uint8Array(wavHeader.length + buffer.length);
  combinedArray.set(wavHeader, 0);
  combinedArray.set(buffer, wavHeader.length);

  return combinedArray;
}

function parseMimeType(mimeType) {
  const [fileType, ...params] = mimeType.split(";").map((s) => s.trim());
  const [_, format] = fileType.split("/");

  const options = {
    numChannels: 1,
    sampleRate: 24000, // Default sample rate
    bitsPerSample: 16, // Default bits per sample
  };

  if (format && format.startsWith("L")) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }

  for (const param of params) {
    const [key, value] = param.split("=").map((s) => s.trim());
    if (key === "rate") {
      options.sampleRate = parseInt(value, 10);
    }
  }

  return options;
}

function createWavHeader(dataLength, options) {
  const { numChannels, sampleRate, bitsPerSample } = options;

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // WAV header
  const encoder = new TextEncoder();
  const riff = encoder.encode("RIFF");
  const wave = encoder.encode("WAVE");
  const fmt = encoder.encode("fmt ");
  const data = encoder.encode("data");

  view.setUint8(0, riff[0]);
  view.setUint8(1, riff[1]);
  view.setUint8(2, riff[2]);
  view.setUint8(3, riff[3]);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint8(8, wave[0]);
  view.setUint8(9, wave[1]);
  view.setUint8(10, wave[2]);
  view.setUint8(11, wave[3]);
  view.setUint8(12, fmt[0]);
  view.setUint8(13, fmt[1]);
  view.setUint8(14, fmt[2]);
  view.setUint8(15, fmt[3]);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint8(36, data[0]);
  view.setUint8(37, data[1]);
  view.setUint8(38, data[2]);
  view.setUint8(39, data[3]);
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

// Function to preload voice (generate audio but don't play)
export async function preloadVoice(text, temperLevel = 0) {
  try {
    // Map temper level to voice characteristics
    const voiceConfig = {
      0: "Orus", // Calm voice
      1: "Orus", // Neutral voice
      2: "Orus", // Angry voice
    };

    const config = {
      temperature: 1,
      responseModalities: ["audio"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voiceConfig[temperLevel] || "Orus",
          },
        },
      },
    };

    const model = "gemini-2.5-flash-preview-tts";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: text,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Collect all audio chunks
    const audioChunks = [];
    for await (const chunk of response) {
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        if (inlineData.mimeType?.includes("audio")) {
          audioChunks.push({
            data: inlineData.data,
            mimeType: inlineData.mimeType,
          });
        }
      }
    }

    // Process and return audio object (but don't play yet)
    if (audioChunks.length > 0) {
      const audioData = audioChunks[0];
      const audioBuffer = convertToWav(audioData.data, audioData.mimeType);

      // Create blob and audio object
      const blob = new Blob([audioBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      // Set up cleanup
      const cleanup = () => URL.revokeObjectURL(audioUrl);
      audio.addEventListener("ended", cleanup, { once: true });
      audio.addEventListener("error", cleanup, { once: true });

      // Preload the audio
      audio.load();

      // Return the audio object ready to play
      return audio;
    } else {
      throw new Error("No audio data received");
    }
  } catch (error) {
    console.error("Error preloading voice:", error);
    return null;
  }
}

// Function to play preloaded voice
export async function playPreloadedVoice(audioInstance) {
  if (!audioInstance) return null;

  try {
    await audioInstance.play();
    return audioInstance;
  } catch (error) {
    console.error("Error playing preloaded voice:", error);
    return null;
  }
}

// Original function for backward compatibility
export async function generateAndPlayVoice(text, temperLevel = 0) {
  const audio = await preloadVoice(text, temperLevel);
  if (!audio) return null;

  try {
    await audio.play();
    return audio;
  } catch (error) {
    console.error("Error playing voice:", error);
    return null;
  }
}
