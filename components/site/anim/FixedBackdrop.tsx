"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCanvasReady } from "@/components/site/anim/useCanvasReady";
import { SceneVisibility, type VisibilityBox } from "@/lib/visibility";

/**
 * A background that stays put while its section scrolls over it.
 *
 * `position: fixed` inside an ancestor carrying `clip-path: inset(0)` anchors to
 * that ancestor rather than the viewport, so the child is pinned *and* clipped
 * to the section instead of bleeding into the bands above and below.
 *
 * Children mount lazily — nothing is built until the section is first
 * approached — but the mount is one-way: once a scene exists it is kept, never
 * torn down on scroll.
 *
 * It used to unmount whenever the section left the rootMargin band. That looked
 * frugal but was the opposite: scrolling up and down past a section rebuilt the
 * whole scene each crossing (new WebGL context, ~30 shader compiles, fresh
 * buffers), which both janked the scroll and leaked contexts until the browser
 * hit its cap and evicted the hero's. The scene is kept instead, and pauses
 * itself while the section is off-screen — parking a rAF loop is free, rebuilding
 * a scene is not.
 *
 * The pause signal is taken from the sentinel, not the canvas: the canvas is
 * `position: fixed` and so intersects the viewport at every scroll position,
 * whereas the sentinel travels with the section and is the only honest witness to
 * whether the backdrop is actually on screen.
 */
export default function FixedBackdrop({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const ready = useCanvasReady(host, mounted);
  // A mutable box whose identity is stable for the component's life. Held in
  // state purely for that stability — it is never *set*: the render loop polls
  // it every frame and must not re-render the tree to learn the section scrolled
  // away, which is exactly what real state would do.
  const [visible] = useState<VisibilityBox>(() => ({ current: false }));

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;

    // Build once, on first approach, and never tear down.
    const mountIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMounted(true);
        mountIo.disconnect();
      },
      { rootMargin: "40% 0px" },
    );
    mountIo.observe(el);

    // Render only while the section is actually on screen.
    const visIo = new IntersectionObserver(
      ([entry]) => (visible.current = entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    visIo.observe(el);

    return () => {
      mountIo.disconnect();
      visIo.disconnect();
    };
  }, [visible]);

  return (
    <div ref={sentinel} aria-hidden className="absolute inset-0 -z-10 [clip-path:inset(0)]">
      {mounted && (
        <>
          <div ref={host} className="fixed inset-0 flex items-center justify-center overflow-hidden">
            <SceneVisibility.Provider value={visible}>{children}</SceneVisibility.Provider>
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
