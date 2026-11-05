import "server-only";
import { fieldErrors } from "@/lib/validation/common";
import { loginInput } from "@/lib/validation/user";
import { verifyPassword } from "@/server/auth/password";
import { createSession, destroySession, getSessionUser } from "@/server/auth/session";
import { AppError, validationError } from "@/server/http/errors";
import * as audit from "@/server/repositories/audit.repository";
import * as users from "@/server/repositories/user.repository";
import { enforce, LIMITS, reset } from "@/server/security/rate-limit";

const INVALID = new AppError("UNAUTHENTICATED", 401, "Incorrect email or password");

/**
 * Credential check + session creation. Rate limited per IP and per IP+email,
 * constant-time against unknown emails, and the same message for every failure
 * so the form never reveals which accounts exist.
 */
export async function login(raw: unknown, meta: { ip: string; userAgent: string | null }) {
  const parsed = loginInput.safeParse(raw);
  if (!parsed.success) throw validationError(fieldErrors(parsed.error));
  const { email, password } = parsed.data;

  enforce(`login-ip:${meta.ip}`, LIMITS.loginIp);
  const pairKey = `login:${meta.ip}:${email}`;
  enforce(pairKey, LIMITS.login);

  const found = await users.findForLogin(email);
  const ok = await verifyPassword(password, found?.passwordHash ?? null);
  if (!found || !ok || !found.user.isActive) {
    if (found) {
      await audit.insert({ userId: found.user.id, action: "auth.login_failed", entityType: "user", entityId: found.user.id, summary: "Failed sign-in attempt", ip: meta.ip });
    }
    throw INVALID;
  }

  reset(pairKey);
  await createSession(found.user.id, meta);
  await users.touchLogin(found.user.id);
  await audit.insert({ userId: found.user.id, action: "auth.login", entityType: "user", entityId: found.user.id, summary: "Signed in", ip: meta.ip });
  return found.user;
}

export async function logout(meta: { ip: string }) {
  const user = await getSessionUser();
  await destroySession();
  if (user) await audit.insert({ userId: user.id, action: "auth.logout", entityType: "user", entityId: user.id, summary: "Signed out", ip: meta.ip });
}
