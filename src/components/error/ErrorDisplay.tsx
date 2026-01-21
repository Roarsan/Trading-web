"use client";

interface ErrorDisplayProps {
  error: Error | null;
  title?: string;
}

export function ErrorDisplay({ error, title = "Error" }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            {title}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400">
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
}

