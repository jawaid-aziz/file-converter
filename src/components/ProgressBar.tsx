'use client';

interface ProgressBarProps {
  isConverting: boolean;
}

export default function ProgressBar({ isConverting }: ProgressBarProps) {
  if (!isConverting) return null;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Converting your file</span>
        <span className="text-xs text-violet-500 dark:text-violet-400 animate-pulse font-mono">processing…</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full animate-[indeterminate_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}