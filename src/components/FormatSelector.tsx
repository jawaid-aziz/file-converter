"use client";

import { SupportedFormat, CONVERSION_MAP } from "@/types/conversion";
import { getFileExtension } from "@/utils/fileHelpers";

interface FormatSelectorProps {
  selectedFile: File | null;
  targetFormat: SupportedFormat | null;
  onFormatSelect: (format: SupportedFormat) => void;
}

const FORMAT_META: Record<SupportedFormat, string> = {
  docx: "Word",
  md: "Markdown",
  pdf: "PDF",
  html: "HTML",
  txt: "Plain text",
  csv: "CSV",
  json: "JSON",
};

export default function FormatSelector({
  selectedFile,
  targetFormat,
  onFormatSelect,
}: FormatSelectorProps) {
  if (!selectedFile) return null;

  const sourceFormat = getFileExtension(selectedFile.name) as SupportedFormat;
  const availableFormats = CONVERSION_MAP[sourceFormat] ?? [];

  if (availableFormats.length === 0) {
    return (
      <p className="text-xs text-zinc-400 dark:text-zinc-500 py-2">
        No conversions available for .{sourceFormat} files.
      </p>
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-widest font-medium">
        .{sourceFormat} → convert to
      </p>
      <div className="flex flex-wrap gap-2">
        {availableFormats.map((format) => {
          const isSelected = targetFormat === format;
          return (
            <button
              key={format}
              onClick={() => onFormatSelect(format)}
              className={`
                group flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-all duration-150
                ${
                  isSelected
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }
              `}
            >
              <span className="text-sm font-bold font-mono tracking-wide">
                .{format.toUpperCase()}
              </span>
              <span
                className={`text-xs mt-0.5 ${isSelected ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400 dark:text-zinc-600"}`}
              >
                {FORMAT_META[format]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
