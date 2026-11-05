import "server-only";
import { redirect } from "next/navigation";
import { can, type Permission } from "@/lib/auth/permissions";
import { forbidden, unauthenticated } from "@/server/http/errors";
import { getSessionUser, type SessionUser } from "@/server/auth/session";

/**
 * Authorization helpers. Every protected read and write calls one of these on
 * the server — the proxy only does a fast "is there a cookie?" redirect and is
 * never relied on for security.
 */

/** For pages: redirect to login when signed out. */
export async function requirePageUser(next?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(next ? `/admin/login?next=${encodeURIComponent(next)}` : "/admin/login");
  return user;
}

/** For actions, route handlers and domain functions: throw 401/403 AppErrors. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw unauthenticated();
  return user;
}

export function assertCan(user: Pick<SessionUser, "role">, permission: Permission) {
  if (!can(user.role, permission)) throw forbidden();
}

export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireUser();
  assertCan(user, permission);
  return user;
}
