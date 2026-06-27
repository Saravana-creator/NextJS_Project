import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f0fafb" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0b7ea1",
              marginBottom: "0.75rem",
            }}
          >
            404
          </p>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#1a2332",
              margin: "0 0 1rem",
            }}
          >
            Page not found
          </h1>
          <p style={{ color: "#6b7280", maxWidth: "28rem", margin: "0 0 2rem" }}>
            The route does not exist or the content has not been connected yet.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#0b7ea1",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "0.625rem",
              padding: "0.75rem 1.75rem",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}
