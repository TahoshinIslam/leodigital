import "server-only";

/**
 * Core Web Vitals aggregation (in-process, last 500 samples per metric+path).
 * Each sample is also written to the server log as one JSON line so it can be
 * shipped to any log/analytics tool. The admin dashboard reads the p75 values,
 * which is the percentile Google uses to judge "good".
 */
type Sample = { name: string; value: number; rating: string; path: string };
const g = globalThis as unknown as { __leotechVitals?: Map<string, number[]> };
const store = (g.__leotechVitals ??= new Map());

export function record(s: Sample) {
  console.info(JSON.stringify({ type: "web-vital", ...s, at: new Date().toISOString() }));
  for (const key of [`${s.name}|*`, `${s.name}|${s.path}`]) {
    const arr = store.get(key) ?? [];
    arr.push(s.value);
    if (arr.length > 500) arr.shift();
    store.set(key, arr);
  }
}

const p75 = (xs: number[]) => {
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.75))];
};

/** Google's "good" thresholds. CLS is stored ×1000. */
export const THRESHOLDS = { LCP: [2500, 4000], INP: [200, 500], CLS: [100, 250], FCP: [1800, 3000], TTFB: [800, 1800] } as const;

export function summary() {
  return (Object.keys(THRESHOLDS) as (keyof typeof THRESHOLDS)[]).map((name) => {
    const xs = store.get(`${name}|*`) ?? [];
    const v = xs.length ? p75(xs) : null;
    const [good, poor] = THRESHOLDS[name];
    return { name, p75: v, samples: xs.length, rating: v === null ? null : v <= good ? "good" : v <= poor ? "needs-improvement" : "poor" };
  });
}
