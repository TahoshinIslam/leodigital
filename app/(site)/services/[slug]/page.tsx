import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { slug as slugSchema } from "@/lib/validation/common";
import { getPublishedService, getPublishedServices, getServiceRedirect } from "@/server/modules/services";
import ServiceDetailView from "@/views/site/services/ServiceDetailView";

type Props = { params: Promise<{ slug: string }> };

/** Prerender every published service at build; new ones render on first visit and are then cached. */
export async function generateStaticParams() {
  const services = await getPublishedServices();
  // Cache Components needs at least one sample param to validate the route.
  return services.length ? services.map((s) => ({ slug: s.slug })) : [{ slug: "seo" }];
}

async function load(rawSlug: string) {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) return null;
  return getPublishedService(parsed.data);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await load(slug);
  if (!s) return { title: "Service not found", robots: { index: false } };
  const title = s.seoTitle || s.title;
  const description = s.seoDescription || s.summary;
  const image = s.ogImage || s.heroImage;
  return {
    // seoTitle is the full title as the admin wrote it; otherwise use the template.
    title: s.seoTitle ? { absolute: s.seoTitle } : s.title,
    description,
    alternates: { canonical: s.canonicalUrl || `/services/${s.slug}` },
    robots: s.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `/services/${s.slug}`,
      ...(image ? { images: [{ url: image, alt: s.heroImageAlt ?? s.title }] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await load(slug);
  if (!service) {
    const moved = slugSchema.safeParse(slug).success ? await getServiceRedirect(slug) : null;
    if (moved) permanentRedirect(`/services/${moved}`);
    notFound();
  }
  const all = await getPublishedServices();
  const related = all.filter((s) => s.id !== service.id).slice(0, 3);
  return <ServiceDetailView service={service} related={related} />;
}
