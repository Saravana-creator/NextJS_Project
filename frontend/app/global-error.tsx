"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
          <p className="mt-2 text-sm text-gray-500">
            {error?.message || "A global application error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-all"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
