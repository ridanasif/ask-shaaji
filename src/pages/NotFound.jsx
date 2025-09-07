import { Link } from "react-router-dom";
import { getMascotHead } from "../constants/app";
import { useLanguageStore } from "../store/languageStore";
const NotFound = () => {
  const { language } = useLanguageStore();
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center flex-col bg-gray-100 dark:bg-neutral-900 p-5">
        <img src={getMascotHead(language)} className="w-28" />
        <h1 className="text-3xl font-bold text-gray-700 dark:text-neutral-400">
          404.
        </h1>
        <h1 className="text-sm md:text-base lg:text-lg font-black text-gray-700 dark:text-neutral-400 text-center">
          മോനേ, നീയിവിടെ നോക്കിയത് കിട്ടില്ല! കമ്പ്യൂട്ടറിലിങ്ങനെ
          കുത്തിയിരുന്നാൽ പലതും മിസ്സാകും. വല്ല പണിക്കും പോയി ജീവിക്ക്, പോ!
          <br />
          <Link
            className="text-sm font-medium text-blue-400 cursor-pointer"
            to="/"
          >
            Return to main page
          </Link>
        </h1>
      </div>
    </>
  );
};
export default NotFound;
