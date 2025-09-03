import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";
import { allKeralaDistricts } from "../constants/app";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key are required. Check your .env file.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

const PAGE_SIZE = 25;

const formatCurrency = (amount) => {
  return `₹ ${amount.toLocaleString("en-IN")}`;
};

// --- COMPONENT ---
const Supporters = () => {
  const [donors, setDonors] = useState([]);

  const [page, setPage] = useState(0); // Start at page 0
  const [loading, setLoading] = useState(true); // Set to true initially
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loaderRef = useRef(null);
  const isFetching = useRef(false);

  useEffect(() => {
    const originalClassName = document.body.className;
    document.body.className = "bg-white";
    return () => {
      document.body.className = originalClassName;
    };
  }, []);

  // --- THE SINGLE, UNIFIED FETCH FUNCTION ---
  const fetchDonors = useCallback(async (pageToFetch) => {
    if (isFetching.current) return; // Prevent race conditions
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const from = pageToFetch * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const keralaFilter = allKeralaDistricts
        .map((district) => `location.ilike.%${district}%`)
        .join(",");

      const { data, error: fetchError } = await supabase
        .from("donors")
        .select("id, name, location, amount")
        .or(keralaFilter)
        .order("amount", { ascending: false })
        .range(from, to);

      if (fetchError) {
        throw fetchError;
      }

      // THIS IS THE KEY: If data is empty or less than PAGE_SIZE, we've reached the end.
      if (!data || data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      // If it's the first page, replace the donors array. Otherwise, append.
      setDonors((prevDonors) => {
        return pageToFetch === 0 ? data : [...prevDonors, ...data];
      });
    } catch (e) {
      console.error("Error fetching donors:", e);
      setError("Failed to load donors. Please try again.");
      setHasMore(false); // Stop trying on error
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []); // Empty dependency array means this function is stable

  // --- EFFECT FOR INITIAL LOAD ---
  // This now uses the main fetchDonors function.
  useEffect(() => {
    fetchDonors(0);
  }, [fetchDonors]);

  // --- EFFECT FOR INFINITE SCROLL ---
  useEffect(() => {
    // We only want to set up the observer if there's more data to fetch
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        // The guards prevent fetching when loading, or if there's no more data.
        if (firstEntry.isIntersecting && !isFetching.current) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "200px" }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore]); // Re-run when hasMore or loading changes

  // --- EFFECT TO FETCH NEXT PAGE WHEN `page` STATE CHANGES ---
  // This separates the "when to fetch" from the "how to fetch".
  useEffect(() => {
    // We don't want to fetch page 0 again, as it's handled by the initial load effect.
    if (page > 0) {
      fetchDonors(page);
    }
  }, [page, fetchDonors]);

  // --- JSX / RENDER ---
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="bg-white w-full py-3 flex items-center justify-center border-b-[1px] border-b-gray-300 sticky top-0 z-10">
        <Link to="/">
          <Logo
            useEditions={true}
            enableDarkMode={false}
            className="text-5xl"
          />
        </Link>
      </header>
      <main className="max-md:w-screen mx-auto p-4 md:p-8 grow">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center md:flex-row">
            <img src="royal-scroll.png" className="max-h-32 md:max-h-36" />
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl chilanka font-bold text-amber-900">
                ദാതാക്കളുടെ സമ്പൂർണ്ണ പട്ടിക
              </h1>
              <p className="chilanka text-gray-600 mt-2">
                എൻ്റെ ഖജനാവിലേക്ക് സംഭാവന നൽകിയ എല്ലാ പ്രജകൾക്കും നന്ദി!
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br ring-1 ring-amber-200 from-amber-100 to-amber-200 rounded-xl overflow-hidden">
          <ul className="divide-y divide-amber-200">
            {donors.map((donor, index) => (
              <li
                key={donor.id}
                className="p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="text-amber-950 font-bold w-10 text-center mr-4">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-amber-800">
                      {donor.name.length > 40
                        ? donor.name.substring(0, 37) + "..."
                        : donor.name}
                    </p>
                    <p className="text-sm text-amber-600">{donor.location}</p>
                  </div>
                </div>
                <div className="font-bold text-amber-800 text-lg">
                  {formatCurrency(donor.amount)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div ref={loaderRef} className="py-8 text-center">
          {loading && (
            <p className="chilanka text-gray-600 animate-pulse">
              Loading more donors...
            </p>
          )}
          {error && (
            <p className="chilanka text-amber-800 font-semibold">{error}</p>
          )}
          {!hasMore && donors.length > 0 && !error && (
            <p className="chilanka text-green-800">
              നിങ്ങൾ എല്ലാവരെയും കണ്ടു കഴിഞ്ഞു!
            </p>
          )}
          {donors.length === 0 && !loading && !error && (
            <p className="chilanka text-red-800">
              ഇവിടെ ഇതുവരെ ആരും എത്തിയിട്ടില്ല.
            </p>
          )}
        </div>
      </main>
      <footer className="w-full text-center py-4 bg-gray-100 font-medium">
        &copy; AskShaaji {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Supporters;
