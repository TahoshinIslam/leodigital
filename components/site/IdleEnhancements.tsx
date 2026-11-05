"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useAfterIdle } from "@/lib/graphics";

// Nice-to-haves that nothing on first paint depends on: loaded in their own
// chunks once the main thread is idle.
const SmoothScroll = dynamic(() => import("@/components/site/anim/SmoothScroll"), { ssr: false });
const CursorGlow = dynamic(() => import("@/components/site/CursorGlow"), { ssr: false });

const finePointer = {
  subscribe: () => () => {},
  get: () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  server: () => false,
};

export default function IdleEnhancements() {
  const idle = useAfterIdle(2500);
  const mouse = useSyncExternalStore(finePointer.subscribe, finePointer.get, finePointer.server);
  if (!idle) return null;
  return (
    <>
      <SmoothScroll />
      {/* A cursor glow means nothing on touch screens. */}
      {mouse ? <CursorGlow /> : null}
    </>
  );
}
