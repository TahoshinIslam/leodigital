"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

// The chosen language lives in localStorage, which is an external store: read it
// through useSyncExternalStore so the server snapshot is always "en" (matching
// the HTML it renders) and the client re-reads after hydration without the
// mismatch — or the setState-in-effect — that a useState+useEffect pair causes.
const LANG_EVENT = "langchange";

function subscribe(onChange: () => void) {
  window.addEventListener(LANG_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANG_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): LangCode {
  const saved = localStorage.getItem("lang");
  return saved === "bn" ? "bn" : "en";
}

function setStoredLang(code: LangCode) {
  localStorage.setItem("lang", code);
  window.dispatchEvent(new Event(LANG_EVENT));
}

export default function LanguageSwitcher({
  className = "",
  // `bare` drops the pill chrome so the trigger can sit *inside* the nav-links
  // pill without nesting one bordered capsule in another.
  bare = false,
}: {
  className?: string;
  bare?: boolean;
}) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => "en" as LangCode);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full text-[14.5px] font-medium transition-colors duration-300 hover:text-white ${
          bare
            ? "px-[13px] py-[9px] text-white/70 hover:bg-white/7"
            : "border border-white/12 bg-[rgba(9,19,18,0.6)] py-[9px] pr-3 pl-4 text-white/80 backdrop-blur-[16px]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-[18px] w-[18px] shrink-0"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
        </svg>
        {current.label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-luxe ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-label="Language"
        className={`absolute right-0 top-[calc(100%+8px)] z-10 min-w-full origin-top overflow-hidden rounded-2xl border border-white/12 bg-[rgba(9,19,18,0.85)] p-[5px] backdrop-blur-[16px] transition-all duration-300 ease-luxe ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {LANGUAGES.map((l) => {
          const isActive = l.code === lang;
          return (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => {
                setStoredLang(l.code);
                setOpen(false);
              }}
              className={`block w-full rounded-full px-4 py-[9px] text-left text-[14.5px] font-medium whitespace-nowrap transition-colors duration-200 ${
                isActive ? "bg-accent/12 text-white" : "text-white/70 hover:bg-white/7 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
