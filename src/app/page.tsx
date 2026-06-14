'use client';

import { useState, useCallback } from 'react';
import { SupportedFormat, CONVERSION_MAP } from '@/types/conversion';
import { getOutputFileName, getFileExtension } from '@/utils/fileHelpers';
import UploadArea from '@/components/UploadArea';
import FormatSelector from '@/components/FormatSelector';
import ProgressBar from '@/components/ProgressBar';
import DownloadButton from '@/components/DownloadButton';

const ALL_CONVERSIONS = Object.entries(CONVERSION_MAP).flatMap(([from, targets]) =>
  (targets as SupportedFormat[]).map((to) => `${from.toUpperCase()} → ${to.toUpperCase()}`)
);

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

      const response = await fetch('/api/convert', { method: 'POST', body: formData });

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

  const sourceFormat = selectedFile ? getFileExtension(selectedFile.name) as SupportedFormat : null;
  const canConvert = selectedFile && targetFormat && !downloadUrl && !isConverting;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <main className="min-h-screen bg-gray-50 dark:bg-[#0e0e12] transition-colors duration-300">

        {/* Header */}
        <header className="w-full border-b border-gray-100 dark:border-gray-800/80 bg-white/80 dark:bg-[#0e0e12]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold">⇄</div>
              <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                Universal File Converter
              </span>
            </div>
            <button
              onClick={() => setDarkMode((p) => !p)}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:scale-105 transition-all duration-150 flex items-center justify-center text-sm"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀' : '🌙'}
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

          {/* Hero */}
          <div className="text-center space-y-2 py-4">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Convert any file,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">
                instantly
              </span>
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-base max-w-md mx-auto">
              No account. No storage. No ads. Files are processed in memory and never saved.
            </p>
          </div>

          {/* Main Converter Card */}
          <div className="bg-white dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 space-y-6">

            {/* Step 1 */}
            <section className="space-y-3">
              <StepLabel number={1} label="Upload a file" done={!!selectedFile} />
              <UploadArea onFileSelect={handleFileSelect} selectedFile={selectedFile} />
            </section>

            {/* Step 2 */}
            {selectedFile && (
              <section className="space-y-3">
                <StepLabel number={2} label="Choose output format" done={!!targetFormat} />
                <FormatSelector
                  selectedFile={selectedFile}
                  targetFormat={targetFormat}
                  onFormatSelect={handleFormatSelect}
                />
              </section>
            )}

            {/* Step 3 */}
            {selectedFile && targetFormat && !downloadUrl && (
              <section className="space-y-3">
                <StepLabel number={3} label="Convert" done={false} />
                <button
                  onClick={handleConvert}
                  disabled={!canConvert}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-150 shadow-md shadow-violet-200 dark:shadow-violet-900/30"
                >
                  {isConverting
                    ? 'Converting…'
                    : `Convert ${sourceFormat?.toUpperCase()} → ${targetFormat.toUpperCase()}`}
                </button>
              </section>
            )}

            {/* Progress */}
            <ProgressBar isConverting={isConverting} />

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
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

          {/* Conversions Grid */}
          <div className="bg-white dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Supported Conversions
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALL_CONVERSIONS.map((conversion) => (
                <div
                  key={conversion}
                  className="text-xs font-mono bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700/60 text-center"
                >
                  {conversion}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-gray-300 dark:text-gray-700">
          Files are never stored · Processed entirely in memory · Universal File Converter v1.0
        </footer>

      </main>
    </div>
  );
}

function StepLabel({ number, label, done }: { number: number; label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center transition-colors ${done ? 'bg-emerald-500 text-white' : 'bg-violet-600 text-white'}`}>
        {done ? '✓' : number}
      </span>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
    </div>
  );
}