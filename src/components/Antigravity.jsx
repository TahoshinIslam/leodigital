"use client";

// Adapted from React Bits "Antigravity" (MIT). Local changes:
//  - an error boundary so a failed WebGL context cannot tear down the page
//  - honours prefers-reduced-motion (renders a single frame, no rAF loop)
//  - accepts a `dpr` cap, since this runs full-bleed behind a long section
//  - seeded PRNG instead of Math.random() when seeding particles: calling an
//    impure global during render is what React's purity rule forbids, and a
//    fixed seed keeps the field identical between renders

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** mulberry32 — small, fast, deterministic. */
function makeRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AntigravityInner = ({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = "#FF9FFC",
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
  followWindowPointer = false,
}) => {
  const meshRef = useRef(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  // R3F's own pointer only updates from events on its canvas. As a background the
  // canvas sits behind the page content, so those events almost never fire. Track
  // the pointer at the window instead and map it to the same NDC space (-1..1,
  // y up) R3F uses, so the ring follows the cursor across the whole section.
  const windowPointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!followWindowPointer) return;
    const onMove = (e) => {
      windowPointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      windowPointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [followWindowPointer]);

  const particles = useMemo(() => {
    const rand = makeRandom(0x1e07ec4);
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = rand() * 100;
      const factor = 20 + rand() * 100;
      const speed = 0.01 + rand() / 200;
      const xFactor = -50 + rand() * 100;
      const yFactor = -50 + rand() * 100;
      const zFactor = -50 + rand() * 100;

      const x = (rand() - 0.5) * width;
      const y = (rand() - 0.5) * height;
      const z = (rand() - 0.5) * 20;

      const randomRadiusOffset = (rand() - 0.5) * 2;

      temp.push({
        t, factor, speed, xFactor, yFactor, zFactor,
        mx: x, my: y, mz: z,
        cx: x, cy: y, cz: z,
        vx: 0, vy: 0, vz: 0,
        randomRadiusOffset,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v } = state;
    const m = followWindowPointer ? windowPointer.current : state.pointer;

    const mouseDist = Math.sqrt(
      Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2),
    );

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((particle, i) => {
      let { t } = particle;
      const { speed, mx, my, mz, cz, randomRadiusOffset } = particle;

      t = particle.t += speed / 2;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const targetPos = { x: mx, y: my, z: mz * depthFactor };

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;

        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));

        const currentRingRadius = ringRadius + wave + deviation;

        targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPos.z = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);

      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2),
      );

      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      let scaleFactor = 1 - distFromRing / 10;

      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale =
        scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === "capsule" && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === "sphere" && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === "box" && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === "tetrahedron" && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </instancedMesh>
  );
};

/** A lost or unavailable WebGL context throws during Canvas setup. Swallow it:
 *  the section keeps its flat background rather than the page collapsing. */
class GLBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.warn("[Antigravity] disabled:", error?.message ?? error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const Antigravity = ({ dpr = [1, 1.5], ...props }) => {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <GLBoundary>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 35 }}
        dpr={dpr}
        // "demand" renders a single frame and then idles.
        frameloop={reduce ? "demand" : "always"}
      >
        <AntigravityInner {...props} />
      </Canvas>
    </GLBoundary>
  );
};

export default Antigravity;
