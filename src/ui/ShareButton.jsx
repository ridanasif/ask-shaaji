import { useClientSide, TEMPER_CONFIG } from "../constants/app";
import { useState } from "react";

const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = null) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0] || "";

  // 1. Let the loop wrap all the text normally.
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + " " + word;
    const width = ctx.measureText(testLine).width;

    if (width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  // 2. After all lines are wrapped, handle truncation if maxLines is set.
  if (maxLines && lines.length > maxLines) {
    // Trim the array to the max number of lines.
    lines = lines.slice(0, maxLines);

    // Get the last visible line and truncate it with "..."
    let lastLine = lines[maxLines - 1];
    const ellipsis = "...";

    // Keep removing the last word until the line + ellipsis fits.
    while (ctx.measureText(lastLine + ellipsis).width > maxWidth) {
      // Handle the edge case where even the first word is too long.
      if (!lastLine.includes(" ")) {
        lastLine = "";
        break;
      }
      lastLine = lastLine.substring(0, lastLine.lastIndexOf(" "));
    }

    // Update the last line in the array.
    lines[maxLines - 1] = lastLine.trim() + ellipsis;
  }

  // 3. Draw the final, correctly formatted lines.
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return lines;
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
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions for social media friendly aspect ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 1200 * dpr;
    canvas.height = 630 * dpr;
    canvas.style.width = "1200px";
    canvas.style.height = "630px";

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Enable text antialiasing for crisp text
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const currentTemper = TEMPER_CONFIG[temperLevel || 0];

    // Load the correct mascot image based on temperLevel
    const mascotImage = new Image();
    mascotImage.crossOrigin = "anonymous";

    let imageLoaded = false;
    let timeoutId;

    const drawCanvas = () => {
      try {
        // Create canvas background
        ctx.fillStyle = currentTemper.gradientColor;
        ctx.fillRect(0, 0, 1200, 630);

        // Add subtle pattern overlay
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < 1200; i += 40) {
          for (let j = 0; j < 630; j += 40) {
            if ((i + j) % 80 === 0) {
              ctx.fillRect(i, j, 2, 2);
            }
          }
        }

        // Add main content area with rounded rectangle
        const contentX = 80;
        const contentY = 80;
        const contentWidth = 1200 - 160;
        const contentHeight = 630 - 160;

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.roundRect(contentX, contentY, contentWidth, contentHeight, 20);
        ctx.fill();

        // Add shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;

        // Redraw the content area with shadow
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.roundRect(contentX, contentY, contentWidth, contentHeight, 20);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Draw mascot image with proper aspect ratio
        const mascotRadius = 40;
        const mascotCenterX = contentX + 40 + mascotRadius;
        const mascotCenterY = contentY + 40 + mascotRadius;

        drawImageInCircle(
          ctx,
          imageLoaded ? mascotImage : null,
          mascotCenterX,
          mascotCenterY,
          mascotRadius
        );

        const drawColorfulText = (ctx, text, x, y, font, colors) => {
          ctx.font = font;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";

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

        // Add "Shaaji" header - vertically centered with mascot
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const headerX = mascotCenterX + mascotRadius + 15;
        drawColorfulText(
          ctx,
          "Shaaji",
          headerX,
          mascotCenterY,
          "bold 36px Cal Sans, sans-serif",
          googleColors
        );

        // Calculate layout spacing with proper margins
        const queryStartY = contentY + 160;
        const maxQueryLines = 2;
        const lineHeight = 38;

        // Query text with line limit - bold
        ctx.font = "bold 28px Poppins, sans-serif";
        ctx.fillStyle = "#333";
        const queryLines = wrapText(
          ctx,
          query,
          contentX + 50,
          queryStartY,
          contentWidth - 100,
          lineHeight,
          maxQueryLines
        );

        // Calculate opinion start position with tighter spacing
        const opinionStartY =
          queryStartY +
          Math.min(queryLines.length, maxQueryLines) * lineHeight +
          25;

        // Calculate available space for opinion with margins
        const footerHeight = 80;
        const availableHeight =
          contentY + contentHeight - footerHeight - opinionStartY;
        const maxOpinionLines = Math.floor(availableHeight / 34);

        // Opinion text with proper margins and line limiting
        ctx.font = "26px Arial, sans-serif";
        ctx.fillStyle = "#333";

        const opinionLines = wrapText(
          ctx,
          opinion,
          contentX + 50,
          opinionStartY,
          contentWidth - 100,
          34,
          maxOpinionLines
        );

        // Add footer with generous margins
        const footerY = contentY + contentHeight - 50;
        ctx.fillStyle = "#999";
        ctx.font = "20px Poppins, sans-serif";
        ctx.letterSpacing = "-0.5px";
        ctx.textAlign = "left";
        ctx.fillText("Generated by Ask Shaaji", contentX + 50, footerY);

        // Add website attribution on the right with margin
        ctx.textAlign = "right";
        ctx.fillText(
          "https://ask-shaaji.vercel.app",
          contentX + contentWidth - 50,
          footerY
        );

        // Reset text alignment
        ctx.textAlign = "left";

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

    // Set timeout to proceed without image after 2 seconds
    timeoutId = setTimeout(() => {
      console.warn("Image loading timeout, proceeding without image");
      drawCanvas();
    }, 2000);

    // Use the correct image based on temperLevel and fix the path
    // Replace with your actual image path - this should work in your environment
    mascotImage.src = `/${currentTemper.img}`;
  });
}

const ShareButton = ({ query, opinion, temperLevel, isVisible }) => {
  const [isSharing, setIsSharing] = useState(false);
  const currentTemper = TEMPER_CONFIG[temperLevel];

  const handleShare = async () => {
    if (!query || !opinion || isSharing) return;

    setIsSharing(true);
    try {
      // Wait for the canvas to be properly generated
      const canvas = await generateShareImage(query, opinion, temperLevel);

      // Convert to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            console.error("Failed to generate image blob");
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
          setIsSharing(false);
        },
        "image/png",
        0.9
      );
    } catch (error) {
      console.error("Canvas generation error:", error);
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
      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
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
      <span className={`text-sm font-medium ${currentTemper.textColor}`}>
        {isSharing ? "Creating..." : "Share"}
      </span>
    </button>
  );
};

export default ShareButton;
