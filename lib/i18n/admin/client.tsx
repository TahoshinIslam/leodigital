"use client";

import { createContext, useContext } from "react";
import type { AdminDict } from "@/lib/i18n/admin/en";
import { adminDict } from "@/lib/i18n/admin/pick";

const Ctx = createContext<"en" | "bn">("en");

/** Makes the admin language available to client components (which import the dictionaries themselves). */
export function AdminLangProvider({ lang, children }: { lang: "en" | "bn"; children: React.ReactNode }) {
  return <Ctx value={lang}>{children}</Ctx>;
}

export function useAdminT(): AdminDict {
  return adminDict(useContext(Ctx));
}
