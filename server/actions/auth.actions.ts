"use server";

import { redirect } from "next/navigation";
import { unstable_rethrow } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { localizeError } from "@/server/http/action";
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
    return localizeError(err);
  }
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  const { ip } = await requestMeta();
  await logout({ ip });
  redirect("/admin/login");
}
