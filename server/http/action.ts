import "server-only";
import { unstable_rethrow } from "next/navigation";
import type { Permission } from "@/lib/auth/permissions";
import { assertCan, requireUser } from "@/server/auth/guard";
import type { SessionUser } from "@/server/auth/session";
import { isAppError } from "@/server/http/errors";
import { toErrorBody } from "@/server/http/report";
import { enforce, LIMITS } from "@/server/security/rate-limit";
import { requestMeta } from "@/server/security/request";

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
      const { body } = toErrorBody(err);
      return {
        ok: false,
        at: Date.now(),
        message: isAppError(err) ? body.error.message : `${body.error.message} (ref ${body.error.requestId})`,
        fieldErrors: body.error.details,
      };
    }
  };
}
