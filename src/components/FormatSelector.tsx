'use client';

import { SupportedFormat, CONVERSION_MAP } from '@/types/conversion';
import { getFileExtension } from '@/utils/fileHelpers';

interface FormatSelectorProps {
  selectedFile: File | null;
  targetFormat: SupportedFormat | null;
  onFormatSelect: (format: SupportedFormat) => void;
}

const FORMAT_LABELS: Record<SupportedFormat, { label: string; description: string }> = {
  docx: { label: 'DOCX', description: 'Word Document' },
  md:   { label: 'MD',   description: 'Markdown' },
  pdf:  { label: 'PDF',  description: 'PDF Document' },
  html: { label: 'HTML', description: 'Web Page' },
  txt:  { label: 'TXT',  description: 'Plain Text' },
  csv:  { label: 'CSV',  description: 'Spreadsheet' },
  json: { label: 'JSON', description: 'JSON Data' },
};

export default function FormatSelector({ selectedFile, targetFormat, onFormatSelect }: FormatSelectorProps) {
  if (!selectedFile) return null;

  const sourceFormat = getFileExtension(selectedFile.name) as SupportedFormat;
  const availableFormats = CONVERSION_MAP[sourceFormat] ?? [];

  if (availableFormats.length === 0) {
    return (
      <div className="w-full p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-amber-700 dark:text-amber-400 text-sm text-center">
          No conversions available for <strong>.{sourceFormat}</strong> files.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        Convert <span className="text-violet-600 dark:text-violet-400">.{sourceFormat}</span> →
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {availableFormats.map((format) => {
          const meta = FORMAT_LABELS[format];
          const isSelected = targetFormat === format;
          return (
            <button
              key={format}
              onClick={() => onFormatSelect(format)}
              className={`
                flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-center transition-all duration-150
                ${isSelected
                  ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/40 scale-105'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400'
                }
              `}
            >
              <span className="text-sm font-bold font-mono">.{meta.label}</span>
              <span className={`text-[10px] ${isSelected ? 'text-violet-200' : 'text-gray-400 dark:text-gray-500'}`}>
                {meta.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}