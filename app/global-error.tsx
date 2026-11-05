"use client";

/** Last-resort boundary when the root layout itself fails. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#040a0a", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>Something went wrong</h1>
          <p style={{ opacity: 0.7 }}>Please try again in a moment.</p>
          {error.digest ? <p style={{ opacity: 0.5, fontSize: 12 }}>ref {error.digest}</p> : null}
          <button onClick={reset} style={{ marginTop: 12, padding: "12px 24px", borderRadius: 999, border: 0, background: "#49dc7a", fontWeight: 700 }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
