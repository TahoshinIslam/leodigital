import "server-only";
import { cookies } from "next/headers";
import { adminBn } from "@/lib/i18n/admin/bn";
import { adminEn, type AdminDict } from "@/lib/i18n/admin/en";

export const ADMIN_LANG_COOKIE = "admin_lang";

/** The admin's chosen interface language (cookie), English by default. */
export async function getAdminLang(): Promise<"en" | "bn"> {
  return (await cookies()).get(ADMIN_LANG_COOKIE)?.value === "bn" ? "bn" : "en";
}

export async function getAdminT(): Promise<AdminDict> {
  return (await getAdminLang()) === "bn" ? adminBn : adminEn;
}

export { adminDict } from "@/lib/i18n/admin/pick";
