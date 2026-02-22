"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-center">
      <div className="card card-shadow-lg card-padded-lg text-center max-w-md w-full">
        <div className="icon-circle-error">
          <svg
            className="w-8 h-8 icon-error"
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong!
        </h1>
        <p className="text-muted mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="button button-blue button-compact"
          >
            Try again
          </button>
          <Link
            href="/"
            className="button button-gray button-compact"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
