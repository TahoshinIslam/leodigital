import "server-only";
import { unstable_rethrow } from "next/navigation";
import type { Permission } from "@/lib/auth/permissions";
import { assertCan, requireUser } from "@/server/auth/guard";
import type { SessionUser } from "@/server/auth/session";
import { isAppError } from "@/server/http/errors";
import { toErrorBody } from "@/server/http/report";
import { enforce, LIMITS } from "@/server/security/rate-limit";
import { requestMeta } from "@/server/security/request";
import { getAdminT } from "@/lib/i18n/admin";

import type { ActionState } from "@/lib/action-state";

export type { ActionState };

/**
 * The Server Action counterpart of `api()`: authenticates, checks the RBAC
 * permission, rate limits writes per user and converts any thrown error into
 * a safe ActionState. Redirects and notFound() are re-thrown so Next.js can
 * handle them. (Next.js already rejects Server Action calls whose Origin
 * doesn't match the Host — that's the CSRF protection for actions.)
 */
export function action(
  permission: Permission,
  fn: (args: { user: SessionUser; ip: string; formData: FormData }) => Promise<Partial<ActionState> | void>,
) {
  return async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
    try {
      const user = await requireUser();
      assertCan(user, permission);
      const { ip } = await requestMeta();
      enforce(`action-write:u${user.id}`, LIMITS.adminWrite);
      const out = await fn({ user, ip, formData });
      return { ok: true, at: Date.now(), ...(out ?? {}) };
    } catch (err) {
      unstable_rethrow(err);
      return localizeError(err);
    }
  };
}

/** Turn any error into an ActionState in the admin's language. */
export async function localizeError(err: unknown): Promise<ActionState> {
  const { body } = toErrorBody(err);
  const t = await getAdminT();
  const e = body.error;
  const known = e.message === "Incorrect email or password" ? t.errors.INVALID_LOGIN : t.lang === "bn" ? t.errors[e.code] : undefined;
  const msg = isAppError(err) ? (known ?? e.message) : `${t.errors.INTERNAL_ERROR} (ref ${e.requestId})`;
  const fieldErrors = e.details
    ? Object.fromEntries(Object.entries(e.details).map(([k, v]) => [k, v.map((m) => t.fieldMessages[m] ?? lengthMessage(m, t.lang) ?? m)]))
    : undefined;
  return { ok: false, at: Date.now(), message: msg, fieldErrors };
}

/** "Must be at least/most N characters" in Bangla. */
function lengthMessage(m: string, lang: "en" | "bn"): string | undefined {
  if (lang !== "bn") return undefined;
  const r = /^(?:Must be|Use) at (least|most) (\d+) characters$/.exec(m);
  if (!r) return undefined;
  const n = Number(r[2]).toLocaleString("bn-BD");
  return r[1] === "least" ? `কমপক্ষে ${n} অক্ষর দিন` : `সর্বোচ্চ ${n} অক্ষর দেওয়া যাবে`;
}
