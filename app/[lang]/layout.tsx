import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { contentFor } from "@/content";
import { siteUrl } from "@/lib/site-url";
import { isLocale, LOCALE_META, LOCALES } from "@/lib/i18n/config";
import SiteShell from "@/views/site/layout/SiteShell";

/** Both languages are prerendered. */
export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { ui } = contentFor(lang);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: ui.meta.title, template: lang === "bn" ? "%s | লিওটেক" : "%s | Leotech" },
    description: ui.meta.description,
    applicationName: "Leotech",
    icons: { icon: "/favicon.ico" },
    openGraph: { type: "website", siteName: "Leotech", locale: ui.meta.ogLocale },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#040a0a", colorScheme: "dark" };

/** Root layout for the public site. `<html lang>` follows the URL's locale. */
export default async function SiteRootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={LOCALE_META[lang].htmlLang} suppressHydrationWarning>
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
