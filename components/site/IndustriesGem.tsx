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
 * Gated mount for the decorative Industries gem. Previously EmeraldGem was
 * rendered unconditionally (only CSS-hidden), so it held a live WebGL context
 * for the entire page — one of up to four concurrent contexts. Browsers cap
 * concurrent contexts and evict the oldest (the hero road) when the cap is hit,
 * which is what made the hero background vanish. Mount only while the section is
 * near the viewport and only at lg+.
 */
export default function IndustriesGem() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const isWide = useIsWide();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "30% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {isWide && near && <EmeraldGem />}
    </div>
  );
}
