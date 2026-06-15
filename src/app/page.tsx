"use client";

import { useState, useCallback } from "react";
import { SupportedFormat, CONVERSION_MAP } from "@/types/conversion";
import { getOutputFileName, getFileExtension } from "@/utils/fileHelpers";
import UploadArea from "@/components/UploadArea";
import FormatSelector from "@/components/FormatSelector";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";

const ALL_CONVERSIONS = Object.entries(CONVERSION_MAP).flatMap(
  ([from, targets]) =>
    (targets as SupportedFormat[]).map((to) => ({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
    })),
);

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat | null>(
    null,
  );
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setTargetFormat(null);
    setDownloadUrl(null);
    setOutputFileName(null);
    setError(null);
  }, []);

  const handleFormatSelect = useCallback((format: SupportedFormat) => {
    setTargetFormat(format);
    setDownloadUrl(null);
    setOutputFileName(null);
    setError(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!selectedFile || !targetFormat) return;
    setIsConverting(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("targetFormat", targetFormat);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Conversion failed.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const fileName = getOutputFileName(selectedFile.name, targetFormat);
      setDownloadUrl(url);
      setOutputFileName(fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, targetFormat]);

  const handleReset = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setSelectedFile(null);
    setTargetFormat(null);
    setDownloadUrl(null);
    setOutputFileName(null);
    setError(null);
  }, [downloadUrl]);

  const sourceFormat = selectedFile
    ? (getFileExtension(selectedFile.name) as SupportedFormat)
    : null;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-5 h-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  className="dark:stroke-zinc-900"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                file-converter
              </span>
            </div>
            <button
              onClick={() => setDarkMode((p) => !p)}
              className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-150 flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-2xl mx-auto px-5 pt-24 pb-20">
          {/* Hero */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              Convert files between formats
            </h1>
            <p className="mt-2 text-base text-zinc-400 dark:text-zinc-500">
              No account. No storage. Processed in memory, gone when you are
              done.
            </p>
          </div>

          {/* Converter */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            {/* Upload */}
            <UploadArea
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />

            {/* Format selector */}
            {selectedFile && (
              <div className="animate-[slide-up_0.2s_ease-out]">
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-5" />
                <FormatSelector
                  selectedFile={selectedFile}
                  targetFormat={targetFormat}
                  onFormatSelect={handleFormatSelect}
                />
              </div>
            )}

            {/* Convert button */}
            {selectedFile && targetFormat && !downloadUrl && (
              <div className="animate-[slide-up_0.2s_ease-out]">
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full h-11 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-base font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {isConverting ? (
                    <span className="text-xs font-mono animate-pulse">
                      converting…
                    </span>
                  ) : (
                    <>
                      <span>
                        {sourceFormat?.toUpperCase()} to{" "}
                        {targetFormat.toUpperCase()}
                      </span>
                      <ArrowIcon />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Progress */}
            <ProgressBar isConverting={isConverting} />

            {/* Error */}
            {error && (
              <div className="animate-[fade-in_0.2s_ease-out] flex items-start gap-2 text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2.5">
                <svg
                  className="mt-0.5 flex-shrink-0"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Download */}
            <DownloadButton
              downloadUrl={downloadUrl}
              fileName={outputFileName}
              onReset={handleReset}
            />
          </div>

          {/* Supported formats */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-300 dark:text-zinc-600 mb-3">
              Supported conversions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CONVERSIONS.map(({ from, to }) => (
                <span
                  key={`${from}-${to}`}
                  className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                >
                  {from}
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  {to}
                </span>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-5 h-9 flex items-center justify-between">
            <span className="text-xs text-zinc-300 dark:text-zinc-600">
              Files are never stored
            </span>
            <span className="text-xs text-zinc-300 dark:text-zinc-600">
              Built by{" "}
              <a
                href="https://jawaid-aziz.framer.website/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors duration-150"
              >
                Jawaid Aziz
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
