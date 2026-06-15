"use client";

interface DownloadButtonProps {
  downloadUrl: string | null;
  fileName: string | null;
  onReset: () => void;
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ResetIcon() {
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
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
    </svg>
  );
}

export default function DownloadButton({
  downloadUrl,
  fileName,
  onReset,
}: DownloadButtonProps) {
  if (!downloadUrl || !fileName) return null;

  return (
    <div className="w-full space-y-3 animate-slide-up">
      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Ready
          </p>
          <p className="text-base font-medium text-zinc-800 dark:text-zinc-200 truncate mt-0.5">
            {fileName}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 text-sm font-medium transition-all duration-150"
          >
            <ResetIcon />
            Reset
          </button>
          <a
            href={downloadUrl}
            download={fileName}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 text-sm font-semibold transition-all duration-150"
          >
            <DownloadIcon />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
