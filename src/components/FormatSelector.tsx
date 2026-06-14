'use client';

import { SupportedFormat, CONVERSION_MAP } from '@/types/conversion';
import { getFileExtension } from '@/utils/fileHelpers';

interface FormatSelectorProps {
  selectedFile: File | null;
  targetFormat: SupportedFormat | null;
  onFormatSelect: (format: SupportedFormat) => void;
}

export default function FormatSelector({ selectedFile, targetFormat, onFormatSelect }: FormatSelectorProps) {
  if (!selectedFile) return null;

  const sourceFormat = getFileExtension(selectedFile.name) as SupportedFormat;
  const availableFormats = CONVERSION_MAP[sourceFormat] ?? [];

  if (availableFormats.length === 0) {
    return (
      <div className="w-full p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 text-center">
        <p className="text-yellow-700 dark:text-yellow-400 text-sm">
          ⚠️ No conversions available for <strong>.{sourceFormat}</strong> files.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
        Convert <span className="font-bold text-blue-600 dark:text-blue-400">.{sourceFormat}</span> to:
      </p>
      <div className="flex flex-wrap gap-3">
        {availableFormats.map((format) => (
          <button
            key={format}
            onClick={() => onFormatSelect(format)}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150
              ${targetFormat === format
                ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
              }
            `}
          >
            .{format.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}