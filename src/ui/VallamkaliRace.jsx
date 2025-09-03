import React, { useMemo, useCallback, useState, useEffect } from "react";
import { allKeralaDistricts } from "../constants/app";
// The boat's width in `rem` units, corresponding to the `w-16` class (4.5rem).
// This is essential for the horizontal positioning calculation.
const boatWidthRem = 4;

const BoatIcon = React.memo(() => {
  return (
    <div className="w-16 h-auto" aria-hidden="true">
      <img src="boat.png" alt="" className="w-full h-full object-contain" />
    </div>
  );
});


const VallamkaliRace = ({ donors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const districtData = useMemo(() => {
    const donationTotals = (donors || []).reduce((acc, donor) => {
      if (!acc[donor.location]) acc[donor.location] = 0;
      acc[donor.location] += donor.amount;
      return acc;
    }, {});
    const fullDistrictData = allKeralaDistricts.map((district) => ({
      district,
      total: donationTotals[district] || 0,
    }));
    return fullDistrictData.sort((a, b) => {
      return b.total - a.total;
    });
  }, [donors]);

  const displayedData = useMemo(() => {
    return isExpanded ? districtData : districtData.slice(0, 5);
  }, [isExpanded, districtData]);

  const maxAmount = useMemo(
    () =>
      districtData.length > 0 &&
      Math.max(...districtData.map((d) => d.total)) > 0
        ? Math.max(...districtData.map((d) => d.total))
        : 1,
    [districtData]
  );

  const formatCurrency = useCallback((amount) => {
    return `₹ ${amount.toLocaleString("en-IN")}`;
  }, []);

  return (
    <div className="w-full bg-cyan-50 p-4 sm:p-6 md:rounded-2xl border border-cyan-100 relative overflow-hidden">
      <div className="space-y-8">
        {displayedData.map((item, index) => {
          const progressPercentage = (item.total / maxAmount) * 100;

          return (
            <div key={item.district}>
              <div className="flex justify-between items-center mb-1 text-amber-900 px-1">
                <span className="chilanka text-base font-bold truncate">
                  {item.district}
                </span>
                <span className="font-semibold chilanka text-base shrink-0 ml-2">
                  {formatCurrency(item.total)}
                </span>
              </div>

              {/* CORRECTED LAYOUT: Restored your original structure for vertical positioning. */}
              <div className="relative pt-2 mt-5">
                {/* The progress bar / river is the first element */}
                <div className="w-full h-5 bg-blue-300 rounded-full" />

                {/* The boat is the second element, positioned absolutely relative to the container. */}
                <div
                  // `top-0` and `-translate-y-1/2` place it correctly ABOVE the bar.
                  className="absolute top-0 -translate-y-1/2 z-10"
                  style={{
                    // This calculation moves the boat forward by a percentage of the container's width,
                    // then pulls it back by the same percentage of its OWN width.
                    // This ensures the boat's tip, not its left edge, aligns with the donation progress.
                    left:
                      isAnimated && item.total > 0
                        ? `calc(${progressPercentage}% - (${
                            progressPercentage / 100
                          } * ${boatWidthRem}rem))`
                        : "0px",
                    transition: "left 1.5s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  <BoatIcon />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {districtData.length > 5 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center cursor-pointer justify-center mx-auto gap-1 text-amber-900 hover:text-amber-950 font-semibold transition-colors duration-200"
          >
            <span className="text-sm">
              {isExpanded ? "Show Less" : "Show All Districts"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VallamkaliRace;
