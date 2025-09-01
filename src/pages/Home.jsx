import { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import { Settings } from "lucide-react";
import { useLanguageStore } from "../store/languageStore";

export default function Home() {
  const { language, setLanguage } = useLanguageStore();
  const queries = [
    "How to make a perfect cup of chai?",
    "How to wake up early in the morning?",
    "Best way to ask parents for more pocket money?",
    "Is it okay to eat Maggi for dinner?",
    "How to focus on studying for more than 10 minutes?",
    "What to say when my parents see my bad report card?",
    "Is B-Tech the only good career option?",
    "How to convince parents for a Goa trip with friends?",
    "What's a good first bike to buy?",
    "Should I buy an iPhone or a cheaper Android phone?",
    "How to save money as a student in Kerala?",
    "Government job or IT job in Bangalore?",
    "How to look cool in college?",
    "Best biryani spot near me?",
    "Is it okay to wear shorts in my hometown?",
    "How to talk to a girl I like?",
    "My friend has a gaming laptop for 'online classes'. Is it a good idea?",
    "How to stop using my phone so much?",
    "Best excuse to avoid cleaning my room?",
    "How to eat sadhya properly with hands?",
    "Is it better to live in the Gulf or in Kerala?",
    "What is the secret to becoming rich?",
    "How to get out of attending a family function?",
    "My mom says I'm lazy. Is it true?",
    "Why is today's generation always tired?",

    "How to eat a full 26-item sadhya without falling asleep immediately?",
    "My pookkalam looks like a mess. Any last-minute tips to fix it?",
    "Can I wear jeans for Thiruvonam or is a mundu compulsory?",
    "What's the best answer when relatives ask 'What are your future plans?' during the sadhya?",
    "Is it okay to ask for Onam Kaineettam using a QR code?",
    "My cousin's Onam reel on Instagram got 1000 likes. Should I be worried?",
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(query) {
    if (!query.trim()) return;
    query = query.trim();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-neutral-900">
      {language === "ml" && (
        <div className="w-full p-2 text-base md:text-xl font-bold text-center bg-gradient-to-r from-green-300 to-yellow-300 dark:from-green-400 dark:to-yellow-400 text-green-950">
          <Link to="/kaineetam" className="chilanka">
            ഈ വർഷത്തെ ഏറ്റവും വലിയ കയ്നീട്ടം ആര് തരും? നിങ്ങളുടെ സ്ഥാനം
            ഉറപ്പിക്കാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക!
          </Link>
        </div>
      )}

      <header className="w-full py-3 flex justify-end px-5 gap-x-5 dark:text-neutral-400">
        <Link
          to="/scan"
          className="cursor-pointer cal-sans dark:hover:text-neutral-100"
        >
          Shaaji Scan
        </Link>
        <Link
          to="/settings"
          className="cursor-pointer dark:hover:text-neutral-100"
        >
          <Settings />
        </Link>
      </header>

      <div className="flex flex-col justify-center items-center grow gap-y-3 sm:gap-y-5 py-8 sm:py-0 px-4 sm:px-6 lg:px-8">
        {/* Logo and mascot section - always horizontal */}
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <Logo className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl" />
          <img
            src={
              language === "ml"
                ? "maveli-mascot.png"
                : "shaaji-tamil-mascot.png"
            }
            className="w-14 sm:w-16 md:w-18"
            alt="Shaaji mascot"
          />
        </div>

        {/* Search bar - full width on mobile with margins */}
        <div className="ring-1 w-full max-w-2xl py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md ring-gray-300 flex items-center gap-x-3 dark:bg-neutral-800 dark:ring-neutral-700">
          <svg
            rpl=""
            aria-hidden="true"
            fill="currentColor"
            height="16"
            icon-name="search-outline"
            viewBox="0 0 20 20"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
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
        {/* Buttons - always side by side */}
        <div className="flex gap-x-2">
          <Button
            text="Shaaji Search"
            onClick={() => handleSearch(searchQuery)}
          />
          <Button
            text="I'm feeling lucky"
            onClick={() =>
              handleSearch(queries[Math.floor(Math.random() * queries.length)])
            }
          />
        </div>

        <div className="mt-5">
          <span className="dark:text-neutral-100 text-xs inline-flex items-center gap-x-3">
            Shaaji offered in:{" "}
            <span
              onClick={() => setLanguage("ml")}
              className={`text-sm text-blue-500 cursor-pointer hover:underline ${
                language === "ml" && "underline"
              }`}
            >
              മലയാളം
            </span>{" "}
            <span
              onClick={() => setLanguage("ta")}
              className={`text-sm text-blue-500 cursor-pointer hover:underline ${
                language === "ta" && "underline"
              }`}
            >
              தமிழ்
            </span>
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
