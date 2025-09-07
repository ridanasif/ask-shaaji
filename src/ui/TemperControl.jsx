import { getTemperConfig } from "../constants/app";
import { getUncleName } from "../constants/app";
const TemperControl = ({ temperLevel, setTemperLevel }) => {
  const TEMPER_CONFIG = getTemperConfig();
  const getCurrentThumbColor = () => {
    return TEMPER_CONFIG[temperLevel].gradientColor;
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6 lg:sticky lg:top-24">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-neutral-100">
          {getUncleName()}'s Temper
        </h3>
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl">
            <img
              src={TEMPER_CONFIG[temperLevel].img}
              className="w-8 sm:w-10"
              alt="temper"
            />
          </span>
          <div className="text-center">
            <div className="font-medium text-gray-700 text-sm sm:text-base dark:text-neutral-300">
              {TEMPER_CONFIG[temperLevel].time}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <div className="h-2 sm:h-3 rounded-full mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400">
            <div
              className="absolute top-0 w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-neutral-900 border-2 rounded-full shadow-md cursor-pointer transform -translate-y-1 sm:-translate-y-1.5 transition-all duration-200 hover:border-gray-600"
              style={{
                left: `calc(${(temperLevel / 2) * 100}% - 10px)`,
                borderColor: getCurrentThumbColor(),
              }}
            />
          </div>

          <div className="flex justify-between">
            {Object.values(TEMPER_CONFIG).map((item, index) => (
              <button
                key={index}
                onClick={() => setTemperLevel(index)}
                className={`flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all duration-200 cursor-pointer dark:hover:bg-neutral-600 hover:bg-gray-50 ${
                  temperLevel === index
                    ? "bg-gray-100 dark:bg-neutral-700 shadow-sm"
                    : ""
                }`}
              >
                <div className="text-base sm:text-xl mb-1">
                  <img
                    src={item.img}
                    className="w-6 sm:w-8"
                    alt={`temper-${index}`}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center leading-tight dark:text-neutral-300">
                  <div className="font-medium">{item.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-600 p-3 sm:p-4 bg-gray-50 rounded-lg dark:bg-neutral-700 dark:text-neutral-300">
        {TEMPER_CONFIG[temperLevel].description}
      </div>
    </div>
  );
};
export default TemperControl;
