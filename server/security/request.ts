import "server-only";
import { headers } from "next/headers";

/**
 * Client IP for rate limiting and audit logs. Uses the right-most
 * X-Forwarded-For entry — the one appended by the nearest proxy (Next's own
 * server, or nginx/Apache in front of it) — because left-most entries are
 * client-supplied and trivially spoofed.
 */
export function clientIpFrom(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last.slice(0, 45);
  }
  return (h.get("x-real-ip") ?? "unknown").slice(0, 45);
}

export async function requestMeta() {
  const h = await headers();
  return { ip: clientIpFrom(h), userAgent: h.get("user-agent") };
}

/**
 * CSRF defence for cookie-authenticated Route Handlers: an unsafe method must
 * come from our own origin. Browsers always send Origin on cross-site POST /
 * PATCH / DELETE, so a missing or foreign Origin is rejected. (Server Actions
 * get the same check from Next.js itself.)
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  if (!origin) return fetchSite === "same-origin";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
