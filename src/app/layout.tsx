import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/client-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arjun | Web Developer & Mentor | arjundev.in",
  description: "Helping people build careers through practical web development, WordPress, Shopify, AI, and digital skills while documenting my journey publicly.",
  keywords: ["Arjun", "arjundev.in", "Web Developer", "WordPress Mentor", "Shopify Developer", "Career Transitions", "Learn Coding"],
  authors: [{ name: "Arjun", url: "https://arjundev.in" }],
  openGraph: {
    title: "Arjun | Web Developer & Mentor | arjundev.in",
    description: "I wasn't born into tech. I built my career one step at a time. Now I help others build theirs.",
    url: "https://arjundev.in",
    siteName: "Arjun's Brand Experience",
    locale: "en_US",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

