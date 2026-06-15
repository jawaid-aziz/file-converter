"use client";

import { useCallback, useState } from "react";
import { SupportedFormat, ALLOWED_EXTENSIONS } from "@/types/conversion";
import { isValidExtension, isValidSize } from "@/utils/fileHelpers";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

function UploadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

export default function UploadArea({
  onFileSelect,
  selectedFile,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!isValidExtension(file.name)) {
        setError(
          `Unsupported format. Accepted: ${ALLOWED_EXTENSIONS.join(", ")}`,
        );
        return;
      }
      if (!isValidSize(file.size)) {
        setError("File exceeds the 20 MB limit.");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-zinc-400 dark:border-zinc-500 bg-zinc-50 dark:bg-zinc-800/60"
              : selectedFile
                ? "border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/30"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900"
          }
        `}
      >
        <input
          type="file"
          accept={ALLOWED_EXTENSIONS.map(
            (ext: SupportedFormat) => `.${ext}`,
          ).join(",")}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 pointer-events-none">
          {selectedFile ? (
            <>
              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                <FileIcon />
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB · click to replace
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                <UploadIcon />
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Drop a file or{" "}
                  <span className="underline underline-offset-2">browse</span>
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                  {ALLOWED_EXTENSIONS.map((e) => `.${e}`).join("  ")} · max 20
                  MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
          <svg
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
        </p>
      )}
    </div>
  );
}
