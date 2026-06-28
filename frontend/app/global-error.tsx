"use client";

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "#dc2626", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Something went wrong</h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>A global error occurred. Please try again.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                display: "inline-block",
                background: "#0d9488",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "0.5rem",
                padding: "0.625rem 1.25rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                display: "inline-block",
                background: "#4b5563",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "0.5rem",
                padding: "0.625rem 1.25rem",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
