"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary. Shows a friendly message only — `error.message`
 * from the server is already replaced by Next.js with a generic string in
 * production; we display the digest so support can find the server log line.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-ink px-6 text-center text-white">
      <h1 className="m-0 text-4xl font-semibold tracking-tight">
        Something went wrong <span lang="bn" className="block text-2xl text-white/70">কিছু একটা সমস্যা হয়েছে</span>
      </h1>
      <p className="m-0 max-w-md text-white/65">Please try again. If it keeps happening, contact us and mention the reference below.</p>
      {error.digest ? <code className="rounded bg-white/10 px-2 py-1 text-xs text-white/70">ref {error.digest}</code> : null}
      <button type="button" onClick={reset} className="rounded-full bg-[#49dc7a] px-6 py-3 font-bold text-[#040a0a]">
        Try again · আবার চেষ্টা করুন
      </button>
    </main>
  );
}
