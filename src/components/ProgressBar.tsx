'use client';

interface ProgressBarProps {
  isConverting: boolean;
}

export default function ProgressBar({ isConverting }: ProgressBarProps) {
  if (!isConverting) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Converting your file...
        </span>
        <span className="text-sm text-blue-600 dark:text-blue-400 animate-pulse">
          Please wait
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full animate-[indeterminate_1.5s_ease-in-out_infinite] w-1/2" />
      </div>
    </div>
  );
}