"use client";
import React, { useEffect, useState, useRef } from "react";
import { Download, X, RefreshCcw } from "lucide-react";
import { downloadVideo, downloadYTVideo } from "@/Utilities/download-video";

interface VideoPlayerProps {
  url: string;
  preparedUrl: string;
  onClose: () => void;
  videoType: "youtube" | "tiktok" | null;
  videoId: string | null;
  videoTitle?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  preparedUrl,
  onClose,
  videoType: initialVideoType,
  videoId: initialVideoId,
  videoTitle,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<"youtube" | "tiktok" | null>(
    initialVideoType
  );
  const [videoId, setVideoId] = useState<string | null>(initialVideoId);
  const [resolvingTikTok, setResolvingTikTok] = useState(false);

  // Ref for the modal content
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Function to resolve TikTok short URLs
  const resolveTikTokShortUrl = async (shortUrl: string) => {
    try {
      setResolvingTikTok(true);
      // Call our API endpoint to resolve the TikTok URL
      const response = await fetch(
        `/api/resolve-tiktok?url=${encodeURIComponent(shortUrl)}`
      );
      const data = await response.json();

      if (data.videoId) {
        setVideoId(data.videoId);
        setResolvingTikTok(false);
        return true;
      } else {
        throw new Error("Could not extract TikTok video ID");
      }
    } catch (err) {
      console.error("Error resolving TikTok URL:", err);
      setError("Could not resolve TikTok video URL");
      setResolvingTikTok(false);
      return false;
    }
  };

  useEffect(() => {
    if (!url) {
      setError("Please provide a valid URL");
      setLoading(false);
      return;
    }

    // If videoType and videoId are already provided (from parent), use them
    if (initialVideoType && initialVideoId) {
      setVideoType(initialVideoType);
      setVideoId(initialVideoId);
      setLoading(false);
      return;
    }

    // Otherwise, extract video type and ID
    try {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        setVideoType("youtube");

        // Extract YouTube video ID
        let id = "";
        if (url.includes("youtube.com/watch?v=")) {
          id = url.split("v=")[1]?.split("&")[0] || "";
        } else if (url.includes("youtu.be/")) {
          id = url.split("youtu.be/")[1]?.split("?")[0] || "";
        } else if (url.includes("youtube.com/shorts/")) {
          // Handle YouTube Shorts URLs
          id = url.split("shorts/")[1]?.split("?")[0] || "";
        }

        if (!id) {
          throw new Error("Could not extract YouTube video ID");
        }

        setVideoId(id);
        setLoading(false);
      } else if (url.includes("tiktok.com")) {
        setVideoType("tiktok");

        // Handle TikTok URL formats
        if (url.includes("vm.tiktok.com") || !url.includes("/video/")) {
          // For short URLs, we need to resolve them first
          // Set loading to true and will resolve in another effect
          setResolvingTikTok(true);
        } else {
          // Extract TikTok video ID for regular tiktok.com URLs
          const tiktokMatch = url.match(/video\/(\d+)/);
          if (!tiktokMatch || !tiktokMatch[1]) {
            throw new Error("Could not extract TikTok video ID");
          }
          setVideoId(tiktokMatch[1]);
          setLoading(false);
        }
      } else {
        throw new Error(
          "Unsupported video platform. Please use YouTube or TikTok URLs"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid URL format");
      setLoading(false);
    }
  }, [url, initialVideoType, initialVideoId]);

  // Effect to resolve TikTok short URLs
  useEffect(() => {
    if (videoType === "tiktok" && resolvingTikTok) {
      const resolveUrl = async () => {
        const success = await resolveTikTokShortUrl(url);
        if (!success) {
          setError("Could not resolve TikTok URL");
        }
        setLoading(false);
      };

      resolveUrl();
    }
  }, [videoType, resolvingTikTok, url]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Add escape key handler
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  const handleDownload = async () => {
    if (!preparedUrl) {
      setError("Download URL not available");
      return;
    }

    // Create filename based on video type and ID
    let filename = "";
    if (videoType === "youtube" && videoTitle) {
      // Use video title for YouTube
      filename = `${videoTitle.replace(/[^\w\s]/gi, "_")}.mp4`;
    } else if (videoType === "youtube" && videoId) {
      filename = `youtube_${videoId}.mp4`;
    } else if (videoType === "tiktok" && videoId) {
      filename = `tiktok_${videoId}.mp4`;
    } else {
      filename = `video_${Date.now()}.mp4`;
    }

    // Download the video
    if (videoType === "youtube") {
      downloadYTVideo(preparedUrl, filename);
    } else {
      downloadVideo(preparedUrl, filename);
    }
  };

  const renderVideoPlayer = () => {
    if (loading || resolvingTikTok) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-zinc-900 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            {resolvingTikTok && (
              <p className="text-zinc-300">Resolving TikTok URL...</p>
            )}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-900 rounded-lg p-6 text-center">
          <span className="text-red-500 text-xl mb-2">Error</span>
          <p className="text-zinc-300">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md flex items-center"
          >
            <RefreshCcw size={16} className="mr-2" />
            Try Another URL
          </button>
        </div>
      );
    }

    if (videoType === "youtube" && videoId) {
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === "tiktok" && videoId) {
      return (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      );
    }

    return (
      <div className="flex items-center justify-center w-full h-full bg-zinc-900 rounded-lg">
        <p className="text-zinc-300">No video to display</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div
        ref={modalContentRef}
        className="w-full max-w-4xl mx-auto animate-fade-in scale-100"
      >
        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-xl border border-zinc-800">
          {/* Video header with platform indicator */}
          <div className="px-4 py-3 bg-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {videoType === "youtube" && (
                <span className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded-md">
                  YouTube
                </span>
              )}
              {videoType === "tiktok" && (
                <span className="px-2 py-1 text-xs font-medium bg-black text-white rounded-md flex items-center">
                  <span className="mr-1">TikTok</span>
                </span>
              )}
              <h3 className="text-white hidden sm:flex text-sm font-medium truncate max-w-md">
                {videoTitle
                  ? videoTitle
                  : videoId
                  ? `Video ID: ${videoId}`
                  : "Loading video..."}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-md hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center"
                disabled={!preparedUrl}
              >
                <Download size={16} className="mr-2" />
                Download video
              </button>
              <button
                onClick={onClose}
                className="text-zinc-300 hover:text-white p-1.5 rounded-full hover:bg-zinc-700 transition-colors"
                title="Close video"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Video container */}
          <div className="aspect-video relative bg-black">
            {renderVideoPlayer()}
          </div>
        </div>

        <div className="text-center mt-4 text-zinc-500 text-sm">
          Click outside or press ESC to close
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
