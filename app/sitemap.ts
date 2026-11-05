import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { getPublishedServices } from "@/server/modules/services";

/** Regenerates whenever the services cache tag is expired by an admin change. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getPublishedServices();
  const latest = services.reduce((max, s) => (s.updatedAt > max ? s.updatedAt : max), "1970-01-01T00:00:00.000Z");
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
