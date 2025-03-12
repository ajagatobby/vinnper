import HeroSection from "@/components/ui/hero";
import { constructMetadata } from "@/Utilities";
import React from "react";

export const runtime = "edge";

export function generateMetadata() {
  const title = `Home`;
  const description = `Download videos from YouTube and TikTok without waiting for ads.`;

  return constructMetadata({
    title,
    description,
    url: process.env.NEXT_PUBLIC_APP_DOMAIN,
  });
}

export default function page() {
  return (
    <div className="relative z-10">
      <HeroSection />
    </div>
  );
}
