import "server-only";
import { rateLimited } from "@/server/http/errors";

/**
 * Fixed-window rate limiter held in process memory. It is correct for a single
 * Node process (local XAMPP, a single VPS). When running several instances
 * behind a load balancer, swap the store for Redis — the call sites stay the same.
 */
type Bucket = { count: number; resetAt: number };
const g = globalThis as unknown as { __leotechRate?: Map<string, Bucket>; __leotechRateSweep?: NodeJS.Timeout };
const store = (g.__leotechRate ??= new Map());

if (!g.__leotechRateSweep) {
  g.__leotechRateSweep = setInterval(() => {
    const now = Date.now();
    for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
  }, 60_000);
  g.__leotechRateSweep.unref?.();
}

export type Limit = { limit: number; windowSec: number };

export const LIMITS = {
  login: { limit: 5, windowSec: 15 * 60 },        // per IP+email
  loginIp: { limit: 30, windowSec: 15 * 60 },     // per IP, any email
  adminWrite: { limit: 60, windowSec: 60 },       // per user
  upload: { limit: 20, windowSec: 10 * 60 },      // per user
  publicApi: { limit: 120, windowSec: 60 },       // per IP
} satisfies Record<string, Limit>;

export function check(key: string, { limit, windowSec }: Limit) {
  const now = Date.now();
  let b = store.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowSec * 1000 };
    store.set(key, b);
  }
  b.count += 1;
  const remaining = Math.max(0, limit - b.count);
  const retryAfter = Math.ceil((b.resetAt - now) / 1000);
  return { ok: b.count <= limit, remaining, retryAfter };
}

/** Throws a 429 AppError when the key is over its limit. */
export function enforce(key: string, limit: Limit) {
  const r = check(key, limit);
  if (!r.ok) throw rateLimited(r.retryAfter);
  return r;
}

export function reset(key: string) {
  store.delete(key);
}
