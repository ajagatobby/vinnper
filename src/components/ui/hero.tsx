"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatedSizeContainer } from "./animated-container-size";
import { Grid } from "./grid";
import { ArrowRight, Link2 } from "lucide-react";
import { Meteors } from "../magicui/meteors";
import { Ripple } from "../magicui/ripple";
import NumberFlow, { continuous, Value } from "@number-flow/react";
import { useCycle } from "@/hooks/use-cycle";
import { sleep } from "@/Utilities";
import VideoPlayer from "../video-player";

export default function HeroSection() {
  const ref = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      setSubmittedUrl(videoUrl);
      setShowVideo(true);
    }, 1500);
  };

  const handleReset = () => {
    setSubmittedUrl("");
    setShowVideo(false);
    setVideoUrl("");
  };

  // Counter states for all three stats
  const [downloadCount, setDownloadCount] = useState(240);
  const [percentageCount, setPercentageCount] = useState(70);
  const [qualityCount, setQualityCount] = useState(50);

  const maxDownloadCount = 20000;
  const maxPercentage = 100;
  const maxQuality = 4000;

  useEffect(() => {
    // Wait 1 second before starting the counters
    const startCounters = async () => {
      await sleep(1000);

      // Download counter
      const downloadTimer = setInterval(() => {
        setDownloadCount(() => {
          clearInterval(downloadTimer);
          return maxDownloadCount;
        });
      }, 100);

      // Percentage counter
      const percentageTimer = setInterval(() => {
        setPercentageCount(() => {
          clearInterval(percentageTimer);
          return maxPercentage;
        });
      }, 100);

      // Quality counter
      const qualityTimer = setInterval(() => {
        setQualityCount(() => {
          clearInterval(qualityTimer);
          return maxQuality;
        });
      }, 100);

      // Cleanup all intervals
      return () => {
        clearInterval(downloadTimer);
        clearInterval(percentageTimer);
        clearInterval(qualityTimer);
      };
    };

    let cleanup: (() => void) | undefined;
    startCounters().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-full overflow-x-hidden min-h-[90vh] flex flex-col items-center justify-center rounded-none px-2 sm:px-6 py-12 sm:py-20"
    >
      <Grid
        cellSize={80}
        patternOffset={[3, 4]}
        className="opacity-10 text-white/40 z-1 w-full"
      />

      <Ripple className="z-2 w-full overflow-hidden" />
      <Meteors number={10} className="z-1 hidden sm:block" />

      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl text-center mx-auto z-10 relative space-y-4 sm:space-y-6">
        {!showVideo ? (
          <>
            <div className="inline-block mb-2 sm:mb-4 animate-fade-in">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                Deep video research is coming soon 🎉
              </span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white animate-fade-in">
              Download from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                TikTok
              </span>{" "}
              <span className="sm:hidden">and</span>
              <span className="hidden sm:inline">and</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                YouTube
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg w-full sm:max-w-md mx-auto animate-fade-in">
              The simplest way to download videos without watermarks, ads, or
              restrictions.
            </p>

            {/* Input with integrated button for desktop, separate for mobile */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 sm:mt-10 animate-fade-in sm:w-full w-[95%] mx-auto"
            >
              <div className="relative w-full sm:max-w-md md:max-w-lg mx-auto group hover:scale-[1.01] transition-transform duration-200">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 blur group-hover:opacity-40 transition-opacity duration-200"></div>

                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste video link here..."
                  className="w-full py-3 px-4 sm:py-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-500 relative z-10 text-sm sm:text-base"
                  required
                />
                {/* Desktop button (hidden on mobile) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-white text-black text-sm font-medium rounded-md hover:bg-white/80 transition-all items-center gap-1.5 disabled:bg-white disabled:text-black z-10 hidden sm:flex"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-500"
                        xmlns="http://www.w3.org/2000/svg"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Searching</span>
                    </span>
                  ) : (
                    <>
                      <span>Search now</span>
                      <ArrowRight size={12} className="block" />
                    </>
                  )}
                </button>
              </div>

              {/* Mobile button (shown outside the input) */}
              <button
                type="submit"
                disabled={isLoading}
                className="sm:hidden w-full mt-3 py-3 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:bg-zinc-800 disabled:text-zinc-400 z-10"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-500"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Searching</span>
                  </span>
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Stats */}
            <div className="flex justify-center gap-4 sm:gap-10 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-800 text-xs sm:text-sm animate-fade-in">
              <div className="flex flex-col items-center group hover:-translate-y-1 transition-transform duration-300">
                <NumberFlow
                  className="text-xl xs:text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors"
                  value={downloadCount}
                  format={{ notation: "compact" }}
                  willChange
                  plugins={[continuous]}
                />
                <span className="text-zinc-500 mt-1 text-xs sm:text-sm">
                  Downloads
                </span>
              </div>
              <div className="flex flex-col items-center group hover:-translate-y-1 transition-transform duration-300">
                <NumberFlow
                  className="text-xl xs:text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors"
                  value={percentageCount}
                  format={{
                    style: "unit",
                    unit: "percent",
                    unitDisplay: "narrow",
                  }}
                  willChange
                  plugins={[continuous]}
                />
                <span className="text-zinc-500 mt-1 text-xs sm:text-sm">
                  Free
                </span>
              </div>
              <div className="flex flex-col items-center group hover:-translate-y-1 transition-transform duration-300">
                <NumberFlow
                  className="text-xl xs:text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors"
                  value={qualityCount}
                  format={{ notation: "standard" }}
                  willChange
                  plugins={[continuous]}
                />
                <span className="text-zinc-500 mt-1 text-xs sm:text-sm">
                  Quality
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-fade-in py-2 sm:py-4 w-full">
            <VideoPlayer url={submittedUrl} onClose={handleReset} />
          </div>
        )}
      </div>
    </div>
  );
}
