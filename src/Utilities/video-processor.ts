import axios from "axios";
import { detectVideoType } from "./download-video";

export async function processVideoUrl(
  url: string
): Promise<VideoProcessResponse> {
  console.log("Processing URL:", url);

  // Detect video type
  const videoType = detectVideoType(url);
  console.log("Detected video type:", videoType);

  if (!videoType) {
    throw new Error(
      "Unsupported video URL. Please use YouTube or TikTok links."
    );
  }

  try {
    if (videoType === "tiktok") {
      console.log("Processing as TikTok video");
      return await processTikTokVideo(url);
    } else {
      console.log("Processing as YouTube video");
      return await processYouTubeVideo(url);
    }
  } catch (error) {
    console.error("Error processing video:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const message = data?.message || error.message;
      throw new Error(`API Error (${status}): ${message}`);
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to process video. Please try again."
    );
  }
}

async function processTikTokVideo(url: string): Promise<VideoProcessResponse> {
  try {
    console.log("Calling TikTok API with URL:", url);
    const response = await axios.post("/api/tiktok", { url });
    console.log("TikTok API response:", response.status);

    const data = response.data as TikTokProcessResponse;

    if (
      !data ||
      !data.data ||
      !data.data.sources ||
      data.data.sources.length < 2
    ) {
      throw new Error("Invalid TikTok video data received");
    }

    // Extract video ID
    const videoIdMatch = url.match(/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : "unknown";

    const preparedUrl = data.data.sources[1].url;

    return {
      sourceType: "tiktok",
      data,
      preparedUrl,
      videoId,
    };
  } catch (error) {
    console.error("Error in processTikTokVideo:", error);
    throw error;
  }
}

async function processYouTubeVideo(url: string): Promise<VideoProcessResponse> {
  try {
    console.log("Calling YouTube API with URL:", url);

    const response = await axios.post("/api/youtube", {
      url,
      quality: "highest",
      format: "videoandaudio",
    });

    console.log("YouTube API response status:", response.status);

    const data = response.data;

    return {
      sourceType: "youtube",
      data,
      preparedUrl: data.downloadUrl,
      videoId: data.videoId || "",
      title: data.title || "",
    };
  } catch (error) {
    console.error("Error in processYouTubeVideo:", error);

    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("YouTube API request timed out. Please try again.");
    }

    if (axios.isAxiosError(error) && error.response?.status === 500) {
      const errorData = error.response.data;
      const message =
        errorData?.message || "Server error processing YouTube video";
      throw new Error(`YouTube API error: ${message}`);
    }

    throw error;
  }
}
