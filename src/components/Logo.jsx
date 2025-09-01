import { useLanguageStore } from "../store/languageStore";
export default function Logo({
  className = "",
  useEditions = true,
  enableDarkMode = true,
}) {
  var h1Class = "logo " + className;
  const { language } = useLanguageStore();
  return (
    <div className="flex flex-col items-center">
      <h1 className={h1Class}>
        <span
          className={`text-blue-500 ${enableDarkMode && "dark:text-white"}`}
        >
          S
        </span>
        <span className={`text-red-500 ${enableDarkMode && "dark:text-white"}`}>
          h
        </span>
        <span
          className={`text-yellow-500 ${enableDarkMode && "dark:text-white"}`}
        >
          a
        </span>
        <span
          className={`text-blue-500 ${enableDarkMode && "dark:text-white"}`}
        >
          a
        </span>
        <span
          className={`text-green-500 ${enableDarkMode && "dark:text-white"}`}
        >
          j
        </span>
        <span className={`text-red-500 ${enableDarkMode && "dark:text-white"}`}>
          i
        </span>
      </h1>
      {useEditions && language === "ml" && (
        <span className="text-yellow-500 text-sm">ONAM EDITION</span>
      )}
    </div>
  );
}
