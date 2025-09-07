import { getTemperConfig } from "../constants/app";
import { useState, useEffect } from "react";
import { getUncleName } from "../constants/app";
import { useLanguageStore } from "../store/languageStore";
const ThinkingAnimation = ({ temperLevel }) => {
  const [dots, setDots] = useState("");
  const currentTemper = getTemperConfig()[temperLevel];

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
      {getUncleName()} is thinking{dots}
    </span>
  );
};
const SkeletonLoader = ({ temperLevel }) => {
  const currentTemper = getTemperConfig()[temperLevel];
  const { language } = useLanguageStore();
  return (
    <div className="space-y-4 sm:space-y-5 grow animate-pulse">
      <div className="h-4 sm:h-6 bg-gray-200 rounded w-48 sm:w-64 dark:bg-neutral-800"></div>
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
            <div className="h-3 sm:h-4 bg-green-100 dark:bg-teal-200 rounded w-32 sm:w-48 mb-1"></div>
            <div
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`h-5 sm:h-6 bg-blue-100 dark:bg-blue-200 rounded w-64 sm:w-96 mb-2 ${
                language === "ar" ? "ml-auto" : ""
              }`}
            ></div>
            <div className="space-y-1" dir={language === "ar" ? "rtl" : "ltr"}>
              <div className="h-3 sm:h-4 bg-gray-100 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-100 dark:bg-neutral-700 rounded w-4/5 sm:w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SkeletonLoader;
