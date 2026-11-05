"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Counts to `value` on entry, with a soft radial light blooming behind the
 * numeral. Renders the final value in markup first, so it is correct for
 * crawlers and with JS disabled.
 */
export default function CountUp({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const numeral = root.querySelector<HTMLElement>("[data-numeral]");
      const glow = root.querySelector<HTMLElement>("[data-glow]");
      if (!numeral || prefersReducedMotion()) return;

      const counter = { n: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 90%", once: true },
      });

      tl.to(counter, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        snap: { n: 1 },
        onUpdate: () => {
          numeral.textContent = String(Math.round(counter.n));
        },
      });

      if (glow) {
        tl.fromTo(
          glow,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          0,
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative flex flex-col gap-2.5">
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-6 h-40 w-40 opacity-0"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(73,220,122,0.18), transparent 70%)",
        }}
      />
      <div className="relative text-6xl leading-none font-medium tracking-[-0.03em] text-white tabular-nums">
        <span data-numeral>{value}</span>
        {suffix && <span className="text-accent">{suffix}</span>}
      </div>
      <div className="relative font-mono text-xs tracking-[0.18em] text-white/40 uppercase">
        {label}
      </div>
    </div>
  );
}
