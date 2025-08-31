import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

// 1. Create the context
const AlertContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useAlert = () => {
  return useContext(AlertContext);
};

// 3. Create the Provider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message, type = "error", duration = 3000) => {
    setAlert({ message, type });

    // Automatically hide the alert after the duration
    setTimeout(() => {
      setAlert(null);
    }, duration);
  }, []);

  const hideAlert = () => {
    setAlert(null);
  };

  const value = {
    alert,
    showAlert,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Alert />
    </AlertContext.Provider>
  );
};

// 4. Create the Alert UI component with proper animations
const Alert = () => {
  const { alert, hideAlert } = useAlert();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (alert) {
      setShouldRender(true);
      // Small delay to trigger entrance animation
      setTimeout(() => setIsVisible(true), 10);
    } else if (isVisible) {
      setIsVisible(false);
      // Wait for exit animation to complete before unmounting
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [alert, isVisible]);

  if (!shouldRender) {
    return null;
  }

  // Determine colors based on the alert type
  const baseClasses =
    "fixed top-5 left-1/2 transform -translate-x-1/2 max-w-sm w-full shadow-lg rounded-lg px-4 py-2 z-50 transition-all duration-300 ease-out";

  const typeClasses = {
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  // Animation classes
  const animationClasses = isVisible
    ? "translate-y-0 opacity-100 scale-100"
    : "-translate-y-8 opacity-0 scale-95";

  return (
    <div
      className={`${baseClasses} ${
        typeClasses[alert?.type] || typeClasses.error
      } ${animationClasses}`}
      style={{
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Icon based on type */}
          <div className="mr-3">
            {alert?.type === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {alert?.type === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {alert?.type === "info" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {alert?.type === "warning" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <p className="font-medium text-sm">{alert?.message}</p>
        </div>
        <button
          onClick={hideAlert}
          className="ml-4 p-1 cursor-pointer rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
