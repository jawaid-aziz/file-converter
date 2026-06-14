'use client';

import { useState, useCallback } from 'react';
import { SupportedFormat } from '@/types/conversion';
import { getOutputFileName } from '@/utils/fileHelpers';
import UploadArea from '@/components/UploadArea';
import FormatSelector from '@/components/FormatSelector';
import ProgressBar from '@/components/ProgressBar';
import DownloadButton from '@/components/DownloadButton';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat | null>(null);
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
      formData.append('file', selectedFile);
      formData.append('targetFormat', targetFormat);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Conversion failed.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const fileName = getOutputFileName(selectedFile.name, targetFormat);

      setDownloadUrl(url);
      setOutputFileName(fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

        {/* Header */}
        <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                Universal File Converter
              </h1>
            </div>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-105 transition-all duration-150 text-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">

          {/* Hero */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-3">
              Convert files instantly
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              No sign-up. No storage. No ads. Just fast, private file conversion.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-7">

            {/* Step 1 — Upload */}
            <div>
              <StepLabel number={1} label="Upload your file" />
              <UploadArea
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>

            {/* Step 2 — Select Format */}
            {selectedFile && (
              <div>
                <StepLabel number={2} label="Choose output format" />
                <FormatSelector
                  selectedFile={selectedFile}
                  targetFormat={targetFormat}
                  onFormatSelect={handleFormatSelect}
                />
              </div>
            )}

            {/* Step 3 — Convert */}
            {selectedFile && targetFormat && !downloadUrl && (
              <div>
                <StepLabel number={3} label="Convert" />
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-base transition-all duration-150 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {isConverting ? 'Converting...' : `Convert to .${targetFormat.toUpperCase()}`}
                </button>
              </div>
            )}

            {/* Progress */}
            <ProgressBar isConverting={isConverting} />

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-center">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  ⚠️ {error}
                </p>
              </div>
            )}

            {/* Download */}
            <DownloadButton
              downloadUrl={downloadUrl}
              fileName={outputFileName}
              onReset={handleReset}
            />

          </div>

          {/* Supported Conversions Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 uppercase tracking-wider">
              Supported Conversions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'DOCX → MD',
                'MD → PDF',
                'MD → HTML',
                'MD → TXT',
                'HTML → MD',
                'TXT → MD',
                'CSV → JSON',
                'JSON → CSV',
              ].map((conversion) => (
                <div
                  key={conversion}
                  className="text-xs font-mono bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  {conversion}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600">
          No files are stored. All conversions happen in memory. · Universal File Converter v1.0
        </footer>

      </main>
    </div>
  );
}

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
        {number}
      </span>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </span>
    </div>
  );
}