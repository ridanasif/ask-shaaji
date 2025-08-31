import { useClientSide, TEMPER_CONFIG } from "../constants/app";
import { useState } from "react";
import { useAlert } from "../context/AlertContext";

const GENERAL_ERROR_MESSAGE = "Failed to generate image!";
// Shared helper function for text wrapping logic
const getWrappedLines = (ctx, text, maxWidth) => {
  // 1. New helper function to break apart a single long word
  const breakWord = (word) => {
    const brokenLines = [];
    let currentSubLine = "";
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const testSubLine = currentSubLine + char;
      // If the sub-line is now too wide, push the previous version and start a new one
      if (ctx.measureText(testSubLine).width > maxWidth) {
        brokenLines.push(currentSubLine);
        currentSubLine = char;
      } else {
        currentSubLine = testSubLine;
      }
    }
    // Push the last remaining part of the word
    if (currentSubLine !== "") {
      brokenLines.push(currentSubLine);
    }
    return brokenLines;
  };

  // 2. Main wrapping logic, now smarter
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // --- NEW LOGIC STARTS HERE ---
    // First, check if the word itself is too long to fit on any line
    if (ctx.measureText(word).width > maxWidth) {
      // If there was text on the current line, push it to lines first
      if (currentLine !== "") {
        lines.push(currentLine.trim());
        currentLine = "";
      }
      // Use our new helper to break the long word and add all its pieces
      const brokenPieces = breakWord(word);
      lines.push(...brokenPieces);
      continue; // Skip the rest of the loop and move to the next word
    }
    // --- NEW LOGIC ENDS HERE ---

    // Original logic for adding words to a line
    const testLine = currentLine === "" ? word : `${currentLine} ${word}`;

    if (ctx.measureText(testLine).width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  // Add the last line if it's not empty
  if (currentLine !== "") {
    lines.push(currentLine);
  }

  return lines;
};

// Refactored wrapText function
const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = null) => {
  // 1. Use shared helper to get wrapped lines
  let lines = getWrappedLines(ctx, text, maxWidth);

  // 2. Handle truncation if maxLines is set (this was the unique logic)
  if (maxLines && lines.length > maxLines) {
    // Trim the array to the max number of lines
    lines = lines.slice(0, maxLines);

    // Get the last visible line and truncate it with "..."
    let lastLine = lines[maxLines - 1];
    const ellipsis = "...";

    // Keep removing the last word until the line + ellipsis fits
    while (ctx.measureText(lastLine + ellipsis).width > maxWidth) {
      // Handle the edge case where even the first word is too long
      if (!lastLine.includes(" ")) {
        lastLine = "";
        break;
      }
      lastLine = lastLine.substring(0, lastLine.lastIndexOf(" "));
    }

    // Update the last line in the array
    lines[maxLines - 1] = lastLine.trim() + ellipsis;
  }

  // 3. Draw the final, correctly formatted lines (unique to wrapText)
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return lines;
};

// Refactored measureText function - much simpler now!
const measureText = (ctx, text, maxWidth, lineHeight) => {
  // Use shared helper to get wrapped lines
  const lines = getWrappedLines(ctx, text, maxWidth);

  return {
    lines: lines,
    height: lines.length * lineHeight,
    lineCount: lines.length,
  };
};

// Function to draw image maintaining aspect ratio within a circle
const drawImageInCircle = (ctx, image, centerX, centerY, radius) => {
  ctx.save();

  // Create circular clipping mask
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  if (image && image.complete && image.naturalWidth > 0) {
    // Calculate scaling to fit image in circle while maintaining aspect ratio
    const imageAspect = image.naturalWidth / image.naturalHeight;
    let drawWidth, drawHeight;

    if (imageAspect > 1) {
      // Image is wider than tall
      drawHeight = radius * 1.5;
      drawWidth = drawHeight * imageAspect;
    } else {
      // Image is taller than wide or square
      drawWidth = radius * 1.5;
      drawHeight = drawWidth / imageAspect;
    }

    // Center the image in the circle
    const drawX = centerX - drawWidth / 2;
    const drawY = centerY - drawHeight / 2;
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  } else {
    // Fallback: Draw colored circle if image not available
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

function generateShareImage(query, opinion, temperLevel) {
  return new Promise((resolve, reject) => {
    // --- START: Refactored Layout System ---

    // 1. Define a centralized layout configuration object.
    // This creates a consistent and symmetrical spacing system.
    const LAYOUT = {
      width: 1200,
      minHeight: 630,
      borderRadius: 24,
      padding: {
        outer: 80, // Symmetrical padding around the main content box
        inner: 40, // Symmetrical padding inside the content box
      },
      spacing: {
        medium: 20, // Space between related items (e.g., query and opinion)
        large: 40, // Space between major sections (e.g., header and text block)
      },
      header: {
        height: 80, // Fixed height for the header area (mascot + title)
        mascotRadius: 35,
        titleSpacing: 20, // Space between mascot and title text
      },
      footer: {
        height: 30, // Fixed height for the footer text area
      },
      font: {
        query: "bold 28px Poppins, sans-serif",
        opinion: "26px Arial, sans-serif",
        title: "bold 36px Cal Sans, sans-serif",
        footer: "20px Poppins, sans-serif",
      },
      lineHeight: {
        query: 38,
        opinion: 34,
      },
    };

    // --- END: Refactored Layout System ---

    // Create a temporary canvas for text measurement
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Set up the context for measurement
    const dpr = window.devicePixelRatio || 1;
    tempCtx.scale(dpr, dpr);
    tempCtx.textBaseline = "top";

    // 2. Calculate dynamic dimensions based on the LAYOUT object
    const contentWidth = LAYOUT.width - LAYOUT.padding.outer * 2;
    const textWidth = contentWidth - LAYOUT.padding.inner * 2;

    // Measure query text
    tempCtx.font = LAYOUT.font.query;
    const queryMeasurement = measureText(
      tempCtx,
      query,
      textWidth,
      LAYOUT.lineHeight.query
    );
    const queryHeight = queryMeasurement.height;

    // Measure opinion text
    tempCtx.font = LAYOUT.font.opinion;
    const opinionMeasurement = measureText(
      tempCtx,
      opinion,
      textWidth,
      LAYOUT.lineHeight.opinion
    );
    const opinionHeight = opinionMeasurement.height;

    // 3. Calculate total canvas height symmetrically
    const totalContentHeight =
      LAYOUT.padding.inner + // Top inner padding
      LAYOUT.header.height + // Header section
      LAYOUT.spacing.large + // Space after header
      queryHeight + // Dynamic query height
      LAYOUT.spacing.medium + // Space between query and opinion
      opinionHeight + // Dynamic opinion height
      LAYOUT.spacing.large + // Symmetrical space before footer
      LAYOUT.footer.height + // Footer section
      LAYOUT.padding.inner; // Bottom inner padding

    const canvasHeight = Math.max(
      LAYOUT.minHeight,
      totalContentHeight + LAYOUT.padding.outer * 2
    );

    // Create the actual canvas with calculated dimensions
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = LAYOUT.width * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = LAYOUT.width + "px";
    canvas.style.height = canvasHeight + "px";

    // Scale the context and set quality properties
    ctx.scale(dpr, dpr);
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const currentTemper = TEMPER_CONFIG[temperLevel || 0];

    const mascotImage = new Image();
    mascotImage.crossOrigin = "anonymous";
    let imageLoaded = false;
    let timeoutId;

    const drawCanvas = () => {
      try {
        // --- Drawing logic using the new LAYOUT object ---

        // Canvas background
        ctx.fillStyle = currentTemper.gradientColor;
        ctx.fillRect(0, 0, LAYOUT.width, canvasHeight);

        // Subtle pattern overlay
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < LAYOUT.width; i += 40) {
          for (let j = 0; j < canvasHeight; j += 40) {
            if ((i + j) % 80 === 0) {
              ctx.fillRect(i, j, 2, 2);
            }
          }
        }

        // Main content area with rounded rectangle and shadow
        const contentX = LAYOUT.padding.outer;
        const contentY = LAYOUT.padding.outer;
        const actualContentHeight = canvasHeight - LAYOUT.padding.outer * 2;

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(
          contentX,
          contentY,
          contentWidth,
          actualContentHeight,
          LAYOUT.borderRadius
        );
        ctx.fill();
        ctx.restore(); // Reset shadow

        // --- Header Section ---
        const headerY = contentY + LAYOUT.padding.inner;
        const mascotCenterX =
          contentX + LAYOUT.padding.inner + LAYOUT.header.mascotRadius;
        const mascotCenterY = headerY + LAYOUT.header.height / 2;

        drawImageInCircle(
          ctx,
          imageLoaded ? mascotImage : null,
          mascotCenterX,
          mascotCenterY,
          LAYOUT.header.mascotRadius
        );

        const drawColorfulText = (ctx, text, x, y, font, colors) => {
          ctx.font = font;
          let currentX = x;
          for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillText(letter, currentX, y);
            currentX += ctx.measureText(letter).width;
          }
        };

        const googleColors = [
          "#3b82f6",
          "#ef4444",
          "#eab308",
          "#3b82f6",
          "#22c55e",
          "#ef4444",
        ];
        const titleX =
          mascotCenterX +
          LAYOUT.header.mascotRadius +
          LAYOUT.header.titleSpacing;

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        drawColorfulText(
          ctx,
          "Shaaji",
          titleX,
          mascotCenterY,
          LAYOUT.font.title,
          googleColors
        );
        ctx.textBaseline = "top"; // Reset for subsequent text blocks

        // --- Text Content Section ---
        const textStartX = contentX + LAYOUT.padding.inner;
        let currentY = headerY + LAYOUT.header.height + LAYOUT.spacing.large;

        // Query text
        ctx.font = LAYOUT.font.query;
        ctx.fillStyle = "#333";
        wrapText(
          ctx,
          query,
          textStartX,
          currentY,
          textWidth,
          LAYOUT.lineHeight.query
        );

        // Move to opinion position
        currentY += queryHeight + LAYOUT.spacing.medium;

        // Opinion text
        ctx.font = LAYOUT.font.opinion;
        ctx.fillStyle = "#333";
        wrapText(
          ctx,
          opinion,
          textStartX,
          currentY,
          textWidth,
          LAYOUT.lineHeight.opinion
        );

        // --- Footer Section ---
        const footerY =
          contentY +
          actualContentHeight -
          LAYOUT.padding.inner -
          LAYOUT.footer.height;
        ctx.fillStyle = "#999";
        ctx.font = LAYOUT.font.footer;

        // Left-aligned footer text
        ctx.textAlign = "left";
        ctx.fillText("Generated by Ask Shaaji", textStartX, footerY);

        // Right-aligned footer text
        ctx.textAlign = "right";
        ctx.fillText(
          "https://ask-shaaji.vercel.app",
          contentX + contentWidth - LAYOUT.padding.inner,
          footerY
        );

        ctx.textAlign = "left"; // Reset alignment

        resolve(canvas);
      } catch (error) {
        reject(error);
      }
    };

    mascotImage.onload = function () {
      imageLoaded = true;
      clearTimeout(timeoutId);
      drawCanvas();
    };

    mascotImage.onerror = function () {
      console.warn("Failed to load mascot image, using fallback");
      clearTimeout(timeoutId);
      drawCanvas();
    };

    timeoutId = setTimeout(() => {
      if (!imageLoaded) {
        console.warn("Image loading timeout, proceeding without image");
        drawCanvas();
      }
    }, 2000);

    mascotImage.src = `/${currentTemper.img}`;
  });
}

// The rest of the file (ShareButton component) remains the same
const ShareButton = ({ query, opinion, temperLevel, isVisible }) => {
  const { showAlert } = useAlert();

  const [isSharing, setIsSharing] = useState(false);
  const currentTemper = TEMPER_CONFIG[temperLevel];

  const handleShare = async () => {
    if (!query || !opinion || isSharing) return;

    setIsSharing(true);
    try {
      // Wait for fonts to be ready before generating the image
      await document.fonts.ready;
      // Wait for the canvas to be properly generated
      const canvas = await generateShareImage(query, opinion, temperLevel);

      // Convert to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            console.error("Failed to generate image blob");
            showAlert(GENERAL_ERROR_MESSAGE);
            setIsSharing(false);
            return;
          }

          try {
            if (navigator.share && navigator.canShare) {
              // Use native sharing if available
              const file = new File([blob], "shaaji-opinion.png", {
                type: "image/png",
              });

              if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                  title: `Shaaji's Opinion on: ${query}`,
                  text: `Check out what Shaaji thinks about "${query}"`,
                  files: [file],
                });
              } else {
                // Fallback to download if files can't be shared
                downloadImage(blob);
              }
            } else {
              // Fallback to download
              downloadImage(blob);
            }
          } catch (shareError) {
            // Fallback to download on share error
            downloadImage(blob);
          } finally {
            setIsSharing(false);
            if (!useClientSide) {
              fetch("/api/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  query: query,
                  uncle_opinion: opinion,
                }),
              });
            }
          }
        },
        "image/png",
        0.9
      );
    } catch (error) {
      console.error("Canvas generation error:", error);
      showAlert(GENERAL_ERROR_MESSAGE);
      setIsSharing(false);
    }
  };

  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shaaji-opinion-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`flex items-center gap-2 px-2 rounded-full transition-all duration-300 hover:scale-105 ${
        isSharing
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:shadow-lg"
      } bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white/90`}
      title="Share Shaaji's opinion"
    >
      {isSharing ? (
        <svg
          className={`w-4 h-4 animate-spin ${currentTemper.textColor}`}
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
      ) : (
        <svg
          className={`w-4 h-4 ${currentTemper.textColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
      )}
      <span className={`text-xs font-medium ${currentTemper.textColor}`}>
        {isSharing ? "Creating..." : "Share Photo"}
      </span>
    </button>
  );
};

export default ShareButton;
