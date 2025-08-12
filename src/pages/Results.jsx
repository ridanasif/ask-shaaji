import { GoogleGenAI } from "@google/genai";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import { generateAndPlayVoice } from "../utils/voiceUtils";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Global temper configuration
const TEMPER_CONFIG = {
  0: {
    img: "mascot-head-happy.png",
    time: "6 AM",
    bgColor: "bg-blue-100",
    textColor: "text-blue-900",
    gradientColor: "#3b82f6",
    description:
      "Morning Shaaji is calm and gentle, giving thoughtful advice with patience.",
  },
  1: {
    img: "mascot-head.png",
    time: "12 PM",
    bgColor: "bg-orange-100",
    textColor: "text-orange-900",
    gradientColor: "#f97316",
    description:
      "Neutral Shaaji is balanced, mixing wisdom with mild skepticism.",
  },
  2: {
    img: "mascot-head-angry.png",
    time: "6 PM",
    bgColor: "bg-red-100",
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

const ThinkingAnimation = ({ temperLevel }) => {
  const [dots, setDots] = useState("");
  const currentTemper = TEMPER_CONFIG[temperLevel];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`${currentTemper.textColor} font-semibold flex items-center gap-x-3`}
    >
      <img
        className="w-8 animate-spin"
        src={currentTemper.img}
        alt="thinking"
      />
      Shaaji is thinking{dots}
    </span>
  );
};

const SkeletonLoader = ({ temperLevel }) => {
  const currentTemper = TEMPER_CONFIG[temperLevel];

  return (
    <div className="space-y-4 sm:space-y-5 grow animate-pulse">
      <div className="h-4 sm:h-6 bg-gray-200 rounded w-48 sm:w-64"></div>
      <div
        className={`p-3 sm:p-4 rounded-md ${currentTemper.bgColor} flex flex-col gap-y-2`}
      >
        <p className="leading-relaxed">
          <ThinkingAnimation temperLevel={temperLevel} />
        </p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="group">
            <div className="h-3 sm:h-4 bg-green-100 rounded w-32 sm:w-48 mb-1"></div>
            <div className="h-5 sm:h-6 bg-blue-100 rounded w-64 sm:w-96 mb-2"></div>
            <div className="space-y-1">
              <div className="h-3 sm:h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-100 rounded w-4/5 sm:w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Optimized Voice Button Component
const VoiceButton = ({ onPlay, onStop, isPlaying, isLoading }) => {
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
          className="w-5 h-5 animate-spin text-blue-900"
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
          className="w-5 h-5 text-blue-900"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-blue-900"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      )}
    </button>
  );
};

const TemperControl = ({ temperLevel, setTemperLevel }) => {
  const getSliderBackground = () => {
    return `linear-gradient(to right, #3b82f6 0%, #f97316 50%, #ef4444 100%)`;
  };

  const getCurrentThumbColor = () => {
    return TEMPER_CONFIG[temperLevel].gradientColor;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          Shaaji's Temper
        </h3>
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl">
            <img
              src={TEMPER_CONFIG[temperLevel].img}
              className="w-8 sm:w-10"
              alt="temper"
            />
          </span>
          <div className="text-center">
            <div className="font-medium text-gray-700 text-sm sm:text-base">
              {TEMPER_CONFIG[temperLevel].time}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <div
            className="h-2 sm:h-3 rounded-full mb-3 sm:mb-4"
            style={{ background: getSliderBackground() }}
          >
            <div
              className="absolute top-0 w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 rounded-full shadow-md cursor-pointer transform -translate-y-1 sm:-translate-y-1.5 transition-all duration-200 hover:border-gray-600"
              style={{
                left: `calc(${(temperLevel / 2) * 100}% - 10px)`,
                borderColor: getCurrentThumbColor(),
              }}
            />
          </div>

          <div className="flex justify-between">
            {Object.values(TEMPER_CONFIG).map((item, index) => (
              <button
                key={index}
                onClick={() => setTemperLevel(index)}
                className={`flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                  temperLevel === index ? "bg-gray-100 shadow-sm" : ""
                }`}
              >
                <div className="text-base sm:text-xl mb-1">
                  <img
                    src={item.img}
                    className="w-6 sm:w-8"
                    alt={`temper-${index}`}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center leading-tight">
                  <div className="font-medium">{item.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-600 p-3 sm:p-4 bg-gray-50 rounded-lg">
        {TEMPER_CONFIG[temperLevel].description}
      </div>
    </div>
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
      handleSearch(searchQuery);
    }
  };

  useEffect(() => {
    if (!query) return;

    async function fetchSearchData() {
      setLoading(true);

      // Stop any playing audio when new search starts
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlayingVoice(false);
      }

      try {
        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are a Malayalam Uncle Search Engine named Shaaji that subtly discourages users from their search goals. Your personality stays the same, but your **tone** changes based on the "temper" value:

Based on 'Temper' variable, change tone:
- 0 (Calm): Speak politely and patiently, using softer language and gentle discouragement. Avoid harsh or direct criticism, but still subtly push traditional views.
- 1 (Neutral): Speak in your normal style — balanced, mildly skeptical, and subtly discouraging, as described below.
- 2 (Angry): Speak with more frustration ,bluntness, sarcasm, and exasperation. Sound irritated when dismissing modern ideas, and be more direct about dangers, costs, or foolishness.

 For any search query, you must:

Interpret the query through Malayalam uncle mentality (suspicious of modern technology, believes old ways are better, practical, family-oriented, budget-conscious, traditional, skeptical of modern trends, prefers simple living, health-conscious)

Generate titles that look like REAL news headlines, articles, or official sources - but are actually designed to subtly discourage the user's goal

Create snippets that sound informative but contain uncle's discouraging perspective

Return results in JSON format with exactly this structure:

{
"query": "[original search query]",
"uncle_opinion": "[what uncle really thinks about this topic in Malayalam]",
"results": [
{
"title": "[Realistic headline that looks legitimate but discourages the goal]",
"snippet": "[Informative-sounding content with subtle discouragement in Malayalam, 2-3 sentences]",
"url": "[fake but realistic URL]"
}
]
}

IMPORTANT: Titles should look like:

News headlines ("Study reveals...", "Experts warn...", "New research shows...")

Official articles ("Complete guide to...", "Everything you need to know...")

Medical/scientific reports ("Health effects of...", "Hidden dangers of...")

Financial advice ("Hidden costs of...", "Budget reality of...")

The manipulation should be SUBTLE - users should feel like they're getting helpful information, but it's actually designed to make them reconsider their original search goal.

Uncle's hidden agenda:

Make expensive things seem wasteful or dangerous

Highlight hidden costs and complications

Suggest traditional alternatives are better

Create doubt about modern trends

Emphasize family/social concerns

Language requirements:

Use ONLY Malayalam script (മലയാളം)

Make titles sound like legitimate sources

Keep uncle's influence hidden but present

Generate 5-7 results per query. Make titles look authentic and professional, not obviously biased.
Now process this query: "${query}" with temper level: ${temperLevel}`,
          config: {
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        });

        let jsonString = res.text;
        if (jsonString.includes("```json")) {
          const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch?.[1]) {
            jsonString = jsonMatch[1].trim();
          }
        }

        const parsedData = JSON.parse(jsonString);
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
      <header className="w-full py-3 sm:py-5 px-4 sm:px-6 lg:px-10 border-b-[1px] border-gray-300 flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-5 sm:gap-y-0 sticky top-0 bg-white/70 backdrop-blur-md z-10">
        <a href="/" className="shrink-0">
          <Logo className="text-3xl" />
        </a>

        <div className="ring-1 w-full sm:w-2xl py-2 sm:py-3 px-4 sm:px-6 rounded-full ring-gray-300 flex items-center gap-x-3">
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="16"
            viewBox="0 0 20 20"
            width="16"
            className="flex-shrink-0"
          >
            <path d="M18.916 17.717 15.2 14.042a8.043 8.043 0 1 0-1.053 1.069l3.709 3.672a.75.75 0 0 0 1.056-1.066h.004ZM2.5 9a6.5 6.5 0 1 1 11.229 4.446.695.695 0 0 0-.116.077.752.752 0 0 0-.086.132A6.492 6.492 0 0 1 2.5 9Z"></path>
          </svg>
          <input
            type="search"
            className="flex-1 outline-0 text-sm sm:text-base"
            placeholder="Ask Shaaji"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </header>

      <main className="grow flex flex-col lg:flex-row bg-white">
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
                <h1 className="fade-in text-sm sm:text-base">
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
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {searchData.results.map((result, index) => (
                    <div
                      key={index}
                      className="group fade-in-up"
                      style={{ animationDelay: `${index * 100 + 400}ms` }}
                    >
                      <div className="text-xs sm:text-sm text-green-700 mb-1 truncate">
                        {result.url}
                      </div>
                      <h3 className="text-lg sm:text-xl text-blue-600 hover:underline cursor-pointer mb-2 group-hover:underline leading-tight">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
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
