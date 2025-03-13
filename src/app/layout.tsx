import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Ripple from "@/components/magicui/ripple";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinnper",
  description: "Download YouTube and TikTok videos in one click!",
  openGraph: {
    title: "Vinnper - Download Videos Without Watermarks",
    description:
      "Free tool to download YouTube and TikTok videos without watermarks in one click!",
    images: [
      {
        url: "https://a6mey415ct.ufs.sh/f/rbcyNovH7ibJdyu4eIfEhRMrfZdwDtCscFOv0KYbP46e8gSk",
        width: 1200,
        height: 630,
        alt: "Vinnper - Download videos without watermarks",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinnper - Download Videos Without Watermarks",
    description:
      "Free tool to download YouTube and TikTok videos without watermarks in one click!",
    images: [
      "https://a6mey415ct.ufs.sh/f/rbcyNovH7ibJdyu4eIfEhRMrfZdwDtCscFOv0KYbP46e8gSk",
    ],
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* Additional meta tags can be added here if needed */}</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <Toaster
          richColors
          closeButton
          expand
          position="bottom-center"
          theme="dark"
        />
        <Ripple className="z-2 w-full overflow-hidden" />

        <div className="w-full mx-auto min-h-screen bg-black">{children}</div>
      </body>
    </html>
  );
}
