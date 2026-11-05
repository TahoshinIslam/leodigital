import { lang } from "next/root-params";
import * as bn from "@/content/bn";
import * as en from "@/content/site";
import { isLocale, type Locale } from "@/lib/i18n/config";

/** Everything the public site says, per locale. */
export type SiteContent = typeof en;
const CONTENT: Record<Locale, SiteContent> = { en, bn: bn as unknown as SiteContent };

export function contentFor(locale: Locale): SiteContent {
  return CONTENT[locale];
}

/** The current request's locale, from the `[lang]` root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  return isLocale(l) ? l : "en";
}

/** Content for the current request's locale. Server Components only. */
export async function getContent(): Promise<SiteContent & { locale: Locale }> {
  const locale = await getLocale();
  return { ...CONTENT[locale], locale };
}
