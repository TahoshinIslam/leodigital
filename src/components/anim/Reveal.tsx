"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Scroll-triggered fade-up. When `stagger` is set, direct children animate in
 * sequence; otherwise the wrapper itself rises as one piece.
 */
export default function Reveal({
  children,
  className = "",
  stagger,
  delay = 0,
  distance = 32,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;

      const targets = stagger ? Array.from(el.children) : el;
      if (stagger && !(targets as Element[]).length) return;

      // fromTo, not from: `from` infers its end value from live DOM state, so a
      // double-invoked effect (StrictMode) reads the already-offset position as
      // the destination and the element never travels back.
      gsap.fromTo(
        targets,
        { y: distance, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay,
          ease: EASE,
          stagger: stagger ?? 0,
          // Hand styling back to CSS once settled, so the cards' hover-lift and
          // spotlight transforms are not pinned by gsap's inline transform.
          clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
