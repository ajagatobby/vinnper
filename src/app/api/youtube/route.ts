import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import ytdl from "ytdl-core";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const {
      url,
      quality = "highest",
      format = "videoandaudio",
    } = await request.json();

    console.log("Processing YouTube URL:", url);

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    console.log("Getting video info for:", url);

    const info = (await Promise.race([
      ytdl.getInfo(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout after 15s")), 15000)
      ),
    ])) as ytdl.videoInfo;

    console.log("Successfully retrieved video info");

    const videoTitle = info.videoDetails.title;
    const sanitizedTitle = videoTitle.replace(/[^\w\s]/gi, "_");
    const videoId = info.videoDetails.videoId;
    const thumbnailUrl = info.videoDetails.thumbnails[0]?.url;

    const downloadUrl = `/api/youtube/download?url=${encodeURIComponent(
      url
    )}&quality=${quality}&format=${format}&title=${encodeURIComponent(
      sanitizedTitle
    )}`;

    return NextResponse.json({
      title: videoTitle,
      videoId,
      thumbnailUrl,
      length: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      downloadUrl,
    });
  } catch (error) {
    console.error("Error processing YouTube URL:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error(error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to process YouTube video",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
