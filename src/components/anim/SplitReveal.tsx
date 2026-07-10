"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { EASE, SplitText, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay in seconds before the first line rises. */
  delay?: number;
  /** Play immediately on mount instead of waiting for scroll. */
  immediate?: boolean;
};

/**
 * Masked line reveal + blur-to-sharp.
 * Lines are wrapped in overflow-clipped masks, then rise from behind them
 * while resolving out of a blur.
 */
export default function SplitReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      // Hidden before paint; onSplit re-reveals once lines exist, so there is
      // no flash of unsplit text. Without JS the element stays visible.
      gsap.set(el, { autoAlpha: 0 });

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.fromTo(
            self.lines,
            { yPercent: 115, filter: "blur(12px)", opacity: 0 },
            {
              yPercent: 0,
              filter: "blur(0px)",
              opacity: 1,
              duration: 1.1,
              stagger: 0.09,
              delay,
              ease: EASE,
              scrollTrigger: immediate
                ? undefined
                : { trigger: el, start: "top 85%", once: true },
            },
          );
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
