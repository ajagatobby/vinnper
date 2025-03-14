import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import FormData from "form-data";

export const maxDuration = 300;

class SnapTikService {
  private readonly baseURL: string = "https://dev.snaptik.app";

  private createResource(url: string, index: number): Resource {
    return { url, index };
  }

  private async getToken(): Promise<string> {
    try {
      const response = await axios.get(this.baseURL);
      const $ = cheerio.load(response.data);
      return $('input[name="token"]').val() as string;
    } catch (error) {
      throw new Error("Failed to get token");
    }
  }

  private async getScript(url: string): Promise<string> {
    try {
      const token = await this.getToken();
      const form = new FormData();
      form.append("token", token);
      form.append("url", url);

      const response = await axios.post(`${this.baseURL}/abc2.php`, form);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get script");
    }
  }

  private async evalScript(
    script1: string
  ): Promise<{ html: string; oembed_url: string }> {
    return new Promise((resolve, reject) => {
      let html = "";
      const mockWindow = {
        $: () => ({
          remove() {},
          style: { display: "" },
          set innerHTML(t: string) {
            html = t;
          },
        }),
        app: {
          showAlert: reject,
        },
        document: {
          getElementById: () => ({
            src: "",
          }),
        },
        fetch: (a: string) => {
          resolve({ html, oembed_url: a });
          return {
            json: () => ({
              thumbnail_url: "",
            }),
          };
        },
        gtag: () => 0,
        Math: {
          round: () => 0,
        },
        XMLHttpRequest: function () {
          return {
            open() {},
            send() {},
          };
        },
        window: {
          location: {
            hostname: "snaptik.app",
          },
        },
      };

      const keys = Object.keys(mockWindow);
      const values = Object.values(mockWindow);

      try {
        new Function("eval", script1)((script2: string) => {
          Function(...keys, script2)(...values);
        });
      } catch (error) {
        reject(new Error("Script evaluation failed"));
      }
    });
  }

  private async getHdVideo(token: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.baseURL}/getHdLink.php?token=${token}`
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data.url;
    } catch (error) {
      throw new Error("Failed to get HD video");
    }
  }

  private async parseHtml(html: string): Promise<Omit<ProcessResponse, "url">> {
    const $ = cheerio.load(html);
    const isVideo = !$("div.render-wrapper").length;

    if (isVideo) {
      const hdToken = $("div.video-links > button[data-tokenhd]").data(
        "tokenhd"
      );
      const hdUrl = new URL(await this.getHdVideo(hdToken as string));
      const token = hdUrl.searchParams.get("token");
      if (!token) {
        throw Error("No token was found!");
      }
      const { url } = JSON.parse(
        Buffer.from(
          token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
          "base64"
        ).toString()
      );

      const sources = [
        url,
        hdUrl.href,
        ...$('div.video-links > a:not(a[href="/"])')
          .toArray()
          .map((elem) => $(elem).attr("href"))
          .map((x) => (x && x.startsWith("/") ? this.baseURL + x : x)),
      ].map((url, index) => this.createResource(url, index));

      return {
        type: "video",
        data: { sources },
      };
    }

    const photos = $("div.columns > div.column > div.photo")
      .toArray()
      .map((elem) => ({
        sources: [
          $(elem).find('img[alt="Photo"]').attr("src"),
          $(elem)
            .find('a[data-event="download_albumPhoto_photo"]')
            .attr("href"),
        ].map((url, index) => this.createResource(url as string, index)),
      }));

    if (photos.length === 1) {
      return {
        type: "photo",
        data: {
          sources: photos[0].sources,
        },
      };
    }

    return {
      type: "slideshow",
      data: {
        sources: photos.flatMap((photo) => photo.sources),
      },
    };
  }

  public async process(url: string): Promise<ProcessResponse> {
    try {
      const script = await this.getScript(url);
      const { html, oembed_url } = await this.evalScript(script);
      const result = await this.parseHtml(html);

      return {
        ...result,
        url,
        data: {
          ...result.data,
          oembed_url,
        },
      };
    } catch (error) {
      throw new Error("Failed to process URL");
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const snapTikService = new SnapTikService();
    const result = await snapTikService.process(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
