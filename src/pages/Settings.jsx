import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TemperControl from "../ui/TemperControl";
import {
  getTemperLevel,
  setTemperLevel as saveTemperLevel,
} from "../utils/temperUtils";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("general");
  const [temperLevel, setTemperLevel] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load temper level from localStorage on component mount
    setTemperLevel(getTemperLevel());
  }, []);

  const handleTemperChange = (newLevel) => {
    setTemperLevel(newLevel);
    saveTemperLevel(newLevel);
  };

  const sidebarItems = [
    {
      id: "general",
      label: "General",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-10 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="dark:text-neutral-100" />
            </button>
            <h1 className="text-xl font-semibold dark:text-neutral-100">
              Settings
            </h1>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Toggle menu"
          >
            <svg
              className="w-5 h-5 dark:text-neutral-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  sidebarOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "block" : "hidden"} lg:block
            w-full lg:w-64 bg-white dark:bg-neutral-800 
            border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-700 p-4
          `}
        >
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false); // Close mobile menu when item is selected
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeSection === "general" && (
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 dark:text-neutral-100">
                  General Settings
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-neutral-400">
                  Customize your Shaaji experience with these general
                  preferences.
                </p>
              </div>

              {/* Temper Control Section */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-neutral-100">
                    Shaaji's Personality
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-400 text-xs sm:text-sm">
                    Choose how Shaaji responds to your queries. This setting
                    will be remembered for your future searches.
                  </p>
                </div>

                <TemperControl
                  temperLevel={temperLevel}
                  setTemperLevel={handleTemperChange}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
