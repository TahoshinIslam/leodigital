"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { contact, industries } from "@/content/site";
import type { NavService } from "@/components/site/nav/types";

/**
 * Full-screen navigation for small screens.
 *
 *  - Root level: large condensed items; items with a chevron open a sub-level.
 *  - Sub-levels slide in with a "← Back | Section" header (Services shows
 *    cards, Industries a list).
 *  - From tablet width a visual panel on the left previews whatever item is
 *    hovered or focused.
 *  - Footer: a call link and a Motion toggle that switches decorative
 *    animation off site-wide (remembered on this device).
 *
 * Accessible as a modal dialog: focus moves in and is trapped, Esc goes back a
 * level or closes, focus returns to the hamburger, and hidden levels are inert.
 */
type Level = "root" | "services" | "industries";

type RootItem =
  | { kind: "link"; label: string; href: string; preview: string }
  | { kind: "level"; label: string; level: Exclude<Level, "root">; preview: string };

const ROOT: RootItem[] = [
  { kind: "link", label: "Home", href: "/", preview: "Marketing that creates market leaders." },
  { kind: "level", label: "Services", level: "services", preview: "Every channel. One number that matters." },
  { kind: "level", label: "Industries", level: "industries", preview: "Built for the way your customers buy." },
  { kind: "link", label: "Playbook", href: "/#playbook", preview: "How we plan, launch and optimise." },
  { kind: "link", label: "Studio", href: "/#studio", preview: "Product stills, films and explainers." },
  { kind: "link", label: "Pricing", href: "/#pricing", preview: "Plans that scale with you." },
  { kind: "link", label: "Contact", href: "/#contact", preview: "Talk to a strategist this week." },
];

const LEVEL_TITLE: Record<Exclude<Level, "root">, string> = { services: "Services", industries: "Industries" };

type Preview = { title: string; caption: string; image?: string | null; alt?: string | null };
const DEFAULT_PREVIEW: Preview = { title: "leotech.", caption: "Marketing that creates market leaders." };

const MOTION_KEY = "leotech:motion";
const MOTION_EVENT = "leotech:motion-change";

// The <html data-motion> attribute is the source of truth (set before paint by
// an inline script in the site shell), read through an external store so the
// server render and hydration agree.
const motionStore = {
  subscribe(cb: () => void) {
    window.addEventListener(MOTION_EVENT, cb);
    return () => window.removeEventListener(MOTION_EVENT, cb);
  },
  get: () => document.documentElement.dataset.motion === "off",
  server: () => false,
};

function Chevron({ dir = "right", size = 22 }: { dir?: "right" | "left" | "up"; size?: number }) {
  const rotate = dir === "left" ? "rotate-180" : dir === "up" ? "-rotate-90" : "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={rotate} aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function MenuOverlay({
  open,
  onClose,
  services,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  services: NavService[];
  pathname: string;
}) {
  const [level, setLevel] = useState<Level>("root");
  const [preview, setPreview] = useState<Preview>(DEFAULT_PREVIEW);
  const motionOff = useSyncExternalStore(motionStore.subscribe, motionStore.get, motionStore.server);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  // Close, then quietly reset to the root level once the fade-out has finished.
  const close = useCallback(() => {
    onClose();
    window.setTimeout(() => {
      setLevel("root");
      setPreview(DEFAULT_PREVIEW);
    }, 500);
  }, [onClose]);

  // Scroll lock + initial focus while open.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.classList.add("menu-open");
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      html.classList.remove("menu-open");
      lenis?.start();
    };
  }, [open]);

  // After switching levels, move focus to the first control of the new level.
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current?.querySelector<HTMLElement>(`[data-level="${level}"] [data-autofocus]`);
    el?.focus();
  }, [level, open]);

  const goTo = useCallback((next: Level, trigger?: HTMLElement | null) => {
    if (trigger) lastTrigger.current = trigger;
    setLevel(next);
    setPreview(DEFAULT_PREVIEW);
  }, []);

  const back = useCallback(() => {
    setLevel("root");
    // Return focus to the item that opened the sub-level.
    window.setTimeout(() => lastTrigger.current?.focus(), 30);
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (level === "root") close();
      else back();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    // Focus trap within the visible, non-inert controls.
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ).filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const toggleMotion = () => {
    const next = !motionOff;
    const html = document.documentElement;
    if (next) html.dataset.motion = "off";
    else delete html.dataset.motion;
    try {
      localStorage.setItem(MOTION_KEY, next ? "off" : "on");
    } catch {
      /* storage blocked — the toggle still applies for this visit */
    }
    window.dispatchEvent(new Event(MOTION_EVENT));
  };

  const levelClass = (name: Level) => {
    if (name === level) return "translate-x-0 opacity-100";
    // Root slides left when a sub-level opens; sub-levels wait off to the right.
    return name === "root" ? "-translate-x-10 opacity-0 pointer-events-none" : "translate-x-10 opacity-0 pointer-events-none";
  };

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      onKeyDown={onKeyDown}
      className={`fixed inset-0 z-[80] flex transition-[opacity,visibility] duration-500 ease-luxe ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* Visual preview — tablet and up */}
      <div
        aria-hidden
        onClick={close}
        className="relative hidden flex-1 overflow-hidden md:block"
        style={{
          background:
            "radial-gradient(80% 60% at 30% 30%, rgba(73,220,122,0.28), transparent 60%), radial-gradient(70% 60% at 80% 80%, rgba(34,242,239,0.18), transparent 60%), linear-gradient(160deg, #0b2a20 0%, #061512 55%, #040a0a 100%)",
        }}
      >
        {preview.image ? (
          <Image
            key={preview.image}
            src={preview.image}
            alt=""
            fill
            sizes="50vw"
            className="animate-[menu-fade_.5s_ease-out] object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,10,0.1),rgba(4,10,10,0.75))]" />
        <div className="absolute inset-0 flex flex-col justify-between p-[clamp(28px,4vw,56px)]">
          <span className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase">Leotech · Dhaka</span>
          <div key={preview.title} className="animate-[menu-fade_.45s_ease-out]">
            <div className="font-[family-name:var(--font-oswald)] text-[clamp(48px,6.2vw,128px)] leading-[0.92] font-semibold tracking-[-0.01em] text-balance text-white uppercase [overflow-wrap:anywhere]">
              {preview.title}
            </div>
            <p className="mt-4 max-w-[420px] font-body text-lg text-white/70">{preview.caption}</p>
          </div>
          <div className="flex items-end justify-between gap-6">
            <Link
              href="/#contact"
              onClick={close}
              tabIndex={-1}
              className="rounded-full bg-accent px-7 py-3.5 font-body text-[15px] font-bold whitespace-nowrap text-ink no-underline shadow-[0_10px_34px_rgba(73,220,122,0.35)]"
            >
              Book a free consultation
            </Link>
            <span className="text-right font-mono text-xs leading-relaxed tracking-[0.14em] text-white/55 uppercase">
              {contact.email}
            </span>
          </div>
        </div>
      </div>

      {/* Menu panel */}
      <div
        ref={panelRef}
        data-lenis-prevent
        className={`relative flex h-full w-full flex-col bg-[#071311] transition-transform duration-500 ease-luxe md:w-[min(560px,52vw)] md:border-l md:border-white/8 ${
          open ? "translate-x-0" : "translate-x-8"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4 sm:px-10 sm:pt-9">
          <div className="relative h-11 min-w-0 flex-1">
            <div className={`absolute inset-0 flex items-center gap-4 transition-all duration-300 ${level === "root" ? "opacity-100" : "pointer-events-none -translate-x-3 opacity-0"}`}>
              <span className="text-xl font-bold tracking-[-0.02em] text-white">
                leotech<span className="text-accent">.</span>
              </span>
              <span aria-hidden className="h-6 w-px bg-white/25" />
              <span className="truncate font-body text-[16px] font-semibold text-white/75">Digital marketing</span>
            </div>
            <div className={`absolute inset-0 flex items-center gap-4 transition-all duration-300 ${level !== "root" ? "opacity-100" : "pointer-events-none translate-x-3 opacity-0"}`}>
              <button
                type="button"
                onClick={back}
                tabIndex={level === "root" ? -1 : 0}
                className="inline-flex items-center gap-2 rounded-full py-1 font-body text-[16px] font-semibold text-accent"
              >
                <Chevron dir="left" size={20} /> Back
              </button>
              <span aria-hidden className="h-6 w-px bg-white/25" />
              <span className="truncate font-body text-[16px] font-semibold text-white/80">
                {level !== "root" ? LEVEL_TITLE[level] : ""}
              </span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/8 text-white transition-colors hover:bg-accent hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Levels */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {/* Root */}
          <nav
            data-level="root"
            aria-label="Main"
            inert={level !== "root"}
            className={`absolute inset-0 overflow-y-auto px-6 pt-6 pb-8 transition-all duration-500 ease-luxe sm:px-10 ${levelClass("root")}`}
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {ROOT.map((item, i) => {
                const common =
                  "group flex w-full items-center justify-between gap-4 py-1.5 text-left font-[family-name:var(--font-oswald)] text-[clamp(40px,11vw,64px)] leading-[1.08] font-semibold tracking-[0.005em] uppercase no-underline outline-none transition-colors duration-200 focus-visible:text-white";
                const onPreview = () => setPreview({ title: item.label, caption: item.preview });
                return (
                  <li key={item.label} style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" }} className={`transition-all duration-500 ease-luxe ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                    {item.kind === "link" ? (
                      <Link
                        href={item.href}
                        onClick={close}
                        onMouseEnter={onPreview}
                        onFocus={onPreview}
                        data-autofocus={i === 0 ? "" : undefined}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className={`${common} ${isCurrent(item.href) ? "text-[#f2f7d9]" : "text-[#9fe3b8] hover:text-white"}`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => goTo(item.level, e.currentTarget)}
                        onMouseEnter={onPreview}
                        onFocus={onPreview}
                        aria-haspopup="true"
                        className={`${common} cursor-pointer border-0 bg-transparent p-0 text-[#9fe3b8] hover:text-white`}
                      >
                        <span>{item.label}</span>
                        <span className="text-white/70 transition-transform duration-300 group-hover:translate-x-1">
                          <Chevron size={30} />
                        </span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Services — cards */}
          <div
            data-level="services"
            inert={level !== "services"}
            className={`absolute inset-0 overflow-y-auto px-6 pt-4 pb-8 transition-all duration-500 ease-luxe sm:px-10 ${levelClass("services")}`}
          >
            <Link
              href="/services"
              onClick={close}
              data-autofocus=""
              className="mb-5 inline-flex items-center gap-2 font-[family-name:var(--font-oswald)] text-[28px] font-semibold tracking-[0.01em] text-[#9fe3b8] uppercase no-underline hover:text-white"
            >
              Explore all <Chevron size={22} />
            </Link>
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 min-[460px]:grid-cols-2">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    onClick={close}
                    onMouseEnter={() => setPreview({ title: s.title, caption: s.eyebrow ?? "", image: s.heroImage, alt: s.heroImageAlt })}
                    onFocus={() => setPreview({ title: s.title, caption: s.eyebrow ?? "", image: s.heroImage, alt: s.heroImageAlt })}
                    className="group flex items-center overflow-hidden rounded-2xl bg-white/[0.06] no-underline ring-1 ring-white/8 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09] hover:ring-accent/40 min-[460px]:block"
                  >
                    <div className="relative h-[84px] w-[96px] shrink-0 overflow-hidden min-[460px]:h-auto min-[460px]:w-auto min-[460px]:aspect-[16/9]">
                      {s.heroImage ? (
                        <Image src={s.heroImage} alt={s.heroImageAlt ?? ""} fill sizes="(min-width: 768px) 260px, (min-width: 460px) 45vw, 96px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(120% 90% at ${20 + ((i * 23) % 60)}% 10%, #49DC7A 0%, #1E8F66 42%, #0B3B2A 72%, #040A0A 100%)`,
                          }}
                        >
                          <span className="absolute right-2 bottom-1 font-[family-name:var(--font-oswald)] text-[34px] leading-none font-semibold text-white/15 uppercase min-[460px]:right-3 min-[460px]:bottom-2 min-[460px]:text-[56px]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 px-4 py-3 min-[460px]:pt-3.5 min-[460px]:pb-4">
                      <div className="font-body text-[16px] leading-snug font-bold text-white">{s.title}</div>
                      {s.eyebrow ? <div className="mt-1 font-body text-[13.5px] text-white/55">{s.eyebrow}</div> : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries — list */}
          <div
            data-level="industries"
            inert={level !== "industries"}
            className={`absolute inset-0 overflow-y-auto px-6 pt-4 pb-8 transition-all duration-500 ease-luxe sm:px-10 ${levelClass("industries")}`}
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {industries.map((ind, i) => (
                <li key={ind.title}>
                  <Link
                    href="/#industries"
                    onClick={close}
                    data-autofocus={i === 0 ? "" : undefined}
                    onMouseEnter={() => setPreview({ title: ind.title, caption: ind.copy })}
                    onFocus={() => setPreview({ title: ind.title, caption: ind.copy })}
                    className="block py-1 font-[family-name:var(--font-oswald)] text-[clamp(32px,8.5vw,48px)] leading-[1.12] font-semibold uppercase text-[#9fe3b8] no-underline transition-colors hover:text-white focus-visible:text-white"
                  >
                    {ind.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-white/8 px-6 py-5 sm:px-10">
          <a
            href={`tel:${contact.phones[0].replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2.5 font-body text-[15px] font-semibold text-white/85 no-underline hover:text-accent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {contact.phones[0]}
          </a>
          <button
            type="button"
            onClick={toggleMotion}
            aria-pressed={!motionOff}
            className="inline-flex items-center gap-2 rounded-full px-1 py-1 font-body text-[15px] font-semibold text-white/85 hover:text-accent"
          >
            Motion <span className="font-mono text-xs tracking-[0.12em] text-white/50 uppercase">{motionOff ? "off" : "on"}</span>
            <span aria-hidden className={`relative inline-block h-5 w-9 rounded-full transition-colors ${motionOff ? "bg-white/15" : "bg-accent"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${motionOff ? "left-0.5" : "left-[18px]"}`} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
