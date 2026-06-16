import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "File Converter",
  description:
    "Convert files instantly between formats. No sign-up, no storage, no ads. Fast, private, and free.",
  keywords: [
    "file converter",
    "docx to markdown",
    "markdown to pdf",
    "csv to json",
    "json to csv",
    "html to markdown",
  ],
  authors: [{ name: "File Converter" }],
  icons: {
    icon: [
      {
        url: "/logo-dark.png", // shown on light bg (browser chrome is usually light)
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-light.png", // shown on dark bg
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/logo-dark.png", // Apple touch icons are always on white, so use dark logo
  },
  openGraph: {
    title: "File Converter",
    description: "Convert files instantly. No sign-up. No storage. No ads.",
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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}