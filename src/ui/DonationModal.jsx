const DonationModal = ({ isOpen, onClose }) => {
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
        className="relative w-full max-w-sm sm:max-w-md mx-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out max-h-[95vh] overflow-y-auto"
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
          className="absolute cursor-pointer top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90"
        >
          <svg
            className="w-5 h-5 sm:w-4 sm:h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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

        {/* Modal Content - Improved spacing */}
        <div className="p-4 sm:p-6">
          {/* Header - Responsive text sizes */}
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-800 chilanka mb-2">
              മാവേലിക്ക് കൈനീട്ടം നൽകൂ!
            </h3>
            <p className="text-gray-600 chilanka text-xs sm:text-sm leading-relaxed">
              QR കോഡ് സ്കാൻ ചെയ്ത് സംഭാവന നൽകാം. GPay നോട്ട്സിൽ പേരും ജില്ലയും
              മറക്കല്ലേ! എൻ്റെ കണക്കപ്പിള്ള അത് നോക്കി ചേർക്കുമ്പോഴേക്കും
              കുറച്ച് വൈകും.
            </p>
          </div>

          {/* QR Code Section - Responsive sizing */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-3 sm:p-6 text-center transform transition-all duration-500 hover:scale-105">
            <div className="bg-white rounded-lg p-2 sm:p-4 inline-block shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src="QR.png"
                alt="GPay QR Code"
                className="w-36 h-36 sm:w-48 sm:h-48 mx-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 chilanka leading-relaxed">
              പണ്ടൊക്കെ കൈനീട്ടം പൊൻനാണയങ്ങളായിരുന്നു... കാലം മാറിയതുകൊണ്ട്
              ഗൂഗിൾ പേ ആയാലും മതി!
            </p>
          </div>

          {/* Amount Suggestions - Better mobile layout */}
          <div className="mt-4 sm:mt-6">
            <p className="text-center text-xs sm:text-sm font-medium text-gray-700 chilanka mb-3">
              നിർദ്ദേശിത തുക:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[51, 101, 251, 501, 1001, 2001].map((amount, index) => (
                <div
                  key={amount}
                  className="bg-amber-100 hover:bg-amber-200 transition-all duration-200 rounded-lg p-3 sm:p-2 text-center cursor-pointer hover:scale-110 hover:shadow-md transform min-h-[44px] flex items-center justify-center"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: isOpen
                      ? `slideInFromBottom 0.6s ease-out ${index * 0.1}s both`
                      : "",
                  }}
                >
                  <span className="text-sm sm:text-sm font-medium text-amber-800">
                    ₹{amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Message - Improved spacing */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-gray-500 chilanka transform transition-all duration-300 hover:scale-105 leading-relaxed">
              നിങ്ങളുടെ ഓരോ രൂപയും മാവേലിയുടെ സ്വപ്നങ്ങൾക്ക് കരുത്താകും!
              <span
                className="inline-block ml-1"
                style={{ animation: "heartbeat 2s infinite" }}
              >
                💛
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
