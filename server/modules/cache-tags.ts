import "server-only";
import { revalidateTag } from "next/cache";

export const TAGS = {
  services: "services",
  service: (slug: string) => `service:${slug}`,
} as const;

/**
 * Expire public service caches immediately (no stale window), so an
 * unpublished or deleted service disappears from the site on the next request.
 * Works from both Server Actions and Route Handlers.
 */
export function invalidateServices(...slugs: (string | null | undefined)[]) {
  revalidateTag(TAGS.services, { expire: 0 });
  for (const s of new Set(slugs.filter(Boolean) as string[])) revalidateTag(TAGS.service(s), { expire: 0 });
}
