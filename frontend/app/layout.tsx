import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnScript — Turn YouTube Lectures Into Smart Study Notes",
  description:
    "Generate AI-powered notes, cheat sheets, code examples, and visual learning aids from any YouTube lecture in seconds. Built for students, developers, and interview prep.",
  keywords: ["AI notes", "YouTube lecture", "study notes", "cheat sheet", "machine learning", "Python", "student tools"],
  openGraph: {
    title: "LearnScript — Smart Study Notes from YouTube",
    description: "Turn any YouTube lecture into structured notes in seconds.",
    type: "website",
    url: "https://learnscript.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
