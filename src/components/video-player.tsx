"use client";
import React, { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Download, X, RefreshCcw } from "lucide-react";

const VideoPlayer = ({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<"youtube" | "tiktok" | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  // Ref for the modal content
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url) {
      setError("Please provide a valid URL");
      setLoading(false);
      return;
    }

    // Extract video type and ID
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
      } else if (url.includes("tiktok.com")) {
        setVideoType("tiktok");

        // Extract TikTok video ID
        const tiktokMatch = url.match(/video\/(\d+)/);
        if (!tiktokMatch || !tiktokMatch[1]) {
          throw new Error("Could not extract TikTok video ID");
        }

        setVideoId(tiktokMatch[1]);
      } else {
        throw new Error(
          "Unsupported video platform. Please use YouTube or TikTok URLs"
        );
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid URL format");
      setLoading(false);
    }
  }, [url]);

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

  const handleDownload = () => {
    // Implement actual download logic here
    alert(`Starting download for ${videoType} video: ${videoId}`);
  };

  const renderVideoPlayer = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-zinc-900 rounded-lg">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                {videoId ? `Video ID: ${videoId}` : "Loading video..."}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-md hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center"
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

        {/* Optional: Small helper text */}
        <div className="text-center mt-4 text-zinc-500 text-sm">
          Click outside or press ESC to close
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
