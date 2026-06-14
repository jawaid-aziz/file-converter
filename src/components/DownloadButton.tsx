'use client';

interface DownloadButtonProps {
  downloadUrl: string | null;
  fileName: string | null;
  onReset: () => void;
}

export default function DownloadButton({ downloadUrl, fileName, onReset }: DownloadButtonProps) {
  if (!downloadUrl || !fileName) return null;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-center">
        <p className="text-green-700 dark:text-green-400 font-semibold">
          ✅ Conversion complete!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your file <strong>{fileName}</strong> is ready to download.
        </p>
      </div>

      <div className="flex gap-3 w-full">
        <a
          href={downloadUrl}
          download={fileName}
          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-150 shadow-md hover:shadow-lg"
        >
          ⬇️ Download {fileName}
        </a>
        <button
          onClick={onReset}
          className="px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 font-semibold transition-all duration-150"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}