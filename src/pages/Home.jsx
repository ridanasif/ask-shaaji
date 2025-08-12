import { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

export default function Home() {

  const isDev = import.meta.env.DEV;
  const hasClientKey = import.meta.env.VITE_GEMINI_API_KEY;
  const useClientSide = isDev && hasClientKey;

  console.log("is developing: " + isDev);

  const queries = [
    "How to convince parents to let me go on a trip with friends?",
    "Malayalam love quotes for Instagram bio",
    "Tomorrow collector declare holiday for rain?",
    "How to talk to a girl in Kerala without being creepy?",
    "Is it illegal to have a part-time job in Kerala as a student?",
    "Easy ways to sneak out of the house",
    "how to hide phone from parents while studying",
    "How to make money without working?",
    "How to make tea?",
    "How to pass exams without studying",
    "How to cover whole syllabus within 1 day?",
    "how to convince parents to buy a gaming laptop for 'online classes' ",
    "what to say when you get a low grade in exams",
    "best ways to copy in exam without getting caught",
    "how to pass a test you didn't study for",
    "how to hide phone from parents while studying",
    "ways to talk on the phone after 10 pm without getting caught",
    "best excuses for being late to school in Malayalam",
    "how to get out of a family function",
    "how to block my dad on Facebook without him knowing",
    "best VPN for phone in Kerala",
    "best mandi spot near me",
    "How to get a girlfriend?",
    "How much would an iphone cost on emi?",
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
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col justify-center items-center grow gap-y-3 sm:gap-y-5 py-8 sm:py-0 px-4 sm:px-6 lg:px-8">
        {/* Logo and mascot section - always horizontal */}
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <Logo className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl" />
          <img
            src="mascot.png"
            className="w-14 sm:w-16 md:w-17"
            alt="Shaaji mascot"
          />
        </div>

        {/* Search bar - full width on mobile with margins */}
        <div className="ring-1 w-full max-w-2xl py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md ring-gray-300 flex items-center gap-x-3">
          <svg
            rpl=""
            aria-hidden="true"
            fill="currentColor"
            height="16"
            icon-name="search-outline"
            viewBox="0 0 20 20"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
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
      </div>
      <Footer />
    </div>
  );
}
