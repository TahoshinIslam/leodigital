/**
 * Locales for the public site. English is the default and keeps the original
 * unprefixed URLs (/, /services/seo); Bangla lives under /bn (/bn/services/seo).
 * Safe to import from client and server.
 */
export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_META: Record<Locale, { label: string; htmlLang: string; hreflang: string }> = {
  en: { label: "English", htmlLang: "en", hreflang: "en" },
  bn: { label: "বাংলা", htmlLang: "bn", hreflang: "bn-BD" },
};

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Public URL path for `path` (which starts with "/") in `locale`. */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Split a public pathname into its locale and the locale-free path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const l of LOCALES) {
    if (pathname === `/${l}`) return { locale: l, path: "/" };
    if (pathname.startsWith(`/${l}/`)) return { locale: l, path: pathname.slice(l.length + 1) };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** `alternates` metadata for a locale-free path: canonical + hreflang for every locale. */
export function alternatesFor(locale: Locale, path: string) {
  const languages: Record<string, string> = { "x-default": localePath(DEFAULT_LOCALE, path) };
  for (const l of LOCALES) languages[LOCALE_META[l].hreflang] = localePath(l, path);
  return { canonical: localePath(locale, path), languages };
}
