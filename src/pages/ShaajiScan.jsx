import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  StopCircle,
  RefreshCw,
  Loader,
  AlertTriangle,
  Download,
  X,
  ArrowLeft,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useClientSide } from "../constants/app";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../store/languageStore";
import { getShaajiScanPrompt } from "../utils/promptUtils";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
const MODEL_NAME = "gemini-2.5-flash";

const OpinionModal = ({
  isOpen,
  onClose,
  caption,
  isGenerating,
  onDownload,
  error,
}) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const modalRef = useRef(null);
  const captionContainerRef = useRef(null);
  const { language } = useLanguageStore();
  const LOADING_TEXTS = [
    "Shaaji is thinking...",
    "Scanning for fashion crimes...",
    "Shaaji is judging your pose...",
    "Consulting the uncle network...",
    "Preparing some brutal honesty...",
    "Thinking of a suitably savage roast...",
  ];
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);

  useEffect(() => {
    if (captionContainerRef.current) {
      captionContainerRef.current.scrollTop =
        captionContainerRef.current.scrollHeight;
    }
  }, [caption]);

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 300); // Duration matches animation
  }, [onClose]);

  useEffect(() => {
    // Only run the animation if we are in the loading state
    if (isOpen && isGenerating && !caption && !error) {
      const intervalId = setInterval(() => {
        // Cycle through the loading texts
        setLoadingText((currentText) => {
          const currentIndex = LOADING_TEXTS.indexOf(currentText);
          const nextIndex = (currentIndex + 1) % LOADING_TEXTS.length;
          return LOADING_TEXTS[nextIndex];
        });
      }, 2000); // Change text every 2 seconds

      // Crucial: Cleanup the interval when the modal closes or loading stops
      return () => clearInterval(intervalId);
    }
  }, [isOpen, isGenerating, caption, error]);

  useEffect(() => {
    if (!isOpen) return;

    // We only need to find the first element for the initial focus.
    // The rest of the logic will happen dynamically inside the event handler.
    const firstFocusableElement = modalRef.current?.querySelector(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab") {
        // THE KEY CHANGE: We find the list of focusable elements *inside* the event handler.
        // This means the list is always up-to-date, even if buttons become disabled.
        // The ':not([disabled])' selector is crucial here.
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // If there are no focusable elements (or only one), stop the tab event.
        if (!focusableElements || focusableElements.length < 2) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Tabbing backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tabbing forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isAnimatingOut) return null;

  const animationClass = isAnimatingOut
    ? "animate-modal-scale-out"
    : "animate-modal-scale-in";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen && !isAnimatingOut
          ? "bg-black/60 backdrop-blur-sm opacity-100"
          : "bg-transparent backdrop-blur-none opacity-0"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`relative bg-gray-950 w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh] ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={language === "ta" ? "/tamil-head.png" : "/mascot-head.png"}
              alt="Shaaji"
              className="w-8"
            />
            <h3 id="modal-title" className="text-lg font-semibold text-white">
              Shaaji's Opinion
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="cursor-pointer p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FLEXIBLE CONTENT AREA */}
        <div className="flex-1 p-6 overflow-y-auto">
          {error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : isGenerating && !caption ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-gray-400">
              <Loader className="w-8 h-8 animate-spin" />
              <p className="mt-2">{loadingText}</p>
            </div>
          ) : (
            <p className="text-base text-left text-gray-300 leading-relaxed whitespace-pre-wrap">
              {caption}
              {isGenerating && (
                <span className="inline-block w-2 h-5 bg-white animate-pulse ml-1 align-bottom"></span>
              )}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-800 flex justify-center">
          <button
            onClick={onDownload}
            disabled={isGenerating || !caption || !!error}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Download Photo
          </button>
        </div>
      </div>
    </div>
  );
};

// The main Webcam Capture component
export default function ShaajiScan() {
  const { language } = useLanguageStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captionContainerRef = useRef(null);
  const generationController = useRef(null);
  const triggerButtonRef = useRef(null);
  const [streamState, setStreamState] = useState({
    isStreaming: false,
    capturedImage: null,
    caption: null,
    isGenerating: false,
    error: null,
    isInitializing: false,
  });

  const cancelGeneration = useCallback(() => {
    if (generationController.current) {
      generationController.current.abort();
      generationController.current = null;
    }
  }, []);

  // --- MODIFICATION FOR STREAMING ONLY ---
  const generateCaption = useCallback(
    async (base64Clean) => {
      // 1. Set initial state for streaming, resetting the caption
      cancelGeneration();
      generationController.current = new AbortController();
      const { signal } = generationController.current;

      setStreamState((prev) => ({
        ...prev,
        isGenerating: true,
        caption: "",
        error: null,
      }));

      try {
        if (!useClientSide) {
          const response = await fetch("/api/scan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              base64Clean: base64Clean,
              language: language,
            }),
          });

          if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
          }

          // 2. Handle the streaming response from your API
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            const chunk = decoder.decode(value, { stream: true });

            // 3. Update the state with each received chunk
            setStreamState((prev) => ({
              ...prev,
              caption: (prev.caption || "") + chunk,
            }));
          }
        } else {
          const contents = [
            {
              inlineData: {
                mimeType: "image/jpeg",

                data: base64Clean,
              },
            },
            {
              text: getShaajiScanPrompt(language || "ml"),
            },
          ];
          // 2. Use generateContentStream as requested

          const responseStream = await ai.models.generateContentStream({
            model: MODEL_NAME,
            contents: contents,
          });
          // 3. Iterate through the stream and append text chunks to the state
          for await (const chunk of responseStream) {
            setStreamState((prev) => ({
              ...prev,
              caption: (prev.caption || "") + chunk.text,
            }));
          }
        }
      } catch (err) {
        if (!signal.aborted) {
          // Only show an error if we didn't cancel it ourselves
          console.error(err);
          setStreamState((prev) => ({
            ...prev,
            error: {
              type: "caption",
              message: "Failed to generate caption. Please try again!",
            },
          }));
        }
      } finally {
        // 4. Set isGenerating to false after the stream is complete
        setStreamState((prev) => ({ ...prev, isGenerating: false }));
        generationController.current = null;
      }
    },
    [cancelGeneration]
  );

  const startCamera = useCallback(async () => {
    setStreamState((prev) => ({ ...prev, isInitializing: true, error: null }));

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          facingMode: { ideal: "user" },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });
        setStreamState((prev) => ({
          ...prev,
          isStreaming: true,
          isInitializing: false,
          capturedImage: null,
          caption: null,
          error: null,
        }));
      }
    } catch (err) {
      console.error("Camera access error:", err);
      let errorMessage =
        "Failed to access camera. Please grant permission and try again.";
      if (err.name === "NotAllowedError")
        errorMessage =
          "Camera access was denied. Please grant permission in your browser settings and refresh the page.";
      if (err.name === "NotFoundError")
        errorMessage =
          "No camera found. Please ensure a camera is connected and enabled.";
      if (err.name === "NotSupportedError")
        errorMessage = "Camera is not supported on this device or browser.";
      if (err.name === "NotReadableError")
        errorMessage = "Camera is already in use by another application.";
      setStreamState((prev) => ({
        ...prev,
        error: { type: "camera", message: errorMessage },
        isInitializing: false,
        isStreaming: false,
      }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    cancelGeneration();
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject?.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamState((prev) => ({
      ...prev,
      isStreaming: false,
      capturedImage: null,
      caption: null,
      error: null,
      isInitializing: false,
    }));
  }, [cancelGeneration]);

  useEffect(() => {
    const videoElement = videoRef.current;
    // Return the cleanup function
    return () => {
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoElement.srcObject = null; // Also good practice to nullify it
      }
    };
  }, []);

  const captureImage = useCallback(() => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.videoWidth === 0
    ) {
      setStreamState((prev) => ({
        ...prev,
        error: {
          type: "camera",
          message: "Camera not ready. Please try again.",
        },
      }));
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const MAX_DIMENSION = 512; // Set your target for the longest side
    let newWidth, newHeight;

    if (video.videoWidth > video.videoHeight) {
      // Landscape video
      newWidth = MAX_DIMENSION;
      newHeight = video.videoHeight * (MAX_DIMENSION / video.videoWidth);
    } else {
      // Portrait or square video
      newHeight = MAX_DIMENSION;
      newWidth = video.videoWidth * (MAX_DIMENSION / video.videoHeight);
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setStreamState((prev) => ({
            ...prev,
            error: { type: "camera", message: "Failed to capture image data." },
          }));
          return;
        }

        // Revoke the old URL to prevent memory leaks
        if (streamState.capturedImage) {
          URL.revokeObjectURL(streamState.capturedImage);
        }

        triggerButtonRef.current = document.activeElement;
        const imageUrl = URL.createObjectURL(blob);
        setStreamState((prev) => ({ ...prev, capturedImage: imageUrl }));

        // Convert Blob to base64 ONLY for the API call
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Data = reader.result;
          const base64Clean = base64Data.replace(
            /^data:image\/jpeg;base64,/,
            ""
          );
          generateCaption(base64Clean);
        };
      },
      "image/jpeg",
      0.7
    );
  }, [generateCaption, streamState.capturedImage]);

  const downloadImage = useCallback(() => {
    if (!streamState.capturedImage) return;
    const link = document.createElement("a");
    link.href = streamState.capturedImage;
    link.download = `shaaji-scan-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [streamState.capturedImage]);

  useEffect(() => {
    if (captionContainerRef.current) {
      captionContainerRef.current.scrollTop =
        captionContainerRef.current.scrollHeight;
    }
  }, [streamState.caption]);

  const handleCloseModal = useCallback(() => {
    // We only reset the image and caption, keeping the stream active if it is.
    cancelGeneration(); // Also good to cancel any running generation
    if (streamState.capturedImage) {
      URL.revokeObjectURL(streamState.capturedImage); // FIX: Resource management
    }
    setStreamState((prev) => ({
      ...prev,
      capturedImage: null,
      caption: null,
      error: null,
      isGenerating: false, // Ensure this is reset
    }));
    triggerButtonRef.current?.focus();
  }, [cancelGeneration, streamState.capturedImage]);

  return (
    <div className="h-screen w-screen relative bg-black text-white font-sans overflow-hidden">
      {/* Full Screen Camera Section */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      <header className="w-full p-6 z-10 absolute top-0 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Link to="/">
            <ArrowLeft className="cursor-pointer dark:text-neutral-100" />
          </Link>
          <h1 className="cal-sans text-2xl">Shaaji Scan</h1>
          <span className="text-blue-500 text-sm px-2 py-1 ring-1 ring-blue-500 rounded-full">
            BETA
          </span>
        </div>
        {!streamState.isStreaming && !streamState.isGenerating && (
          <button
            onClick={startCamera}
            aria-label="Start Camera"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-500/80 backdrop-blur-sm text-white rounded-full hover:bg-green-600 transition-colors text-sm sm:text-base"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Start</span>
          </button>
        )}
        {streamState.isStreaming && (
          <button
            onClick={stopCamera}
            aria-label="Stop Camera"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
          >
            <StopCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        )}
      </header>

      {/* State Overlays */}
      {streamState.isInitializing && !streamState.error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black">
          <Loader className="w-16 h-16 text-white animate-spin" />
          <p className="text-gray-300 text-lg">Initializing camera...</p>
        </div>
      )}
      {!streamState.isStreaming &&
        !streamState.error &&
        !streamState.isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <img
              src={
                language === "ta" ? "tamil-sleeping.png" : "shaaji-sleeping.png"
              }
              className="max-w-36 text-gray-600"
            />
            <p className="text-gray-400">Shaaji is sleeping. Wake him up!</p>
          </div>
        )}

      {/* Opinion Modal */}
      <OpinionModal
        isOpen={!!streamState.capturedImage}
        onClose={handleCloseModal}
        capturedImage={streamState.capturedImage}
        caption={streamState.caption}
        isGenerating={streamState.isGenerating}
        error={
          streamState.error?.type === "caption"
            ? streamState.error.message
            : null
        }
        onDownload={downloadImage}
      />

      {/* Error Modal */}
      {streamState.error?.type === "camera" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-100 p-4">
          <div className="bg-red-600/95 backdrop-blur-sm p-6 rounded-lg shadow-xl text-center max-w-md w-full">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-bold mb-3 text-white">Camera Error</h3>
            <p className="text-red-100 mb-6">{streamState.error.message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={startCamera}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-5 h-5" /> Try Again
              </button>
              <button
                onClick={() =>
                  setStreamState((prev) => ({ ...prev, error: null }))
                }
                className="px-5 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full p-6 flex justify-center items-center z-10 absolute bottom-0">
        {streamState.isStreaming && !streamState.isGenerating && (
          <button
            onClick={captureImage}
            aria-label="Capture Photo"
            className="group w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center p-1 transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100 shadow-lg"
          >
            <div className="w-full h-full rounded-full bg-white border-4 border-black group-hover:border-gray-700 transition-colors"></div>
          </button>
        )}
      </footer>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
