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
      setError('File exceeds the 20 MB limit.');
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

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

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
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 scale-[1.01]'
            : selectedFile
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20'
          }
        `}
      >
        <input
          type="file"
          accept={ALLOWED_EXTENSIONS.map((ext: SupportedFormat) => `.${ext}`).join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          {selectedFile ? (
            <>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-2xl">✅</div>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-base">{selectedFile.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB · Click or drop to replace
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">📂</div>
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-semibold text-base">Drop your file here</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">or click to browse</p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {ALLOWED_EXTENSIONS.map((ext) => (
                  <span key={ext} className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                    .{ext}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600">Max 20 MB</p>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}