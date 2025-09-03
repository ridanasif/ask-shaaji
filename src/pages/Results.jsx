import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import ShareButton from "../ui/ShareButton";
import SkeletonLoader from "../ui/SkeletonLoader";
import { getTemperConfig } from "../constants/app";
import { useShaajiSearch } from "../hooks/useShaajiSearch";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { useVoicePlayback } from "../hooks/useVoicePlayback";
import VoiceButton from "../ui/VoiceButton";
import { useLanguageStore } from "../store/languageStore";

export default function Results() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Search Related
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const { searchData, loading, temperLevel } = useShaajiSearch(query);
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

  // Voice Logic
  const {
    play,
    stop,
    isPlaying,
    isLoading: isVoiceLoading,
  } = useVoicePlayback({
    opinion: searchData.uncle_opinion,
    temperLevel: temperLevel,
    isSearchLoading: loading,
  });

  const currentTemper = getTemperConfig()[temperLevel];
  const { displayedText: typedOpinion, isTyping } = useTypingEffect(
    searchData.uncle_opinion,
    20
  );

  return (
    <>
      <header className="w-full py-3 sm:py-5 px-4 sm:px-6 lg:px-10 border-b-[1px] border-gray-300 flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-5 sm:gap-y-0 sticky top-0 bg-white/70 backdrop-blur-md z-10 dark:bg-neutral-900 dark:border-neutral-700">
        <Link to="/" className="shrink-0">
          <Logo className="text-3xl" />
        </Link>

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
      <section className="grow flex flex-col bg-white dark:bg-neutral-900">
        <div className="flex-1 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <div className="w-full lg:max-w-4xl space-y-4 sm:space-y-5">
            <span className="block mb-3 dark:text-neutral-500 text-sm">
              Adjust Shaaji's personality from{" "}
              <Link to={"/settings"}>
                <b>Settings</b>
              </Link>
              .
            </span>
            {loading ? (
              <SkeletonLoader temperLevel={temperLevel} />
            ) : (
              <>
                <h1 className="fade-in text-sm sm:text-base dark:text-neutral-100">
                  Showing <b>{searchData.results.length}</b> results
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
                      <span className="leading-tight">Shaaji's Opinion</span>
                    </span>

                    {searchData.uncle_opinion && !isTyping && (
                      <div className="flex gap-x-2 flex-shrink-0">
                        <ShareButton
                          query={query}
                          opinion={searchData.uncle_opinion}
                          temperLevel={temperLevel}
                          isVisible={true}
                        />
                        <VoiceButton
                          onPlay={play}
                          onStop={stop}
                          isPlaying={isPlaying}
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
      </section>
    </>
  );
}
