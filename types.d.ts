interface Resource {
  index: number;
  url: string;
}

interface ProcessResponse {
  type: "video" | "photo" | "slideshow";
  data: {
    sources: Resource[];
    photos?: Array<{ sources: Resource[] }>;
    oembed_url?: string;
  };
  url: string;
}

interface TikTokProcessResponse {
  type: "video" | "photo" | "slideshow";
  data: {
    sources: Array<{
      url: string;
      index: number;
    }>;
    oembed_url?: string;
  };
  url: string;
}

interface YouTubeProcessResponse {
  title: string;
  videoId: string;
  thumbnailUrl?: string;
  length?: string;
  author?: string;
  downloadUrl: string;
}

type VideoProcessResponse = {
  sourceType: "youtube" | "tiktok";
  data: TikTokProcessResponse | YouTubeProcessResponse;
  preparedUrl: string;
  videoId: string;
  title?: string;
};
