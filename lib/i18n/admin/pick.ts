import { adminBn } from "@/lib/i18n/admin/bn";
import { adminEn, type AdminDict } from "@/lib/i18n/admin/en";

export const adminDict = (lang: "en" | "bn"): AdminDict => (lang === "bn" ? adminBn : adminEn);
