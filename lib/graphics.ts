"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Should this device run the decorative WebGL scenes?
 *
 * The scenes are pure decoration, so they are skipped (a static gradient shows
 * instead) when they would cost the visitor more than they give:
 *  - reduced motion (OS setting or the site's Motion toggle),
 *  - Data Saver on,
 *  - a low-end device (≤ 2 GB memory or ≤ 2 CPU cores),
 *  - no WebGL, or WebGL running in software (SwiftShader / llvmpipe), where a
 *    full-screen shader pins the CPU and wrecks scrolling and INP.
 *
 * Computed once per page load. The server snapshot is `false`, so the server
 * never renders a scene and hydration always matches.
 */
let cached: boolean | undefined;

function detect(): boolean {
  if (cached !== undefined) return cached;
  cached = (() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (document.documentElement.dataset.motion === "off") return false;
      const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
      if (nav.connection?.saveData) return false;
      if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return false;
      if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return false;

      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
      if (!gl) return false;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    } catch {
      return false;
    }
  })();
  return cached;
}

const noop = () => () => {};

export function useRichGraphics(): boolean {
  return useSyncExternalStore(noop, detect, () => false);
}

/**
 * True once the page has painted and the main thread is idle (or after
 * `timeout` ms). Heavy scenes start after this, so they never compete with the
 * first paint, the LCP element or the first interaction.
 */
export function useAfterIdle(timeout = 2000): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let id: number | undefined;
    let t: ReturnType<typeof setTimeout> | undefined;
    const go = () => setIdle(true);
    const schedule = () => {
      if ("requestIdleCallback" in window) id = window.requestIdleCallback(go, { timeout });
      else t = setTimeout(go, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (id !== undefined) window.cancelIdleCallback(id);
      if (t) clearTimeout(t);
    };
  }, [timeout]);
  return idle;
}
