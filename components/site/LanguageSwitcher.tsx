"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALE_COOKIE, LOCALE_META, LOCALES, localePath, splitLocale, type Locale } from "@/lib/i18n/config";

/**
 * English ⇄ Bangla. Each option is a real link to the same page in the other
 * language (so it works without JS and search engines can follow it); clicking
 * also stores the choice in a cookie so the proxy stops auto-detecting.
 *
 * Originally a localStorage-only switcher; now backed by routed locales.
 */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export default function LanguageSwitcher({
  locale,
  label,
  className = "",
  // `bare` drops the pill chrome so the trigger can sit *inside* the nav-links
  // pill without nesting one bordered capsule in another.
  bare = false,
  // `inline` renders the two options side by side (used in the mobile menu).
  inline = false,
}: {
  locale: Locale;
  label: string;
  className?: string;
  bare?: boolean;
  inline?: boolean;
}) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (l: Locale) => localePath(l, path);

  if (inline) {
    return (
      <div role="group" aria-label={label} className={`inline-flex rounded-full border border-white/12 p-1 ${className}`}>
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={href(l)}
            hrefLang={LOCALE_META[l].hreflang}
            lang={LOCALE_META[l].htmlLang}
            aria-current={l === locale ? "true" : undefined}
            onClick={() => remember(l)}
            className={`rounded-full px-3.5 py-1.5 font-body text-[14px] font-semibold no-underline transition-colors ${
              l === locale ? "bg-accent text-ink" : "text-white/75 hover:text-white"
            }`}
          >
            {LOCALE_META[l].label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full text-[14.5px] font-medium transition-colors duration-300 hover:text-white ${
          bare
            ? "px-[13px] py-[9px] text-white/70 hover:bg-white/7"
            : "border border-white/12 bg-[rgba(9,19,18,0.6)] py-[9px] pr-3 pl-4 text-white/80 backdrop-blur-[16px]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
        </svg>
        <span lang={LOCALE_META[locale].htmlLang}>{LOCALE_META[locale].label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-luxe ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul
        className={`absolute top-[calc(100%+8px)] right-0 z-10 m-0 min-w-full origin-top list-none overflow-hidden rounded-2xl border border-white/12 bg-[rgba(9,19,18,0.85)] p-[5px] backdrop-blur-[16px] transition-all duration-300 ease-luxe ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {LOCALES.map((l) => {
          const isActive = l === locale;
          return (
            <li key={l}>
              <Link
                href={href(l)}
                hrefLang={LOCALE_META[l].hreflang}
                lang={LOCALE_META[l].htmlLang}
                tabIndex={open ? 0 : -1}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  remember(l);
                  setOpen(false);
                }}
                className={`block w-full rounded-full px-4 py-[9px] text-left text-[14.5px] font-medium whitespace-nowrap no-underline transition-colors duration-200 ${
                  isActive ? "bg-accent/12 text-white" : "text-white/70 hover:bg-white/7 hover:text-white"
                }`}
              >
                {LOCALE_META[l].label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
