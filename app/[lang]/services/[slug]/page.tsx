import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { contentFor } from "@/content";
import { alternatesFor, isLocale, localePath, LOCALES, type Locale } from "@/lib/i18n/config";
import { slug as slugSchema } from "@/lib/validation/common";
import { getPublishedService, getPublishedServices, getServiceRedirect } from "@/server/modules/services";
import ServiceDetailView from "@/views/site/services/ServiceDetailView";

type Props = PageProps<"/[lang]/services/[slug]">;

/** Prerender every published service in every language; new ones render on first visit and are then cached. */
export async function generateStaticParams() {
  const services = await getPublishedServices();
  const slugs = services.length ? services.map((s) => s.slug) : ["seo"];
  // Cache Components needs at least one sample param per segment.
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

async function load(lang: Locale, rawSlug: string) {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) return null;
  return getPublishedService(parsed.data, lang);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const s = await load(lang, slug);
  if (!s) return { title: lang === "bn" ? "সার্ভিস পাওয়া যায়নি" : "Service not found", robots: { index: false } };
  const title = s.seoTitle || s.title;
  const description = s.seoDescription || s.summary;
  const image = s.ogImage || s.heroImage;
  const path = `/services/${s.slug}`;
  const alternates = alternatesFor(lang, path);
  return {
    // seoTitle is the full title as the admin wrote it; otherwise use the template.
    title: s.seoTitle ? { absolute: s.seoTitle } : s.title,
    description,
    alternates: s.canonicalUrl ? { ...alternates, canonical: s.canonicalUrl } : alternates,
    robots: s.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: alternates.canonical,
      locale: contentFor(lang).ui.meta.ogLocale,
      ...(image ? { images: [{ url: image, alt: s.heroImageAlt ?? s.title }] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
}

export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const service = await load(lang, slug);
  if (!service) {
    const moved = slugSchema.safeParse(slug).success ? await getServiceRedirect(slug) : null;
    if (moved) permanentRedirect(localePath(lang, `/services/${moved}`));
    notFound();
  }
  const all = await getPublishedServices(lang);
  const related = all.filter((s) => s.id !== service.id).slice(0, 3);
  return <ServiceDetailView service={service} related={related} locale={lang} content={contentFor(lang)} />;
}
