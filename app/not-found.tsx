import Link from "next/link";
import { siteFontVars } from "@/lib/fonts/site";

export default function NotFound() {
  return (
    <main className={`${siteFontVars} flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center font-sans text-white`}>
      <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Error 404</span>
      <h1 className="m-0 text-[clamp(40px,6vw,80px)] leading-none font-medium tracking-[-0.04em]">This page wandered off.</h1>
      <p className="m-0 max-w-[460px] font-body text-white/65">The link may be old, or the page may have moved. Try one of these instead.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-accent px-6 py-3 font-body font-bold text-ink no-underline">Home</Link>
        <Link href="/services" className="rounded-full border border-white/20 px-6 py-3 font-body font-semibold text-white no-underline">Services</Link>
      </div>
    </main>
  );
}
