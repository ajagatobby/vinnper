import { Metadata } from "next";

function constructMetadata({
  title = "Default Title",
  fullTitle,
  description = "Default description",
  image = null,
  video = null,
  icons,
  url,
  canonicalUrl,
  noIndex = false,
  manifest = null,
  siteName = "",
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
  siteName?: string;
} = {}): Metadata {
  const metaTitle =
    fullTitle || `${title} | ${process.env.NEXT_PUBLIC_APP_NAME || siteName}`;

  const metadata: Metadata = {
    title: metaTitle,
    description: description,
    openGraph: {
      title: metaTitle,
      description: description,
      ...(url && { url }),
      ...(image && { images: [{ url: image }] }),
      ...(video && { videos: [{ url: video }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: description,
      ...(image && { images: [image] }),
    },
    ...(icons && { icons }),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && { manifest }),
  };

  return metadata;
}

export { constructMetadata };
