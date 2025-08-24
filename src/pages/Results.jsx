import { GoogleGenAI } from "@google/genai";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import ShareButton from "../ui/ShareButton";
import SkeletonLoader from "../ui/SkeletonLoader";
import TemperControl from "../ui/TemperControl";
import { generateAndPlayVoice } from "../utils/voiceUtils";
import {
  generateShaajiPrompt,
  parseGeminiResponse,
} from "../utils/promptUtils";

const isDev = import.meta.env.DEV;
const hasClientKey = import.meta.env.VITE_GEMINI_API_KEY;
const useClientSide = isDev && hasClientKey;

let ai;
if (useClientSide) {
  ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
}

// Global temper configuration
export const TEMPER_CONFIG = {
  0: {
    img: "mascot-head-happy.png",
    time: "6 AM",
    bgColor: "bg-blue-100 dark:bg-blue-200",
    textColor: "text-blue-900",
    gradientColor: "#3b82f6",
    description:
      "Morning Shaaji is calm and gentle, giving thoughtful advice with patience.",
  },
  1: {
    img: "mascot-head.png",
    time: "12 PM",
    bgColor: "bg-orange-100 dark:bg-orange-200",
    textColor: "text-orange-900",
    gradientColor: "#f97316",
    description:
      "Neutral Shaaji is balanced, mixing wisdom with mild skepticism.",
  },
  2: {
    img: "mascot-head-angry.png",
    time: "6 PM",
    bgColor: "bg-red-100 dark:bg-red-200",
    textColor: "text-red-900",
    gradientColor: "#ef4444",
    description:
      "Evening Shaaji is irritated and blunt, showing his true Malayalam uncle frustration.",
  },
};

// Custom hook for typing animation
const useTypingEffect = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      return;
    }

    setIsTyping(true);
    setDisplayedText("");

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isTyping };
};


// Optimized Voice Button Component
const VoiceButton = ({ onPlay, onStop, isPlaying, isLoading, temperLevel }) => {
  const currentTemper = TEMPER_CONFIG[temperLevel];
  const handleClick = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
        isLoading
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:shadow-md"
      } hover:bg-white hover:bg-opacity-30`}
      title={
        isLoading
          ? "Loading..."
          : isPlaying
          ? "Stop audio"
          : "Play Shaaji's opinion"
      }
    >
      {isLoading ? (
        <svg
          className={`w-5 h-5 animate-spin ${currentTemper.textColor}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isPlaying ? (
        <svg
          className={`w-5 h-5 ${currentTemper.textColor}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        <svg
          className={`w-5 h-5 ${currentTemper.textColor}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      )}
    </button>
  );
};

export default function Results() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [temperLevel, setTemperLevel] = useState(0);
  const [searchData, setSearchData] = useState({
    query: "",
    uncle_opinion: "",
    results: [],
  });
  const [loading, setLoading] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const currentTemper = TEMPER_CONFIG[temperLevel];
  const { displayedText: typedOpinion, isTyping } = useTypingEffect(
    searchData.uncle_opinion,
    20
  );

  // Optimized voice play handler
  const handlePlayVoice = async () => {
    if (!searchData.uncle_opinion || isVoiceLoading) return;

    setIsVoiceLoading(true);
    try {
      // Start audio generation immediately without additional checks
      const audioInstance = await generateAndPlayVoice(
        searchData.uncle_opinion,
        temperLevel
      );

      if (audioInstance?.addEventListener) {
        setCurrentAudio(audioInstance);
        setIsPlayingVoice(true);

        const handleAudioEnd = () => {
          setIsPlayingVoice(false);
          setCurrentAudio(null);
        };

        const handleAudioError = () => {
          setIsPlayingVoice(false);
          setCurrentAudio(null);
        };

        audioInstance.addEventListener("ended", handleAudioEnd, { once: true });
        audioInstance.addEventListener("error", handleAudioError, {
          once: true,
        });
      }
    } catch (error) {
      console.error("Audio error:", error);
      setIsPlayingVoice(false);
      setCurrentAudio(null);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleStopVoice = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlayingVoice(false);
      setCurrentAudio(null);
    }
  };

  // Cleanup audio on unmount or query change
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlayingVoice(false);
      }
    };
  }, [query]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  function handleSearch(query) {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      handleSearch(searchQuery);
    }
  };

  useEffect(() => {
    if (!query.trim()) return;

    async function fetchSearchData() {
      setLoading(true);

      // Stop any playing audio when new search starts
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlayingVoice(false);
      }

      try {
        let parsedData;

        if (useClientSide) {
          // Local development with client-side API
          console.log("Using client-side API for development");

          const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: generateShaajiPrompt(query, temperLevel),
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
              temperLevel: temperLevel,
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
      } finally {
        setLoading(false);
      }
    }

    fetchSearchData();
  }, [query, temperLevel]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-3 sm:py-5 px-4 sm:px-6 lg:px-10 border-b-[1px] border-gray-300 flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-5 sm:gap-y-0 sticky top-0 bg-white/70 backdrop-blur-md z-10 dark:bg-neutral-900 dark:border-neutral-700">
        <a href="/" className="shrink-0">
          <Logo className="text-3xl" />
        </a>

        <div className="ring-1 w-full sm:w-2xl py-2 sm:py-3 px-4 sm:px-6 rounded-full ring-gray-300 flex items-center gap-x-3 dark:bg-neutral-800 dark:ring-neutral-700">
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="16"
            viewBox="0 0 20 20"
            width="16"
            className="flex-shrink-0 dark:text-neutral-100"
          >
            <path d="M18.916 17.717 15.2 14.042a8.043 8.043 0 1 0-1.053 1.069l3.709 3.672a.75.75 0 0 0 1.056-1.066h.004ZM2.5 9a6.5 6.5 0 1 1 11.229 4.446.695.695 0 0 0-.116.077.752.752 0 0 0-.086.132A6.492 6.492 0 0 1 2.5 9Z"></path>
          </svg>
          <input
            type="search"
            className="flex-1 outline-0 text-sm sm:text-base dark:placeholder-neutral-100 dark:text-neutral-100"
            placeholder="Ask Shaaji"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </header>

      <main className="grow flex flex-col lg:flex-row bg-white dark:bg-neutral-900">
        <div className="w-full lg:w-80 xl:w-96 order-1 lg:order-2 lg:py-6 px-4 sm:px-6 lg:px-10 pt-4 pb-4 lg:pb-0">
          <TemperControl
            temperLevel={temperLevel}
            setTemperLevel={setTemperLevel}
          />
        </div>

        <div className="flex-1 order-2 lg:order-1 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <div className="w-full lg:max-w-4xl space-y-4 sm:space-y-5">
            {loading ? (
              <SkeletonLoader temperLevel={temperLevel} />
            ) : (
              <>
                <h1 className="fade-in text-sm sm:text-base dark:text-neutral-100">
                  Showing {searchData.results.length} results for <b>{query}</b>
                </h1>
                <div
                  className={`p-3 sm:p-4 rounded-md ${currentTemper.bgColor} flex flex-col gap-y-2 fade-in-up`}
                >
                  <div className="flex justify-between items-start sm:items-center">
                    <span
                      className={`font-semibold ${currentTemper.textColor} flex gap-x-2 sm:gap-x-3 items-center text-sm sm:text-base`}
                    >
                      <img
                        className="w-6 sm:w-8 flex-shrink-0"
                        src={currentTemper.img}
                        alt="shaaji"
                      />
                      <span className="leading-tight">Shaaji's opinion</span>
                    </span>
                    {searchData.uncle_opinion && !isTyping && (
                      <div className="flex-shrink-0 ml-2">
                        <VoiceButton
                          onPlay={handlePlayVoice}
                          onStop={handleStopVoice}
                          isPlaying={isPlayingVoice}
                          isLoading={isVoiceLoading}
                          temperLevel={temperLevel}
                        />
                      </div>
                    )}
                  </div>
                  <p
                    className={`leading-relaxed ${currentTemper.textColor} text-sm sm:text-base`}
                  >
                    {typedOpinion}
                    {isTyping && (
                      <span className={currentTemper.textColor}>|</span>
                    )}
                  </p>

                  {/* Share Button - positioned in bottom right */}
                  {searchData.uncle_opinion && !isTyping && (
                    <div className="flex justify-end">
                      <ShareButton
                        query={query}
                        opinion={searchData.uncle_opinion}
                        temperLevel={temperLevel}
                        isVisible={true}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {searchData.results.map((result, index) => (
                    <div
                      key={index}
                      className="group fade-in-up"
                      style={{ animationDelay: `${index * 100 + 400}ms` }}
                    >
                      <div className="text-xs sm:text-sm dark:text-teal-500 text-green-700 mb-1 truncate">
                        {result.url}
                      </div>
                      <h3 className="text-lg sm:text-xl dark:text-blue-400 text-blue-600 hover:underline cursor-pointer mb-2 group-hover:underline leading-tight">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                        {result.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
