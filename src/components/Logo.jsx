import { getUncleName } from "../constants/app";
import { useLanguageStore } from "../store/languageStore";

export default function Logo({
  className = "",
  useEditions = true,
  enableDarkMode = true,
}) {
  // Define the color sequence in an array
  const colors = [
    "text-blue-500",
    "text-red-500",
    "text-yellow-500",
    "text-blue-500",
    "text-green-500",
    "text-red-500",
  ];

  const h1Class = "logo " + className;
  const { language } = useLanguageStore();
  const name = getUncleName();

  return (
    <div className="flex flex-col items-center">
      <h1 className={h1Class}>
        {/* Split the name into letters and map over them */}
        {name.split("").map((letter, index) => (
          <span
            key={index}
            // Use the color from the array. The modulo operator ensures it cycles.
            className={`${colors[index % colors.length]} ${
              enableDarkMode && "dark:text-white"
            }`}
          >
            {letter}
          </span>
        ))}
      </h1>
      {/*useEditions && language === "ml" && <></>*/}
    </div>
  );
}
