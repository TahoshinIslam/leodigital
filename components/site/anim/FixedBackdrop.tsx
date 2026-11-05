"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCanvasReady } from "@/components/site/anim/useCanvasReady";

/**
 * A background that stays put while its section scrolls over it.
 *
 * `position: fixed` inside an ancestor carrying `clip-path: inset(0)` anchors to
 * that ancestor rather than the viewport, so the child is pinned *and* clipped
 * to the section instead of bleeding into the bands above and below.
 *
 * Children mount only while the section is near the viewport (on every screen
 * size, phones included), so a WebGL scene is never left running off-screen.
 */
export default function FixedBackdrop({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const mounted = near;
  const ready = useCanvasReady(host, mounted);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "40% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={sentinel} aria-hidden className="absolute inset-0 -z-10 [clip-path:inset(0)]">
      {mounted && (
        <>
          <div ref={host} className="fixed inset-0 flex items-center justify-center overflow-hidden">
            {children}
          </div>
          {/* Shimmer placeholder over the still-blank scene; fades out once the
              canvas is rendering. */}
          <div
            className={`backdrop-skeleton pointer-events-none fixed inset-0 transition-opacity duration-700 ease-luxe ${
              ready ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      )}
    </div>
  );
}
