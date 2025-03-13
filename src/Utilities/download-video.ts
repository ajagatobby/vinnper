// Function to generate a random 8-character alphanumeric string
function generateRandomFilename(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function downloadVideo(url: string, filename?: string): void {
  // Generate a random 8-character filename if none is provided
  const randomFilename = `${generateRandomFilename()}.mp4`;

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url; // Direct link to the video
  a.download = filename || randomFilename; // Use random filename instead of extracting from URL
  a.target = "_blank"; // Open in new tab as fallback

  // Add to DOM, trigger click, and remove
  document.body.appendChild(a);
  a.click();

  // Cleanup after click
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);

  console.log("Download triggered for:", url, "with filename:", a.download);
}

export function downloadYTVideo(url: string, filename?: string): void {
  console.log("Starting download:", url);

  // Generate a random 8-character filename if none is provided
  const randomFilename = `${generateRandomFilename()}.mp4`;

  if (url.startsWith("/api/youtube/download")) {
    window.open(url, "_blank");
    return;
  }

  // For direct downloads (like TikTok)
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename || randomFilename; // Use random filename instead of extracting from URL

  // Add to DOM, trigger click, and remove
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);

  console.log("Download triggered for:", url, "with filename:", a.download);
}

// This function is kept for backward compatibility but no longer used by the download functions
function getFilenameFromUrl(url: string): string {
  // Try to extract YouTube or TikTok ID for filename
  try {
    const urlObj = new URL(url);

    // Check for direct video file extensions
    if (url.match(/\.(mp4|webm|mov)($|\?)/i)) {
      const parts = urlObj.pathname.split("/");
      const filename = parts[parts.length - 1].split("?")[0];
      return filename;
    }

    // For TikTok downloads
    if (url.includes("tiktok")) {
      const match = url.match(/video\/(\d+)/);
      if (match && match[1]) {
        return `tiktok_${match[1]}.mp4`;
      }
    }

    // For YouTube downloads
    if (url.includes("youtube") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      }

      if (videoId) {
        return `youtube_${videoId}.mp4`;
      }
    }

    // Default filename with timestamp
    return `video_${Date.now()}.mp4`;
  } catch (e) {
    // Fallback filename if URL parsing fails
    return `video_${Date.now()}.mp4`;
  }
}

export function detectVideoType(url: string): "youtube" | "tiktok" | null {
  if (!url) return null;

  try {
    // YouTube detection
    if (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/") ||
      url.includes("youtube.com/shorts/")
    ) {
      return "youtube";
    }

    // TikTok detection
    if (url.includes("tiktok.com")) {
      return "tiktok";
    }

    // Unsupported URL
    return null;
  } catch (e) {
    console.error("Error detecting video type:", e);
    return null;
  }
}

export function extractVideoId(
  url: string,
  type: "youtube" | "tiktok"
): string | null {
  try {
    if (type === "youtube") {
      // Extract YouTube video ID
      let id = "";
      if (url.includes("youtube.com/watch?v=")) {
        id = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("youtu.be/")) {
        id = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("youtube.com/shorts/")) {
        id = url.split("shorts/")[1]?.split("?")[0] || "";
      }
      return id || null;
    } else if (type === "tiktok") {
      // Extract TikTok video ID
      const tiktokMatch = url.match(/video\/(\d+)/);
      return tiktokMatch && tiktokMatch[1] ? tiktokMatch[1] : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting video ID:", e);
    return null;
  }
}
