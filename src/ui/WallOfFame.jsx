import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const DonationProgressBar = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const goalAmount = 10000; // Our goal for the next feature

  useEffect(() => {
    // Fetch the initial total
    const fetchTotal = async () => {
      // NOTE: For very large tables, creating a database function (RPC)
      // to sum the amounts would be more efficient.
      const { data, error } = await supabase.from("donors").select("amount");
      if (error) {
        console.error("Error fetching total donations:", error);
      } else {
        const sum = data.reduce((acc, donor) => acc + donor.amount, 0);
        setTotalAmount(sum);
      }
    };

    fetchTotal();

    // Listen for new donations in real-time
    const channel = supabase
      .channel("total-donations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "donors" },
        (payload) => {
          // Add the new amount to the current total
          setTotalAmount((currentTotal) => currentTotal + payload.new.amount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const progressPercentage = Math.min((totalAmount / goalAmount) * 100, 100);

  return (
    <div className="w-full bg-white dark:bg-neutral-800 p-2 border-b border-gray-200 dark:border-neutral-700">
      <div className="max-w-4xl mx-auto flex gap-x-4">
        <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-center flex text-xs gap-x-1 font-semibold text-gray-600 dark:text-neutral-300">
          <span>₹{totalAmount.toLocaleString("en-IN")}</span> /{" "}
          <span>₹{goalAmount.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

// --- New Component for the Donor List ---
const WallOfFame = () => {
  //   // 1. Use state to hold the donors list, starting with an empty array.
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    // 2. Fetch initial data
    const fetchDonors = async () => {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
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
          setDonors((currentDonors) =>
            [payload.new, ...currentDonors].slice(0, 5)
          );
        }
      )
      .subscribe();

    // 4. Cleanup function to unsubscribe when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // The empty dependency array ensures this runs only once on mount
  // Replace this with real data from your backend/API

  return (
    <div className="w-full bg-gray-50 dark:bg-neutral-800 py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
      <div className="max-w-full mx-auto flex items-center justify-center gap-x-4 sm:gap-x-6">
        <div className="flex items-center gap-x-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
            Live Supporters
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (Latest 5)
          </span>
        </div>
        <div className="flex items-center gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-gray-600 dark:text-neutral-300 overflow-x-auto whitespace-nowrap">
          {donors.slice(0, 5).map((donor, index) => (
            <div key={donor.id} className="flex items-center gap-x-2">
              <span
                className={`font-bold w-4 text-center ${
                  index === 0
                    ? "text-yellow-500"
                    : "text-gray-400 dark:text-neutral-500"
                }`}
              >
                {index + 1}
              </span>
              <div className="flex items-baseline gap-x-2">
                <span className="font-semibold">{donor.name}</span>
                <span className="text-xs text-gray-400 dark:text-neutral-500">
                  ({donor.location})
                </span>
                <span className="font-bold text-green-600 dark:text-green-500">
                  ₹{donor.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WallOfFame;
