import { GoogleGenAI } from "@google/genai";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Global temper configuration
const TEMPER_CONFIG = {
  0: {
    level: 0,
    label: "Shaaji at 6 AM",
    img: "mascot-head-happy.jpg",
    time: "6 AM",
    bgColor: "bg-blue-100",
    textColor: "text-blue-900",
    gradientColor: "#3b82f6",
    description:
      "Morning Shaaji is calm and gentle, giving thoughtful advice with patience.",
  },
  1: {
    level: 1,
    label: "Neutral Shaaji",
    img: "mascot-head.jpg",
    time: "12 PM",
    bgColor: "bg-orange-100",
    textColor: "text-orange-900",
    gradientColor: "#f97316",
    description:
      "Neutral Shaaji is balanced, mixing wisdom with mild skepticism.",
  },
  2: {
    level: 2,
    label: "Shaaji at 6 PM",
    img: "mascot-head-angry.jpg", // You might need to create this image
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
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`${currentTemper.textColor} font-semibold flex items-center gap-x-3`}
    >
      <img className="w-8 animate-spin" src={currentTemper.img} />
      Shaaji is thinking{dots}
    </span>
  );
};

const SkeletonLoader = ({ temperLevel }) => {
  const currentTemper = TEMPER_CONFIG[temperLevel];

  return (
    <div className="space-y-5 grow animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-64"></div>

      {/* Uncle's opinion skeleton */}
      <div
        className={`p-4 rounded-md ${currentTemper.bgColor} flex flex-col gap-y-2`}
      >
        <p className="leading-relaxed">
          <ThinkingAnimation temperLevel={temperLevel} />
        </p>
      </div>

      {/* Results skeleton */}
      <div className="space-y-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="group">
            <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mb-2"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TemperControl = ({ temperLevel, setTemperLevel }) => {
  const getSliderBackground = () => {
    const percentage = (temperLevel / 2) * 100;
    // Blue to Orange to Red gradient
    return `linear-gradient(to right, #3b82f6 0%, #f97316 50%, #ef4444 100%)`;
  };

  const getCurrentThumbColor = () => {
    return TEMPER_CONFIG[temperLevel].gradientColor;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Shaaji's Temper
        </h3>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">
            <img src={TEMPER_CONFIG[temperLevel].img} className="w-10" />
          </span>
          <div className="text-center">
            <div className="font-medium text-gray-700">
              {TEMPER_CONFIG[temperLevel].time}
            </div>
            <div className="text-sm text-gray-500">
              {TEMPER_CONFIG[temperLevel].label}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider */}
      <div className="mb-6">
        <div className="relative">
          {/* Slider Track */}
          <div
            className="h-3 rounded-full mb-4"
            style={{ background: getSliderBackground() }}
          >
            {/* Slider Thumb */}
            <div
              className="absolute top-0 w-6 h-6 bg-white border-2 rounded-full shadow-md cursor-pointer transform -translate-y-1.5 transition-all duration-200 hover:border-gray-600"
              style={{
                left: `calc(${(temperLevel / 2) * 100}% - 12px)`,
                borderColor: getCurrentThumbColor(),
              }}
            />
          </div>

          {/* Clickable areas for levels */}
          <div className="flex justify-between">
            {Object.values(TEMPER_CONFIG).map((item, index) => (
              <button
                key={index}
                onClick={() => setTemperLevel(index)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                  temperLevel === index ? "bg-gray-100 shadow-sm" : ""
                }`}
              >
                <div className="text-xl mb-1">
                  <img src={item.img} className="w-8" />
                </div>
                <div className="text-xs text-gray-600 text-center leading-tight">
                  <div className="font-medium">{item.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Temper Description */}
      <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
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
  const [temperLevel, setTemperLevel] = useState(0); // 0 = 6AM, 1 = Neutral, 2 = 6PM
  const [searchData, setSearchData] = useState({
    query: "",
    uncle_opinion: "",
    results: [],
  });
  const [loading, setLoading] = useState(false);

  // Get current temper configuration
  const currentTemper = TEMPER_CONFIG[temperLevel];

  // Typing animation for uncle's opinion
  const { displayedText: typedOpinion, isTyping } = useTypingEffect(
    searchData.uncle_opinion,
    20 // Speed in milliseconds (lower = faster)
  );

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  function handleSearch(query) {
    if (!query.trim()) return;
    query = query.trim();
    navigate(`/search?query=${encodeURIComponent(query)}`);
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
      try {
        // Replace this with your actual API URL
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
        // console.log(res.text);

        let jsonString = res.text;
        // Check if the response is wrapped in markdown code blocks
        if (jsonString.includes("```json")) {
          // Extract JSON from markdown code blocks
          const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1].trim();
          }
        }

        // Parse the JSON response from Gemini
        const parsedData = JSON.parse(jsonString);

        setSearchData(parsedData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchData();
  }, [query, temperLevel]); // Add temperLevel as dependency

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="w-full py-5 px-10 border-b-[1px] border-gray-300 flex items-center gap-x-5 sticky top-0 bg-white/70 backdrop-blur-md z-10">
          <a href="/">
            <Logo className="text-3xl" />
          </a>

          <div className="ring-1 w-2xl py-3 px-6 rounded-full ring-gray-300 flex items-center gap-x-3">
            <svg
              rpl=""
              aria-hidden="true"
              fill="currentColor"
              height="16"
              icon-name="search-outline"
              viewBox="0 0 20 20"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.916 17.717 15.2 14.042a8.043 8.043 0 1 0-1.053 1.069l3.709 3.672a.75.75 0 0 0 1.056-1.066h.004ZM2.5 9a6.5 6.5 0 1 1 11.229 4.446.695.695 0 0 0-.116.077.752.752 0 0 0-.086.132A6.492 6.492 0 0 1 2.5 9Z"></path>
            </svg>
            <input
              type="search"
              className="flex-1 outline-0"
              placeholder="Ask Shaaji"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </header>

        <main className="grow flex bg-white">
          {/* Main Content Area */}
          <div className="flex-1 px-10 py-5">
            <div className="max-w-4xl space-y-5">
              {loading ? (
                <SkeletonLoader temperLevel={temperLevel} />
              ) : (
                <>
                  <h1 className="fade-in">
                    Showing {searchData.results.length} results for{" "}
                    <b>{query}</b>
                  </h1>
                  <div
                    className={`p-4 rounded-md ${currentTemper.bgColor} flex flex-col gap-y-2 fade-in-up`}
                  >
                    <span
                      className={`font-semibold ${currentTemper.textColor} flex gap-x-3 items-center`}
                    >
                      <img className="w-8" src={currentTemper.img} />
                      Shaaji's opinion
                    </span>
                    <p className={`leading-relaxed ${currentTemper.textColor}`}>
                      {typedOpinion}
                      {isTyping && (
                        <span className={currentTemper.textColor}>|</span>
                      )}
                    </p>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-6">
                    {searchData.results.map((result, index) => (
                      <div
                        key={index}
                        className="group fade-in-up"
                        style={{
                          animationDelay: `${index * 100 + 400}ms`,
                        }}
                      >
                        {/* URL */}
                        <div className="text-sm text-green-700 mb-1">
                          {result.url}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl text-blue-600 hover:underline cursor-pointer mb-2 group-hover:underline">
                          {result.title}
                        </h3>

                        {/* Snippet */}
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

          {/* Temper Control Sidebar */}
          <div className="w-100 py-6 px-10">
            <TemperControl
              temperLevel={temperLevel}
              setTemperLevel={setTemperLevel}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
