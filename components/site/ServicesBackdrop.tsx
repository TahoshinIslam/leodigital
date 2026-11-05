"use client";

import FixedBackdrop from "@/components/site/anim/FixedBackdrop";
import Orb from "@/components/site/Orb";

export default function ServicesBackdrop() {
  return (
    <FixedBackdrop>
      {/* Square keyed to viewport height, then pushed slightly past it. The orb's
          radius follows the container's *smaller* axis, so sizing off the width
          would blow it up to twice the visible height. */}
      <div className="h-[112vh] w-[112vh]">
        {/* hue 0: the shader's base colours are already the brand palette. */}
        <Orb hue={0} hoverIntensity={0.22} rotateOnHover backgroundColor="#091312" />
      </div>
    </FixedBackdrop>
  );
}
