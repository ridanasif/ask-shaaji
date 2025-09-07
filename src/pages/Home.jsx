import { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Settings } from "lucide-react";
import { useLanguageStore } from "../store/languageStore";
import { getUncleName } from "../constants/app";
import { languages } from "../store/languageStore";

export default function Home() {
  const { language, setLanguage } = useLanguageStore();
  let queries;
  if (language === "ml") {
    queries = [
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
    ];
  } else if (language === "ta") {
    queries = [
      "How to make perfect filter coffee like my grandma?",
      "Best way to wake up for a 6 AM Kolam session?",
      "How to ask Appa for money for a new Royal Enfield?",
      "Can I eat parotta with salna for dinner every day?",
      "How to concentrate on TNPSC exams with IPL season starting?",
      "What to do if my parents find my Instagram account?",
      "Is engineering in Anna University the only path to success?",
      "How to convince parents for a Pondicherry trip with friends?",
      "Should I buy an iPhone on EMI or a secondhand Android phone?",
      "Best Dindigul biryani spot in Chennai?",
      "Government job in Madurai or IT job on OMR, Chennai?",
      "Is wearing a veshti to the temple compulsory?",
      "How to talk to a girl in my college cultural program?",
      "My cousin uses a MacBook for 'college notes'. Is it necessary?",
      "How to stop scrolling through Reels and actually study?",
      "Best excuse to skip a distant relative's ear-piercing ceremony?",
      "Is it better to live in a village or in a crowded city like Chennai?",
      "What's the secret to getting a girl with a good family background?",
      "My mom says I'm wasting my life watching 'new-gen' Tamil movies.",
      "Why is this generation always complaining about Chennai heat?",
      "How to properly watch a 'First Day First Show' of a Rajini movie?",
      "Best way to learn 'Madras baashai' (Chennai slang)?",
      "Should I invest in stocks or a government LIC policy?",
      "How to handle relatives asking 'When are you getting married?'",
      "Is it okay to wear ripped jeans to a temple festival?",
    ];
  } else if (language === "hi") {
    queries = [
      "How to make perfect kadak chai for my father?",
      "How to wake up early for a morning walk in the park?",
      "Best way to ask parents for money for a new Bullet bike?",
      "Is it okay to eat pizza for dinner?",
      "How to focus on IAS exams when my friends are partying?",
      "What to say when my parents find my dating app profile?",
      "Is an engineering degree the only way to get respect in society?",
      "How to convince parents for a Manali trip with friends?",
      "Should I buy an iPhone or is a cheaper phone more sensible?",
      "How to save money as a student in Delhi?",
      "Government job or a private startup job?",
      "How to look smart in a kurta?",
      "Best biryani spot in Lucknow?",
      "Is it okay to wear shorts in my hometown in UP?",
      "How to talk to a girl in my coaching class?",
      "My friend has a gaming PC for 'online classes'. Is it a good idea?",
      "How to stop using my phone so much and be more productive?",
      "Best excuse to avoid cleaning my room?",
      "Is it better to live in a metro city or go back to my hometown?",
      "What is the secret to getting a good arranged marriage proposal?",
      "How to deal with a nosy 'padosi' (neighbour) aunty?",
      "My mom says I'm lazy. Is it true?",
      "Why is today's generation always talking about 'mental health'?",
      "What is the best comeback when compared to 'Sharmaji ka beta'?",
      "Should I invest in property or the stock market?",
    ];
  } else if (language === "mr") {
    queries = [
      "How to make a perfect cup of chaha (tea)?",
      "How to wake up early without an alarm?",
      "Best way to ask for more pocket money without getting a lecture?",
      "Is it okay to eat Vada Pav for dinner?",
      "How to focus on MPSC exams?",
      "What to do when my parents see my bad semester results?",
      "Is an engineering degree from Pune University the only good option?",
      "How to convince parents for a Goa trip with friends?",
      "What's a good first bike to buy for Pune traffic?",
      "Should I buy an iPhone or a cheaper Android phone?",
      "How to save money as a student in Pune?",
      "Stable bank job or IT job in Hinjewadi?",
      "How to look respectable in college?",
      "Best Misal Pav spot near me?",
      "Is it okay to wear shorts in my hometown?",
      "How to talk to a girl I like?",
      "My friend has a gaming laptop for 'studies'. Is it a good idea?",
      "How to stop using my phone so much?",
      "Best excuse to avoid a family gathering?",
      "How to eat Puran Poli without making a mess?",
      "Is it better to live in Mumbai or in Pune?",
      "What is the secret to buying a flat in a good society?",
      "How to handle relatives asking 'What are your future plans?'",
      "My Aai (mom) says I'm lazy. Is it true?",
      "Why is today's generation so undisciplined?",
    ];
  } else if (language === "ar") {
    queries = [
      "How to make perfect Arabic coffee (qahwa)?",
      "How to wake up for Fajr prayer without hitting snooze?",
      "Best way to ask my father for a new car?",
      "Is it okay to eat fast food every day?",
      "How to focus on my studies with all the distractions?",
      "What to do if my parents see my social media posts?",
      "Is a government job the only way to have a stable future?",
      "How to convince my family to let me travel to Europe with friends?",
      "Should I buy the new iPhone or save money for marriage?",
      "How to save money while living in a city like Dubai?",
      "A stable government job or a risky online business?",
      "How to dress respectfully but still be fashionable?",
      "Best Mandi restaurant near me?",
      "Is it okay to wear shorts at the mall?",
      "How to find a spouse with a good family and reputation?",
      "My friend has a gaming console for 'relaxing'. Is it a waste of time?",
      "How to stop spending so much time in shisha cafes?",
      "Best excuse to avoid a boring family gathering (majlis)?",
      "Is it better to work in my home country or abroad?",
      "What is the secret to starting a successful business?",
      "How to deal with relatives asking about my marriage plans?",
      "My mother says I am soft and lazy. Is it true?",
      "Why is today's generation always wasting money (israf)?",
      "Should I invest in real estate or crypto?",
      "How to show respect to elders properly?",
    ];
  } else if (language === "kn") {
    queries = [
      "How to make perfect filter coffee?",
      "How to wake up early to avoid Bangalore traffic?",
      "Best way to ask for money for a new bike?",
      "Is it okay to eat instant noodles for dinner?",
      "How to focus on studying for government exams?",
      "What to say when my parents find out I failed a subject?",
      "Is an IT job in Bangalore the only good career option?",
      "How to convince parents for a trip to Gokarna with friends?",
      "Should I buy an iPhone or save for a BDA site down-payment?",
      "How to save money as a student in Bangalore?",
      "Government job or a risky startup job?",
      "How to look cool in college without looking like a 'show-off'?",
      "Best Masale Dose spot in Basavanagudi?",
      "Is it okay to wear shorts in my hometown in Karnataka?",
      "How to talk to a girl I like?",
      "My friend has a gaming laptop for 'online classes'. Should I get one?",
      "How to stop using my phone so much?",
      "Best excuse to avoid a distant relative's function?",
      "Is it better to live in Bangalore or go abroad?",
      "What is the secret to becoming rich?",
      "How to eat Ragi Mudde properly?",
      "Why is this generation always so tired?",
      "How to handle relatives asking about my future plans?",
      "My mom says I'm lazy. Is it true?",
      "Is it necessary to speak Kannada in Bangalore?",
    ];
  } else if (language === "te") {
    queries = [
      "How to make perfect Telugu-style coffee?",
      "How to wake up early in the morning?",
      "Best way to ask for more pocket money?",
      "Is it okay to eat biryani for dinner every night?",
      "How to focus on EAMCET exams?",
      "What to say when my parents see my bad report card?",
      "Is a software job in Hyderabad the only respectable career?",
      "How to convince parents for a trip with friends?",
      "What's a good first bike to buy?",
      "Should I buy an iPhone or invest in a plot of land?",
      "How to save money as a student in Hyderabad?",
      "Job in USA or family business in hometown?",
      "How to look like a Tollywood hero in college?",
      "Best Hyderabadi biryani spot near me?",
      "Is it okay to wear shorts in my hometown in Andhra?",
      "How to talk to a girl without being awkward?",
      "My friend has a new gaming PC. Is it a waste of money?",
      "How to stop using my phone so much?",
      "Best excuse to avoid a family wedding?",
      "How to eat properly at a Telugu wedding feast?",
      "Is it better to live in a big city or our native place?",
      "What is the secret to becoming a 'crorepati'?",
      "How to handle relatives asking 'When are you getting married?'",
      "My parents say I have no respect for elders. Is it true?",
      "Why is today's generation always so dramatic?",
    ];
  } else if (language === "bn") {
    queries = [
      "How to make a perfect cup of cha (tea)?",
      "How to wake up early for a morning walk?",
      "Best way to ask for more pocket money for books?",
      "Is it okay to eat egg rolls for dinner?",
      "How to focus on studying with a football match on TV?",
      "What to say when my parents see my bad exam results?",
      "Is a stable, respectable job the only good career option?",
      "How to convince parents for a Darjeeling trip with friends?",
      "Should I buy an iPhone or a cheaper Android phone?",
      "How to save money as a student in Kolkata?",
      "A job in the government or a creative field?",
      "How to look intellectual and serious in college?",
      "Best biryani spot in Kolkata?",
      "Is it okay to wear shorts in my hometown (para)?",
      "How to start a conversation (adda) with someone I like?",
      "My friend has an expensive laptop for 'projects'. Is it just for show-off?",
      "How to stop arguing about politics on social media?",
      "Best excuse to avoid a long family 'adda' (chat session)?",
      "Is it better to live abroad or in Kolkata?",
      "What is the secret to becoming a culturally respected person?",
      "How to handle relatives asking 'What are your future plans?'",
      "My parents say I don't read enough. Is it true?",
      "Why is today's generation not interested in high culture?",
      "Mohun Bagan or East Bengal?",
      "How to appreciate Rabindra Sangeet properly?",
    ];
  }

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
    <>
      {/*<span className="text-xs text-center py-3 text-red-500 dark:text-red-400">
        Due to high traffic, our daily request limit has been reached. The
        service will be reset shortly. Please try again then!
      </span>*/}
      <header className="w-full py-3 flex justify-end px-5 gap-x-4 md:gap-x-6 dark:text-neutral-400">
        <div className="flex gap-x-4 md:gap-x-6">
          {language === "ml" && (
            <Link
              to="/comics"
              className="cursor-pointer bangers dark:hover:text-neutral-100"
            >
              Life of shaaji
            </Link>
          )}
          <Link
            to="/scan"
            className="cursor-pointer cal-sans dark:hover:text-neutral-100"
          >
            {getUncleName()} Scan
          </Link>
        </div>
        <div>
          <Link
            to="/settings"
            className="cursor-pointer dark:hover:text-neutral-100"
          >
            <Settings />
          </Link>
        </div>
      </header>

      <div className="flex flex-col justify-center items-center grow gap-y-3 sm:gap-y-5 py-8 sm:py-0 px-4 sm:px-6 lg:px-8">
        {/* Logo and mascot section - always horizontal */}
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <Logo className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl" />
          <img
            src={`/mascot/${language}.png`}
            className="w-14 sm:w-16 md:w-18"
            alt={`${getUncleName()} mascot`}
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
            placeholder={`Ask ${getUncleName()}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* Buttons - always side by side */}
        <div className="flex gap-x-2">
          <Button
            text={`${getUncleName()} Search`}
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
          <span className="dark:text-neutral-100 text-xs flex flex-wrap gap-3 items-center">
            {getUncleName()} offered in:{" "}
            {languages.map((l, index) => (
              <span
                key={index}
                onClick={() => setLanguage(l.code)}
                className={`text-sm text-blue-500 cursor-pointer hover:underline ${
                  language === l.code && "underline"
                }`}
              >
                {l.language}
              </span>
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
