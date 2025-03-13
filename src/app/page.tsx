import { Twitter } from "@/components";
import NativeRedirectPermission from "@/components/native-redirect";
import HeroSection from "@/components/ui/hero";
import { constructMetadata } from "@/Utilities";
import { GithubIcon } from "lucide-react";
import { Viewport } from "next";
import Link from "next/link";
import React from "react";

export const runtime = "edge";

export function generateMetadata() {
  const title = `Home`;
  const description = `Download videos from YouTube and TikTok without waiting for ads.`;

  return constructMetadata({
    title,
    description,
    url: "https://a6mey415ct.ufs.sh/f/rbcyNovH7ibJdyu4eIfEhRMrfZdwDtCscFOv0KYbP46e8gSk",
  });
}

export const viewport: Viewport = {
  themeColor: "#000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function page() {
  return (
    <div className="relative z-10">
      <div className="w-full justify-between items-center mx-auto flex max-w-lg py-4 sm:px-0 px-10">
        <Link href={"/"}>
          <h1 className="text-2xl text-white tracking-tighter font-bold select-none cursor-pointer">
            Vinnper.
          </h1>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link
            href="https://x.com/ajaga_abdbasit/status/1900002102773977472"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-5 h-5 relative z-40" color="#fff" />
          </Link>
        </div>
      </div>
      <HeroSection />
    </div>
  );
}
