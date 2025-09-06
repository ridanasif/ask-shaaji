import { X, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../store/languageStore";

const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { language } = useLanguageStore();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 transition-all duration-300 ease-out ${
        isOpen ? "backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
      style={{
        animation: isOpen ? "fadeIn 0.3s ease-out" : "fadeOut 0.3s ease-in",
      }}
    >
      <div
        className="relative w-full max-w-xs sm:max-w-sm mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto"
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 dark:bg-red-400 dark:hover:bg-red-500 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90"
        >
          <X className="w-4 h-4 text-red-600 dark:text-white" />
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
        `}</style>

        <div className="p-4 sm:p-5">
          {/* Header - More compact */}
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-semibold dark:text-white">
              Support Shaaji
            </h2>
            <p className="text-gray-600 dark:text-neutral-300 mt-1.5 text-xs sm:text-sm">
              Your contribution helps us keep Shaaji running!
            </p>
          </div>

          {/* QR Code Section - Smaller */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-700 dark:to-neutral-900 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-500 hover:scale-105">
            <div className="bg-white rounded-lg p-2 inline-block shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src="QR.png"
                alt="UPI QR Code"
                className="w-28 h-28 sm:w-32 sm:h-32 mx-auto object-contain"
              />
            </div>
            <p className="mt-3 text-xs font-semibold text-gray-800 dark:text-neutral-100">
              Scan to pay with any UPI app
            </p>
          </div>

          {/* Divider - Thinner */}
          <div className="my-4 flex items-center text-center">
            <div className="flex-grow border-t border-gray-200 dark:border-neutral-700"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-gray-400 dark:text-neutral-500">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-neutral-700"></div>
          </div>

          {/* PayPal Button - More compact */}
          <a
            href="https://paypal.me/RidanAsif"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-x-2 py-3 px-4 rounded-lg bg-[#0070BA] hover:bg-[#005ea6] transition-colors duration-200 text-white font-medium text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.754 5.438c.259-.28.616-.438.995-.438h5.993c3.832 0 4.35 2.988 3.938 6.014-.344 2.529-1.859 4.129-3.929 4.212-.139.006-.282.009-.422.009h-1.621c-.516 0-.974.356-1.096.859l-.328 1.382c-.085.348-.396.586-.757.586h-1.39c-.394 0-.737-.265-.84-.639l-1.859-6.039c-.104-.383.082-.79.45-1.002s.827-.152 1.127.098l1.77.927c.224.124.502.133.734.024.269-.126.398-.423.292-.693l-.859-2.28zm8.995 1.562h-5.993c-.267 0-.528.105-.71.294l-2.079 2.162c.264.838.455 1.724.538 2.638.118 1.256.098 2.179-.009 2.76h.548c.516 0 .974-.356 1.096-.859l.328-1.382c.085-.348.396-.586.757-.586h1.621c.21 0 .423-.016.634-.049 2.368-.356 3.729-2.31 4.098-5.069.213-1.656-.03-3.694-1.548-3.694z" />
            </svg>
            <span>Pay with PayPal</span>
          </a>

          {/* Info Box - More compact */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg p-3 flex items-start gap-x-3">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">
              To get on the Live Supporters list, please add your{" "}
              <strong>First Name & Location</strong> (e.g.{" "}
              {language === "ar" ? "Khalid, UAE" : "Rohan, Delhi"}) in the
              payment notes!
            </p>
          </div>

          {/* Description - More compact */}
          <div className="text-left text-xs text-gray-500 dark:text-neutral-400 mt-4 sm:mt-5 space-y-2.5">
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
