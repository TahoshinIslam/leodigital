"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    if (!glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const loop = () => {
      x += (tx - x) * 0.11;
      y += (ty - y) * 0.11;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-2 -mt-80 -ml-80 h-[640px] w-[640px] rounded-full opacity-0 mix-blend-screen transition-opacity duration-700 will-change-transform"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, rgba(73,220,122,0.16), rgba(34,242,239,0.06) 46%, transparent 72%)",
      }}
    />
  );
}
