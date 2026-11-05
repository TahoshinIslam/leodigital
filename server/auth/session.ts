import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Role } from "@/lib/auth/permissions";
import { secureCookies, sessionCookieName } from "@/lib/auth/cookie";
import { env } from "@/server/env";
import * as sessions from "@/server/repositories/session.repository";

/**
 * Opaque, database-backed sessions:
 *  - the cookie holds 32 random bytes; the DB stores only their SHA-256, so
 *    sessions can be revoked instantly (logout, password change, deactivation);
 *  - HttpOnly (no JS access), SameSite=Lax (not sent on cross-site POSTs),
 *    Secure + __Host- prefix whenever the site URL is https (host-locked, path=/).
 */
export const SESSION_COOKIE = sessionCookieName();

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export type SessionUser = { id: number; name: string; email: string; role: Role; sessionId: string };

export async function createSession(userId: number, meta: { ip: string | null; userAgent: string | null }) {
  const token = randomBytes(32).toString("base64url");
  const ttlMs = env().SESSION_TTL_HOURS * 3600_000;
  const expiresAt = new Date(Date.now() + ttlMs);
  await sessions.create({ idHash: hash(token), userId, expiresAt, ...meta });
  // Opportunistic clean-up; cheap thanks to the expires_at index.
  sessions.purgeExpired().catch(() => {});

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

/** The signed-in user for this request, or null. Deduplicated per request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const row = await sessions.findValid(hash(token));
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, role: row.role, sessionId: row.session_id };
});

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await sessions.remove(hash(token));
  jar.delete(SESSION_COOKIE);
}
