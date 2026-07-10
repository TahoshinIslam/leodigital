"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/gsap";

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // Drive Lenis from GSAP's ticker so smoothed scroll position and tween
    // playback share one clock; otherwise scrubbed animations judder.
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
