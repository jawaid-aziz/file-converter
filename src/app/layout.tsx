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
  description: "Convert files instantly between formats. No sign-up, no storage, no ads. Fast, private, and free.",
  keywords: ["file converter", "docx to markdown", "markdown to pdf", "csv to json", "json to csv", "html to markdown"],
  authors: [{ name: "Universal File Converter" }],
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