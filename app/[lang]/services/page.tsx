import type { Metadata } from "next";
import { contentFor } from "@/content";
import { alternatesFor, isLocale } from "@/lib/i18n/config";
import ServicesIndexView from "@/views/site/services/ServicesIndexView";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { ui } = contentFor(lang);
  return {
    title: ui.meta.servicesTitle,
    description: ui.meta.servicesDescription,
    alternates: alternatesFor(lang, "/services"),
    openGraph: { title: ui.meta.servicesTitle, url: alternatesFor(lang, "/services").canonical, locale: ui.meta.ogLocale },
  };
}

export default function ServicesPage() {
  return <ServicesIndexView />;
}
