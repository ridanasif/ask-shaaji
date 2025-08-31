import { useState, useEffect } from "react";
import { generateAndPlayVoice } from "../utils/voiceUtils";
import { useAlert } from "../context/AlertContext";
export const useVoicePlayback = ({ opinion, temperLevel, isSearchLoading }) => {
  const { showAlert } = useAlert();
  // Voice Related
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const stopAndCleanUp = () => {
    if (currentAudio) {
      currentAudio.audio.pause();
      URL.revokeObjectURL(currentAudio.url);
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setIsLoading(false); // Also reset loading state
  };

  useEffect(() => {
    if (isSearchLoading) {
      stopAndCleanUp();
    }
  }, [isSearchLoading]);

  // Cleanup audio on unmount or query change
  useEffect(() => {
    return stopAndCleanUp;
  }, []);

  // Optimized voice play handler
  const play = async () => {
    if (currentAudio) {
      // If it has finished, rewind to the start
      if (currentAudio.audio.ended) {
        currentAudio.audio.currentTime = 0;
      }
      await currentAudio.audio.play();
      setIsPlaying(true);
      return;
    }
    if (!opinion || isLoading) return;

    setIsLoading(true);
    try {
      const audioObject = await generateAndPlayVoice(opinion, temperLevel);
      if (audioObject) {
        setCurrentAudio(audioObject);
        setIsPlaying(true);
        // Listen for when the audio finishes naturally
        audioObject.audio.onended = () => {
          setIsPlaying(false);
        };
      }
    } catch (error) {
      console.error("Audio error:", error);
      showAlert(
        "It seems Shaaji has lost his voice for a moment. Please try again in a bit."
      );
      stopAndCleanUp(); // Clean up on error
    } finally {
      setIsLoading(false);
    }
  };
  const pause = () => {
    if (currentAudio) {
      currentAudio.audio.pause();
      setIsPlaying(false);
    }
  };

  return { isPlaying, isLoading, play, stop: pause };
};
