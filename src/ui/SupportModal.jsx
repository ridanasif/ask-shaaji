import { X } from "lucide-react";
import { Link } from "react-router-dom";
const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ease-out ${
        isOpen ? "backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
      style={{
        animation: isOpen ? "fadeIn 0.3s ease-out" : "fadeOut 0.3s ease-in",
      }}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out max-h-[95vh] overflow-y-auto"
        style={{
          animation: isOpen
            ? "slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "slideOutScale 0.3s ease-in",
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(-50px) scale(0.95)",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {/* Close Button - Improved touch target */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 dark:bg-red-400 dark:hover:bg-red-500 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90"
        >
          <X className="text-red-600 dark:text-white" />
        </button>

        {/* Add CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          @keyframes slideInScale {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes slideOutScale {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
          }
          @keyframes slideInFromBottom {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes heartbeat {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>

        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold dark:text-white">
              Support Shaaji
            </h2>
            <p className="text-gray-600 dark:text-neutral-300 mt-2 text-sm">
              Your contribution helps us keep Shaaji running!
            </p>
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-700 dark:to-neutral-900 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-500 hover:scale-105">
            <div className="bg-white rounded-lg p-2 inline-block shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src="QR.png"
                alt="UPI QR Code"
                className="w-36 h-36 sm:w-48 sm:h-48 mx-auto object-contain"
              />
            </div>
            <p className="mt-3 sm:mt-4 text-sm font-semibold text-gray-800 dark:text-neutral-100">
              Scan to pay with any UPI app
            </p>
          </div>

          {/* Description */}
          <div className="text-left text-sm text-gray-500 dark:text-neutral-400 mt-5 sm:mt-6 space-y-3">
            <p>
              Every contribution, no matter the amount, helps us cover server
              costs and develop exciting new features like{" "}
              <Link
                to="/scan"
                className="font-semibold text-gray-600 dark:text-neutral-200"
              >
                Shaaji Scan
              </Link>
              .
            </p>
            <p>
              Our ultimate goal is to launch a standalone mobile app, and your
              support gets us one step closer!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SupportModal;
