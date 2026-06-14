'use client';

import { useCallback, useState } from 'react';
import { SupportedFormat, ALLOWED_EXTENSIONS } from '@/types/conversion';
import { isValidExtension, isValidSize } from '@/utils/fileHelpers';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function UploadArea({ onFileSelect, selectedFile }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (!isValidExtension(file.name)) {
      setError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (!isValidSize(file.size)) {
      setError('File exceeds the 20MB size limit.');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
            : selectedFile
              ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20'
          }
        `}
      >
        <input
          type="file"
          accept={ALLOWED_EXTENSIONS.map((ext: SupportedFormat) => `.${ext}`).join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-3">
          {selectedFile ? (
            <>
              <div className="text-4xl">✅</div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024).toFixed(1)} KB — Click or drop to change file
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl">📁</div>
              <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
                Drag & drop your file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to browse
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Supported: {ALLOWED_EXTENSIONS.join(', ')} · Max 20MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-center">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}