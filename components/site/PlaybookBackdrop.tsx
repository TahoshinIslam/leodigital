"use client";

import FixedBackdrop from "@/components/site/anim/FixedBackdrop";
import DotField from "@/components/site/DotField";

export default function PlaybookBackdrop() {
  return (
    <FixedBackdrop>
      {/* This section is almost entirely body copy, so the field is held back —
          it should register as texture behind the words, never compete. Tinted
          to the site's own palette: accent green #4DDD7F into cyan #22F2EF, with
          a soft green cursor glow. */}
      <div className="h-full w-full opacity-90">
        <DotField
          dotRadius={1.5}
          dotSpacing={5}
          bulgeStrength={60}
          glowRadius={230}
          sparkle
          waveAmplitude={0}
          cursorForce={0.12}
          gradientFrom="rgba(77, 221, 127, 0.55)"
          gradientTo="rgba(34, 242, 239, 0.34)"
          glowColor="rgba(73, 220, 122, 0.32)"
        />
      </div>
    </FixedBackdrop>
  );
}
