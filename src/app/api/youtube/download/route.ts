import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import ytdl from "ytdl-core";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const quality = searchParams.get("quality") || "highest";
    const format = searchParams.get("format") || "videoandaudio";
    const title = searchParams.get("title") || "youtube_video";

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    await redis.hset("counts", { url: request.url });

    console.log(
      `Starting download: ${title}, format: ${format}, quality: ${quality}`
    );

    // Setup download options
    const options: ytdl.downloadOptions = {
      quality: quality as ytdl.chooseFormatQuality,
    };

    if (format === "audioonly") {
      options.filter = "audioonly";
    }

    const extension = format === "audioonly" ? "mp3" : "mp4";
    const contentType = format === "audioonly" ? "audio/mpeg" : "video/mp4";
    const filename = `${title}.${extension}`;

    const stream = ytdl(url, options);

    const readableStream = new ReadableStream<Uint8Array>({
      start(controller) {
        stream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (err: Error) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    // Return streaming response
    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error downloading YouTube content:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error(error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to download video",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
