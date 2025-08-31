import { TEMPER_CONFIG } from "../constants/app";
// Optimized Voice Button Component
const VoiceButton = ({ onPlay, onStop, isPlaying, isLoading, temperLevel }) => {
  const currentTemper = TEMPER_CONFIG[temperLevel];
  const handleClick = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
        isLoading
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:shadow-md"
      } hover:bg-white hover:bg-opacity-30`}
      title={
        isLoading
          ? "Loading..."
          : isPlaying
          ? "Stop audio"
          : "Play Shaaji's opinion"
      }
    >
      {isLoading ? (
        <svg
          className={`w-5 h-5 animate-spin ${currentTemper.textColor}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isPlaying ? (
        <svg
          className={`w-5 h-5 ${currentTemper.textColor}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        <svg
          className={`w-5 h-5 ${currentTemper.textColor}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      )}
    </button>
  );
};
export default VoiceButton;
