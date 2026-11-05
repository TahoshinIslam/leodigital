import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteFontVars } from "@/lib/fonts/site";

export const metadata: Metadata = {
  title: "Page not found · পাতা পাওয়া যায়নি | Leotech",
  robots: { index: false },
};

/** 404 for URLs that match no route at all (both languages, since the URL may be either). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className={`${siteFontVars} flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center font-sans text-white`}>
          <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Error 404</span>
          <h1 className="m-0 text-[clamp(40px,6vw,80px)] leading-none font-medium tracking-[-0.04em]">This page wandered off.</h1>
          <p className="m-0 max-w-[460px] font-body text-white/65" lang="bn">এই পাতাটি হারিয়ে গেছে।</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-full bg-accent px-6 py-3 font-body font-bold text-ink no-underline">Home</Link>
            <Link href="/bn" lang="bn" className="rounded-full border border-white/20 px-6 py-3 font-body font-semibold text-white no-underline">হোম</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
