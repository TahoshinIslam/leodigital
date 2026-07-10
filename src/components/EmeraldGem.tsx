"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Orbit = { r: number; s: number; size: number; y: number; phase: number };

const ORBITS: Omit<Orbit, "phase">[] = [
  { r: 3.1, s: 0.42, size: 0.38, y: 0.9 },
  { r: 3.5, s: -0.3, size: 0.3, y: -0.7 },
  { r: 2.8, s: 0.55, size: 0.24, y: -1.3 },
  { r: 3.9, s: 0.24, size: 0.32, y: 1.4 },
];

/** Revealed only when WebGL is unavailable, blocked, or context creation fails. */
function GemFallback({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      hidden
      aria-hidden
      className="animate-glow-drift h-full w-full"
      style={{
        background:
          "radial-gradient(45% 45% at 50% 45%, rgba(46,204,143,0.55), rgba(23,160,110,0.25) 45%, transparent 72%)",
      }}
    />
  );
}

export default function EmeraldGem() {
  const ref = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const size = () => ({ w: canvas.clientWidth, h: canvas.clientHeight });

    // WebGLRenderer throws if a context cannot be created (WebGL disabled,
    // blocklisted GPU, headless). Degrade to a static glow instead of letting
    // the error tear down the page through the nearest error boundary. The
    // swap is done on the nodes rather than via state: markup then matches on
    // the server and the client, and no re-render is queued from an effect.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      canvas.hidden = true;
      if (fallbackRef.current) fallbackRef.current.hidden = false;
      return;
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    const { w, h } = size();
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50);
    camera.position.set(0, 0, 7);

    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x17a06e,
      metalness: 0.25,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      flatShading: true,
      emissive: 0x052e21,
      emissiveIntensity: 0.6,
    });
    const gemGeo = new THREE.IcosahedronGeometry(1.9, 0);
    const gem = new THREE.Mesh(gemGeo, gemMat);
    scene.add(gem);

    const shardMat = new THREE.MeshPhysicalMaterial({
      color: 0x2ecc8f,
      metalness: 0.3,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      flatShading: true,
      emissive: 0x063826,
      emissiveIntensity: 0.7,
    });

    const shardGeos: THREE.BufferGeometry[] = [];
    const shards = ORBITS.map((o, i) => {
      const geo = new THREE.IcosahedronGeometry(o.size, 0);
      shardGeos.push(geo);
      const mesh = new THREE.Mesh(geo, shardMat);
      mesh.userData = { ...o, phase: i * 1.7 } satisfies Orbit;
      scene.add(mesh);
      return mesh;
    });

    scene.add(new THREE.AmbientLight(0xd7fff0, 0.5));
    const key = new THREE.DirectionalLight(0xbfffe0, 2.4);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2ecc8f, 1.8);
    rim.position.set(-5, -2, -4);
    scene.add(rim);
    const under = new THREE.PointLight(0x7df0b4, 1.2, 12);
    under.position.set(0, -3, 2);
    scene.add(under);

    let mx = 0;
    let my = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();

    const frame = () => {
      const t = clock.getElapsedTime();
      if (!reduce) {
        gem.rotation.x = t * 0.14 + my * 0.12;
        gem.rotation.y = t * 0.2 + mx * 0.12;
        gem.position.y = Math.sin(t * 0.7) * 0.15;
        for (const m of shards) {
          const u = m.userData as Orbit;
          const a = t * u.s + u.phase;
          m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.9 + u.phase) * 0.2, Math.sin(a) * 1.4);
          m.rotation.x = t * 0.5 + u.phase;
          m.rotation.y = t * 0.4;
        }
      }
      camera.position.x += (mx * 0.4 - camera.position.x) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    frame();

    const onResize = () => {
      const s = size();
      if (!s.w || !s.h) return;
      renderer.setSize(s.w, s.h, false);
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      gemGeo.dispose();
      shardGeos.forEach((g) => g.dispose());
      gemMat.dispose();
      shardMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="h-full w-full">
      <GemFallback ref={fallbackRef} />
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
