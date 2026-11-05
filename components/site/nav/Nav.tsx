"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// The full-screen menu is code-split and mounted on first open only, so no
// visitor pays to download or hydrate it until they tap the hamburger.
const MenuOverlay = dynamic(() => import("@/components/site/nav/MenuOverlay"), { ssr: false });
import type { NavService } from "@/components/site/nav/types";
import { navLinks } from "@/content/site";

export default function Nav({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const onHome = pathname === "/";

  // Scroll-spy (home page only): the active link is the last section whose top
  // has scrolled past 40% of the viewport height. Reading scroll position
  // survives instant jumps and Lenis's smoothing.
  useEffect(() => {
    if (!onHome) return;
    const targets = navLinks
      .map((l) => ({ href: l.href, el: document.getElementById(l.href.split("#")[1] ?? "") }))
      .filter((t): t is { href: string; el: HTMLElement } => t.el !== null);
    if (!targets.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      const ranked = targets
        .map((t) => ({ href: t.href, top: t.el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);
      let current = "";
      for (const t of ranked) if (t.top <= line) current = t.href;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onHome]);

  // Close the menu once the viewport is wide enough to show the inline links.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => burgerRef.current?.focus(), 30);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return onHome && active === href;
    return pathname.startsWith(href);
  };
  const servicesActive = pathname.startsWith("/services");

  return (
    <>
      <nav aria-label="Primary" className="sticky top-0 z-60 py-4">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-6 md:px-8">
          <Link
            href="/"
            aria-label="Leotech home"
            className="flex items-center gap-3 rounded-full border border-white/12 bg-[rgba(9,19,18,0.6)] py-[9px] pr-5 pl-3 no-underline backdrop-blur-[16px]"
          >
            <span className="text-xl leading-none font-bold tracking-[-0.02em] text-white">
              leotech<span className="text-accent">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/12 bg-[rgba(9,19,18,0.6)] p-[5px] backdrop-blur-[16px] lg:flex">
            {navLinks.map((l) => {
              const on = l.label === "Services" ? servicesActive || isActive(l.href) : isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.label === "Services" ? "/services" : l.href}
                  aria-current={on ? "page" : undefined}
                  className={`rounded-full px-[17px] py-[9px] text-[14.5px] font-medium no-underline transition-all duration-300 hover:bg-white/7 hover:text-white ${
                    on ? "bg-accent/12 text-white" : "text-white/70"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#contact"
              className="hidden items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-[14.5px] font-bold text-ink no-underline shadow-[0_8px_28px_rgba(73,220,122,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-[350ms] ease-luxe hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(73,220,122,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] sm:inline-flex"
            >
              Get started
            </Link>

            {/* Hamburger — below the inline-links breakpoint. */}
            <button
              ref={burgerRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => {
                setMenuLoaded(true);
                // Mount closed first, then open on the next frame so the
                // entrance transition runs.
                requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
              }}
              onPointerEnter={() => void import("@/components/site/nav/MenuOverlay")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[rgba(9,19,18,0.6)] backdrop-blur-[16px] lg:hidden"
            >
              <span className="relative block h-4 w-5" aria-hidden>
                <span className="absolute top-[2px] left-0 block h-[2px] w-5 bg-white" />
                <span className="absolute top-[7px] left-0 block h-[2px] w-5 bg-white" />
                <span className="absolute top-[12px] left-0 block h-[2px] w-3.5 bg-white" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {menuLoaded ? <MenuOverlay open={open} onClose={close} services={services} pathname={pathname} /> : null}
    </>
  );
}
