import Logo from "../components/Logo";
import DonationModal from "../ui/DonationModal";
import { useMemo, useEffect, useCallback, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import VallamkaliRace from "../ui/VallamkaliRace";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
const MaveliDepartureCountdown = () => {
  const calculateTimeLeft = () => {
    const countdownDate = new Date("2025-09-08T00:00:00").getTime();
    const now = new Date().getTime();
    const difference = countdownDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (Object.keys(newTimeLeft).length > 0) {
        setTimeLeft(newTimeLeft);
      } else {
        setIsTimeUp(true);
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return;
    }

    let intervalText = "";
    switch (interval) {
      case "days":
        intervalText = "ദിവസം";
        break;
      case "hours":
        intervalText = "മണിക്കൂർ";
        break;
      case "minutes":
        intervalText = "മിനിറ്റ്";
        break;
      case "seconds":
        intervalText = "സെക്കൻഡ്";
        break;
      default:
        break;
    }

    timerComponents.push(
      <div
        key={interval}
        className="flex flex-col items-center justify-center text-black rounded-full p-4"
      >
        <span className="text-3xl md:text-4xl font-bold">
          {String(timeLeft[interval]).padStart(2, "0")}
        </span>
        <span className="text-sm chilanka mt-1">{intervalText}</span>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 min-h-[400px] md:min-h-[500px]">
      {/* Content Section */}
      <div className="flex flex-col justify-center items-center space-y-4 md:space-y-6 px-2">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl chilanka font-bold text-red-900 leading-tight">
            മാവേലി മടങ്ങാൻ ഇനി...
          </h2>
          <span className="chilanka text-gray-600 text-sm md:text-base lg:text-lg block">
            പാതാളത്തിലേക്കുള്ള ടിക്കറ്റ് ബുക്ക് ചെയ്തു കഴിഞ്ഞു!
          </span>
        </div>

        {isTimeUp ? (
          <div className="text-center space-y-2 py-4 md:py-6">
            <p className="text-2xl md:text-3xl lg:text-4xl chilanka text-red-800 font-bold leading-tight">
              അടുത്ത കൊല്ലം കാണാം!
            </p>
            <p className="chilanka text-gray-600 text-sm md:text-base lg:text-lg">
              ടാറ്റാ... ബൈ ബൈ...!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 lg:gap-6 w-full max-w-md mx-auto">
            {timerComponents.length ? (
              timerComponents
            ) : (
              <span className="text-gray-500 animate-pulse">Loading...</span>
            )}
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="flex items-center justify-center p-4 order-first md:order-last">
        <img
          src="maveli-resting.png"
          alt="Maveli resting"
          className="w-full max-w-[200px] md:max-w-[300px] lg:max-w-[400px] h-auto object-contain"
        />
      </div>
    </div>
  );
};

const DonorTable = ({ className = "", donors }) => {
  // Gracefully handle the empty state before data loads or if there are no donors
  if (!donors || donors.length === 0) {
    return (
      <div className="text-center px-12 py-6 space-y-2 bg-amber-50 md:rounded-2xl">
        <p className="text-lg text-red-800 chilanka">
          ആരും ഇതുവരെ കൈനീട്ടം തന്നില്ല, ഖജനാവ് കാലിയാണ്!
        </p>
        <p className="text-xl font-bold text-red-900 chilanka">
          ആദ്യത്തെ ആളാകൂ!
        </p>
        <img
          src="QR.png"
          alt="GPay QR Code"
          className="w-48 h-48 mx-auto object-contain transition-transform duration-300 hover:scale-105"
        />
        <div className="text-base text-red-800 chilanka">
          <p className="chilanka text-justify">
            കൈനീട്ടം അയക്കുമ്പോൾ, GPay-യിലെ നോട്ട്സിൽ നിങ്ങളുടെ{" "}
            <strong className="font-semibold text-red-900">
              പേരും ജില്ലയും
            </strong>{" "}
            ചേർക്കാൻ മറക്കരുതേ. എങ്കിലല്ലേ എൻ്റെ പ്രജകളെ എനിക്ക് തിരിച്ചറിയാൻ
            പറ്റൂ? എൻ്റെ കണക്കപ്പിള്ള ഓരോ പേരും നോക്കി എഴുതിച്ചേർക്കുന്നതാണ്.
            അതുകൊണ്ട് പട്ടികയിൽ പേര് വരാൻ{" "}
            <strong className="font-semibold text-red-900">
              കുറച്ച് സമയമെടുക്കും
            </strong>
            , ക്ഷമിക്കണേ മക്കളേ!
          </p>
        </div>
      </div>
    );
  }

  // Create a sorted copy to avoid mutating the original prop array
  const sortedDonors = useMemo(() => {
    return [...donors].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [donors]);

  const topDonor = sortedDonors[0];
  const otherDonors = sortedDonors.slice(1);

  // Function to format currency in Indian Rupees style
  const formatCurrency = useCallback((amount) => {
    console.log("Formatting called...");

    return `₹ ${amount.toLocaleString("en-IN")}`;
  }, []);

  return (
    <div
      className={`overflow-x-auto md:rounded-lg border border-amber-400 ${className}`}
    >
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-amber-100">
          <tr className="text-left">
            <th className="py-3.5 px-4 font-semibold text-red-900 w-16 text-center">
              #
            </th>
            <th className="py-3.5 px-4 font-semibold text-red-900 chilanka">
              പേര് (Name)
            </th>
            <th className="py-3.5 px-4 font-semibold text-red-900 chilanka">
              ജില്ല (District)
            </th>
            <th className="py-3.5 px-4 font-semibold text-red-900 text-right chilanka">
              കൈനീട്ടം (Amount)
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {/* ★ TOP DONOR ROW ★ */}
          <tr className="bg-gradient-to-r from-yellow-100 to-amber-200 font-bold text-gray-800">
            <td className="py-4 px-4 whitespace-nowrap text-center">1</td>
            <td className="py-4 px-4 whitespace-nowrap">
              <div className="flex items-center">
                <span>{topDonor.name}</span>
              </div>
            </td>
            <td className="py-4 px-4 whitespace-nowrap">{topDonor.district}</td>
            <td className="py-4 px-4 whitespace-nowrap text-right font-extrabold text-red-900">
              {formatCurrency(topDonor.amount)}
            </td>
          </tr>

          {/* Render the rest of the donors dynamically */}
          {otherDonors.map((donor, index) => (
            <tr
              key={donor.id}
              className="even:bg-amber-50 hover:bg-amber-100 transition-colors duration-200"
            >
              <td className="py-4 px-4 whitespace-nowrap text-center text-gray-500">
                {index + 2}
              </td>
              <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                {donor.name}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                {donor.district}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-right font-semibold text-gray-800">
                {formatCurrency(donor.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {donors.length >= 5 && (
        <div className="text-center py-4 px-4">
          <Link
            to="/supporters"
            className="text-sm cursor-pointer text-amber-900 hover:text-amber-950 font-semibold transition-colors duration-200"
          >
            Show All
          </Link>
        </div>
      )}
    </div>
  );
};

const Kaineetam = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const originalClassName = document.body.className;
    document.body.className = "bg-white";
    return () => {
      document.body.className = originalClassName;
    };
  }, []);

  //   // 1. Use state to hold the donors list, starting with an empty array.
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    // 2. Fetch initial data
    const fetchDonors = async () => {
      const { data, error } = await supabase.from("donors").select("*");
      if (error) {
        console.error("Error fetching donors:", error);
      } else {
        setDonors(data);
      }
    };

    fetchDonors();

    // 3. Set up a real-time subscription
    const channel = supabase
      .channel("realtime donors")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "donors" },
        (payload) => {
          // When a new donor is inserted, add it to the existing state
          setDonors((currentDonors) => [...currentDonors, payload.new]);
        }
      )
      .subscribe();

    // 4. Cleanup function to unsubscribe when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // The empty dependency array ensures this runs only once on mount

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Animation variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full py-3 flex items-center justify-center border-b-[1px] border-b-gray-300"
        >
          <Link to="/">
            <Logo
              useEditions={true}
              enableDarkMode={false}
              className="text-5xl"
            />
          </Link>
        </motion.header>
        <div className="w-full md:w-3/4 md:m-auto space-y-12 grow">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroContainerVariants}
            className="w-full min-md:h-96 p-5 bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-200 flex flex-col gap-y-3 md:flex-row md:justify-between md:gap-x-3 md:rounded-bl-full"
          >
            <motion.img
              src="maveli-with-qr.png"
              className="max-md:max-h-48 max-md:self-center w-auto"
              variants={itemVariants}
            />
            <motion.div
              variants={textVariants}
              className="flex flex-col gap-y-3 md:justify-center"
            >
              <motion.h1
                variants={itemVariants}
                className="chilanka text-amber-800 text-2xl text-center md:text-left md:text-4xl lg:text-5xl"
              >
                എല്ലാവർഷവും വന്ന് നിങ്ങളുടെ കഷ്ടപ്പാട് കാണുന്ന എനിക്ക് വേണ്ടേ
                ഒരു കൈനീട്ടം?
              </motion.h1>
              <motion.div variants={itemVariants}>
                <button
                  onClick={openModal}
                  className="max-md:w-full chilanka cursor-pointer hover:bg-amber-900 bg-amber-800 text-white px-5 py-2 rounded-full font-bold text-center text-base md:text-lg"
                >
                  കൈനീട്ടം നൽകാം!
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="space-y-6 pb-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl chilanka font-bold">
                കൈനീട്ടം ലീഡർബോർഡ്
              </h2>
              <span className="chilanka text-gray-500 text-sm md:text-base">
                ഏത് ജില്ലക്കാരാണ് എൻ്റെ യഥാർത്ഥ മക്കൾ?
              </span>
            </div>

            <div className="relative">
              <VallamkaliRace donors={donors} />
            </div>
            <div className="flex items-center mx-5 justify-center text-center md:mx-0  md:justify-start md:text-left md:gap-x-3">
              <img src="maveli-head-happy.png" className="w-12 md:w-14" />
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl chilanka font-bold">
                  എൻ്റെ പ്രിയപ്പെട്ടവരുടെ പട്ടിക
                </h2>
                <span className="chilanka text-gray-500 text-sm md:text-base">
                  രാജാവിൻ്റെ ശ്രദ്ധ എങ്ങനെ പിടിച്ചുപറ്റണമെന്ന് ഇവർക്കറിയാം!
                </span>
              </div>
            </div>
            <DonorTable donors={donors} />

            <MaveliDepartureCountdown />
          </div>
        </div>

        <footer className="w-full text-center py-4 bottom-0 bg-gray-100 font-medium">
          &copy; AskShaaji {new Date().getFullYear()}
        </footer>
      </div>
      {/* Donation Modal */}
      <DonationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};
export default Kaineetam;
