import type { MetadataRoute } from "next";
import { localePath, LOCALE_META, LOCALES } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site-url";
import { getPublishedServices } from "@/server/modules/services";

/**
 * One entry per page per language, each listing its translations as hreflang
 * alternates. Regenerates whenever an admin change expires the services tag.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getPublishedServices();
  const latest = services.reduce((max, s) => (s.updatedAt > max ? s.updatedAt : max), "1970-01-01T00:00:00.000Z");

  const entry = (path: string, extra: Partial<MetadataRoute.Sitemap[number]>) =>
    LOCALES.map((l) => ({
      url: absoluteUrl(localePath(l, path)),
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [LOCALE_META[x].hreflang, absoluteUrl(localePath(x, path))])) },
      ...extra,
    }));

  return [
    ...entry("/", { changeFrequency: "weekly", priority: 1 }),
    ...entry("/services", { lastModified: latest, changeFrequency: "weekly", priority: 0.9 }),
    ...services.flatMap((s) => entry(`/services/${s.slug}`, { lastModified: s.updatedAt, changeFrequency: "monthly", priority: 0.8 })),
  ];
}
