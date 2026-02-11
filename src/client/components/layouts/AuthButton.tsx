"use client";

import { useAuth } from "@/client/hooks/useAuth";

export default function AuthButton() {
  const { isLoading, isAuthed, email, signIn, signOut } = useAuth();

  if (isLoading) {
    return (
      <button
        type="button"
        className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 dark:bg-slate-700 dark:text-gray-300 cursor-default"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (!isAuthed) {
    return (
      <button
        type="button"
        onClick={signIn}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800 transition-colors"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {email && (
        <span className="hidden sm:inline-flex max-w-[200px] truncate text-sm text-gray-700 dark:text-gray-200">
          {email}
        </span>
      )}
      <button
        type="button"
        onClick={signOut}
        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
