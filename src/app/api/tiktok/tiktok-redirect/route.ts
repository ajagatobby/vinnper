import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Get the final URL after redirects
    const finalUrl = response.url;

    // Extract the video ID from the final URL
    const videoIdMatch = finalUrl.match(/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return NextResponse.json({
      originalUrl: url,
      finalUrl,
      videoId,
    });
  } catch (error) {
    console.error("Error following TikTok redirect:", error);
    return NextResponse.json(
      { error: "Failed to follow redirect" },
      { status: 500 }
    );
  }
}
