"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Resolves true once a <canvas> has appeared inside `ref` — i.e. a WebGL
 * backdrop has begun rendering — plus a short grace period so the skeleton's
 * fade-out is actually seen rather than snapping away. Returns false whenever
 * `active` is false (the backdrop is unmounted).
 *
 * Crucially it also resolves true after a fallback timeout even if no canvas
 * ever appears — under reduced motion, or when WebGL context creation fails, the
 * backdrop never mounts a canvas, and without this the skeleton would cover the
 * section forever. Reduced-motion users get a much shorter wait.
 *
 * Every state write is scheduled inside a rAF/timeout callback rather than run
 * synchronously in the effect body, which React's purity rules disallow.
 */
export function useCanvasReady(ref: RefObject<HTMLElement | null>, active: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxWait = reduce ? 500 : 2500;

    let raf = 0;
    let grace = 0;
    let first = true;
    const fallback = window.setTimeout(() => setReady(true), maxWait);

    const check = () => {
      if (el.querySelector("canvas")) {
        grace = window.setTimeout(() => setReady(true), 260);
        return;
      }
      // On (re-)entry, make sure the skeleton is showing while the fresh canvas
      // initialises. Functional update keeps `ready` out of the dep array.
      if (first) {
        first = false;
        setReady((r) => (r ? false : r));
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(grace);
      clearTimeout(fallback);
    };
  }, [ref, active]);

  return ready;
}
