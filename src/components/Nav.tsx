"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/content/site";

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Scroll-spy: the active link is the last section whose top has scrolled past
  // 40% of the viewport height. Reading scroll position (rather than an
  // IntersectionObserver band) survives instant jumps and Lenis's smoothing,
  // and leaves nothing highlighted while the hero is in view.
  useEffect(() => {
    const targets = navLinks
      .map((l) => ({ href: l.href, el: document.getElementById(l.href.slice(1)) }))
      .filter((t): t is { href: string; el: HTMLElement } => t.el !== null);
    if (!targets.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      // Sort by on-screen position — nav order is not DOM order (Industries sits
      // above Services), so "last past the line" must mean visually lowest.
      const ranked = targets
        .map((t) => ({ href: t.href, top: t.el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);
      let current = "";
      for (const t of ranked) {
        if (t.top <= line) current = t.href;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    // capture: true so Lenis's scroll (dispatched on window) is caught too.
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Close the mobile menu once the viewport is wide enough to show the inline links.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <nav className="sticky top-0 z-60 py-4">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-6 md:px-8">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-full border border-white/12 bg-[rgba(9,19,18,0.6)] py-[9px] pr-5 pl-3 no-underline backdrop-blur-[16px]"
        >
          <span className="text-xl leading-none font-bold tracking-[-0.02em] text-white">
            leotech<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/12 bg-[rgba(9,19,18,0.6)] p-[5px] backdrop-blur-[16px] lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full px-[17px] py-[9px] text-[14.5px] font-medium no-underline transition-all duration-300 hover:bg-white/7 hover:text-white ${
                  isActive ? "bg-accent/12 text-white" : "text-white/70"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-[14.5px] font-bold text-ink no-underline shadow-[0_8px_28px_rgba(73,220,122,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-[350ms] ease-luxe hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(73,220,122,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] sm:inline-flex"
          >
            Get started
          </Link>

          {/* Hamburger — only below the inline-links breakpoint. */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[rgba(9,19,18,0.6)] backdrop-blur-[16px] lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-[2px] w-5 bg-white transition-all duration-300 ease-luxe ${
                  open ? "top-[7px] rotate-45" : "top-[2px]"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-[2px] w-5 bg-white transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-5 bg-white transition-all duration-300 ease-luxe ${
                  open ? "top-[7px] -rotate-45" : "top-[12px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`mx-auto max-w-[1320px] px-6 md:px-8 lg:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <div
          className={`mt-3 origin-top overflow-hidden rounded-3xl border border-white/12 bg-[rgba(9,19,18,0.82)] backdrop-blur-[16px] transition-all duration-300 ease-luxe ${
            open ? "max-h-[420px] opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 p-3">
            {navLinks.map((l) => {
              const isActive = active === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-2xl px-4 py-3 text-[15px] font-medium no-underline transition-colors ${
                    isActive ? "bg-accent/12 text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 font-body text-[15px] font-bold text-ink no-underline"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
