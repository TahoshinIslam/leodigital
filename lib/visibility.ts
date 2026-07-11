"use client";

import { createContext, useContext } from "react";

/** A live on/off flag a render loop can poll every frame without re-rendering. */
export type VisibilityBox = { current: boolean };

/**
 * Published by FixedBackdrop, consumed by the scene inside it.
 *
 * A backdrop's canvas is `position: fixed`, which means it *always* intersects
 * the viewport no matter where the page is scrolled — observing the canvas
 * itself would report "visible" forever and never pause anything. Only the
 * section wrapper actually scrolls, so FixedBackdrop observes that and hands the
 * result down through here.
 */
export const SceneVisibility = createContext<VisibilityBox | null>(null);

/** Observe an element directly. Correct only for elements that scroll. */
export function watchVisibility(el: Element, rootMargin = "10% 0px") {
  const visible: VisibilityBox = { current: true };
  const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting), {
    rootMargin,
  });
  io.observe(el);
  return { visible, stop: () => io.disconnect() };
}

/**
 * The visibility box a scene should gate its render loop on: the one published
 * by an enclosing FixedBackdrop if there is one, otherwise null — in which case
 * the scene sits in normal flow and can just observe its own canvas.
 */
export function useSceneVisibility(): VisibilityBox | null {
  return useContext(SceneVisibility);
}
