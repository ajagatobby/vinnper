import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Ripple from "@/components/magicui/ripple";
import { Toaster } from "sonner";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
