"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import EmeraldGem from "@/components/site/EmeraldGem";

// The gem is only ever shown at lg+, so gate the mount there too — no point
// holding a WebGL context on viewports that never display it.
const QUERY = "(min-width: 1024px)";

function useIsWide() {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(QUERY);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Gated mount for the decorative Industries gem: built the first time the
 * section is approached, and only at lg+ where it is actually shown.
 *
 * The mount is one-way. Unmounting on scroll was previously used to stay under
 * the browser's concurrent-context cap — but EmeraldGem's teardown never
 * released its context (Three's `dispose()` does not), so the unmount freed
 * nothing and merely rebuilt the scene on every crossing. The context release is
 * fixed at the source now, and the gem pauses itself off-screen, so it is kept
 * once built.
 */
export default function IndustriesGem() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const isWide = useIsWide();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setMounted(true);
      io.disconnect();
    }, { rootMargin: "30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {isWide && mounted && <EmeraldGem />}
    </div>
  );
}
