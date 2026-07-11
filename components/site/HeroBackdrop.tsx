"use client";

import { useCallback, useRef, useState } from "react";
import { useCanvasReady } from "@/components/site/anim/useCanvasReady";
import Hyperspeed, { type HyperspeedOptions } from "@/components/site/Hyperspeed";

/**
 * Module-level constant, not an inline literal: a fresh object identity on each
 * render is a new `effectOptions`, which tears down and rebuilds the WebGL scene.
 *
 * Palette is the site's own — accent green #49DC7A and the cyan #22F2EF already
 * used by the cursor glow — over the page's near-black #040A0A.
 */
const LEOTECH_HYPERSPEED: HyperspeedOptions = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [12, 80],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x071110,
    islandColor: 0x0a1512,
    background: 0x040a0a,
    shoulderLines: 0x49dc7a,
    brokenLines: 0x1c4a38,
    // Receding traffic: accent green. Approaching traffic: the cyan accent.
    leftCars: [0x49dc7a, 0x2ecc8f, 0x17a06e],
    rightCars: [0x22f2ef, 0x1ae0de, 0x0e8f8d],
    sticks: 0x49dc7a,
  },
};

export default function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  // Bumped whenever the road's WebGL context is lost. Changing the key forces a
  // fresh Hyperspeed mount: the dead renderer/composer is disposed and a brand
  // new context + scene is built. This is what makes the road come back after a
  // context loss on refresh, instead of showing once and then vanishing.
  const [generation, setGeneration] = useState(0);
  const ready = useCanvasReady(ref, true);

  const handleContextLost = useCallback(() => {
    setGeneration((g) => g + 1);
  }, []);

  // The road is built once, at the top of the page, and kept.
  //
  // It used to unmount whenever the hero scrolled out of a 25% band, on the
  // theory that a scene nobody can see should not exist. But unmounting is not
  // free: coming back rebuilt the entire scene — new WebGL context, ~22 shader
  // compiles, fresh geometry — right in the middle of a scroll, which is what
  // made scrolling back to the top hitch. Hyperspeed now pauses its own render
  // loop while off-screen, so an idle road costs nothing and there is nothing to
  // reclaim by tearing it down.

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <Hyperspeed key={generation} effectOptions={LEOTECH_HYPERSPEED} onContextLost={handleContextLost} />
      <div
        className={`backdrop-skeleton pointer-events-none absolute inset-0 transition-opacity duration-700 ease-luxe ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
