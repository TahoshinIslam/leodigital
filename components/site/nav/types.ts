import type { SiteContent } from "@/content";
import type { Locale } from "@/lib/i18n/config";

export type NavService = {
  slug: string;
  title: string;
  eyebrow: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
};

/** Everything the (client) nav and menu need to say, already localised. */
export type NavCopy = {
  locale: Locale;
  links: { href: string; key: string; label: string }[];
  nav: SiteContent["ui"]["nav"];
  menu: SiteContent["ui"]["menu"];
  language: SiteContent["ui"]["language"];
  industries: { title: string; copy: string }[];
  phone: string;
  email: string;
};
