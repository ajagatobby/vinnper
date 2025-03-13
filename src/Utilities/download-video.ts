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
  const randomFilename = `${generateRandomFilename()}.mp4`;

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = randomFilename;
  a.target = "_blank";

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
