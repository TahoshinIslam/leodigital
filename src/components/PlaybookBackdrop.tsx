"use client";

import FixedBackdrop from "@/components/anim/FixedBackdrop";
import Antigravity from "@/components/Antigravity";

export default function PlaybookBackdrop() {
  return (
    <FixedBackdrop>
      {/* This section is almost entirely body copy, so the field is held back —
          it should register as texture behind the words, never compete. */}
      <div className="h-full w-full opacity-50">
        <Antigravity
          count={5000}
          // magnetRadius is in *world* units, not pixels. At full-viewport scale
          // the camera sees ~50x31 units, so the furthest particle spawns
          // hypot(25.2, 15.75) = 29.7 from centre. A particle outside the field
          // targets its own spawn point — i.e. never moves — so anything near the
          // component's default of 10 freezes most of the field into dust.
          magnetRadius={32}
          ringRadius={13}
          fieldStrength={6}
          particleSize={1.15}
          particleVariance={0.8}
          waveSpeed={0.35}
          waveAmplitude={1.2}
          lerpSpeed={0.04}
          rotationSpeed={0.06}
          pulseSpeed={2.2}
          depthFactor={1.2}
          particleShape="capsule"
          color="#49DC7A"
          autoAnimate={false}
          followWindowPointer
        />
      </div>
    </FixedBackdrop>
  );
}
