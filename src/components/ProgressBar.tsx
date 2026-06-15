'use client';

interface ProgressBarProps {
  isConverting: boolean;
}

export default function ProgressBar({ isConverting }: ProgressBarProps) {
  if (!isConverting) return null;

  return (
    <div className="w-full space-y-2 animate-[fade-in_0.2s_ease-out]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Processing</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono animate-pulse">···</span>
      </div>
      <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-[indeterminate_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
      </div>
    </div>
  );
}