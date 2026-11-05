"use server";

import { redirect } from "next/navigation";
import { unstable_rethrow } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { isAppError } from "@/server/http/errors";
import { toErrorBody } from "@/server/http/report";
import { login, logout } from "@/server/modules/auth";
import { requestMeta } from "@/server/security/request";

/** Only same-site relative paths under /admin are honoured, to prevent open redirects. */
function safeNext(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v : "";
  return /^\/admin(?:[/?#]|$)/.test(s) && !s.startsWith("//") ? s : "/admin";
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const meta = await requestMeta();
  try {
    await login({ email: formData.get("email"), password: formData.get("password") }, meta);
  } catch (err) {
    unstable_rethrow(err);
    const { body } = toErrorBody(err);
    return { ok: false, at: Date.now(), message: isAppError(err) ? body.error.message : "Sign-in is unavailable right now.", fieldErrors: body.error.details };
  }
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  const { ip } = await requestMeta();
  await logout({ ip });
  redirect("/admin/login");
}
