import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "RedditGPT™ — LLM-ify Your Reddit Comments",
  description:
    "Transform any Reddit comment into a hyper-enthusiastic, emoji-saturated, aggressively helpful LLM response. No AI harmed in this process. Happy April Fools! 🤖✨",
  openGraph: {
    title: "RedditGPT™ — LLM-ify Your Reddit Comments",
    description:
      "Transform any Reddit comment into a hyper-enthusiastic, emoji-saturated, aggressively helpful LLM response. 🤖✨",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
