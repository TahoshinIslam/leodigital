"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Hero scale-in: the whole stage settles from 0.92 to 1 on load. */
export default function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out", clearProps: "all" },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="origin-center will-change-transform">
      {children}
    </div>
  );
}
