"use client";

import { useRef, type ReactNode } from "react";

/**
 * Cursor-follow lighting + border glow. The pointer position is written to CSS
 * custom properties on the card, so the wash and the border highlight are pure
 * paint — no React state per mousemove.
 */
export default function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`spotlight group relative overflow-hidden rounded-[14px] border border-white/9 bg-ink-card transition-[transform,border-color,background] duration-500 ease-luxe hover:-translate-y-[5px] hover:border-accent/40 hover:bg-ink-card-hover ${className}`}
    >
      <span aria-hidden className="spotlight-wash" />
      {children}
    </div>
  );
}
