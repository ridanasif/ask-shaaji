import { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

export default function Home() {
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
      <div className="flex flex-col justify-center items-center grow gap-y-5">
        <div className="flex items-center gap-x-4">
          <Logo className="text-8xl" />
          <img src="mascot.png" className="w-17" alt="Shaaji mascot" />
        </div>
        <div className="ring-1 w-2xl py-3 px-6 rounded-full shadow-md ring-gray-300 flex items-center gap-x-3">
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

        <div className="flex gap-x-2">
          <Button
            text="Shaaji Search"
            onClick={() => handleSearch(searchQuery)}
          />
          <Button
            text="I'm feeling lucky"
            onClick={() => handleSearch("random topic")}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
