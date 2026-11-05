import { z } from "zod";
import { httpsUrl, imageUrl, line, optionalLine, slug, text } from "@/lib/validation/common";

export const SERVICE_STATUSES = ["draft", "published"] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

const item = z.object({
  title: line(120, 1),
  description: text(1000).pipe(z.string().min(1, "Required")),
});
const faq = z.object({
  question: line(200, 1),
  answer: text(2000).pipe(z.string().min(1, "Required")),
});

/** Everything an admin can edit on a service. Shared by the admin form and the JSON API. */
export const serviceInput = z.object({
  title: line(160, 2),
  slug,
  eyebrow: optionalLine(120),
  summary: line(500, 10),
  body: text(50_000).optional().default(""),
  heroImage: imageUrl,
  heroImageAlt: optionalLine(250),
  features: z.array(item).max(24).default([]),
  processSteps: z.array(item).max(12).default([]),
  faqs: z.array(faq).max(30).default([]),
  ctaLabel: optionalLine(80),
  priceFrom: optionalLine(80),
  seoTitle: optionalLine(70),
  seoDescription: optionalLine(170),
  ogImage: imageUrl,
  canonicalUrl: httpsUrl,
  noindex: z.coerce.boolean().default(false),
  status: z.enum(SERVICE_STATUSES).default("draft"),
  sortOrder: z.coerce.number().int().min(-100000).max(100000).default(0),
}).refine((v) => !v.heroImage || !!v.heroImageAlt, {
  path: ["heroImageAlt"],
  message: "Describe the image for screen readers and SEO",
});

export type ServiceInput = z.infer<typeof serviceInput>;

/** Partial update for PATCH: every field optional, same rules. */
export const servicePatch = z.object({
  title: line(160, 2),
  slug,
  eyebrow: optionalLine(120),
  summary: line(500, 10),
  body: text(50_000),
  heroImage: imageUrl,
  heroImageAlt: optionalLine(250),
  features: z.array(item).max(24),
  processSteps: z.array(item).max(12),
  faqs: z.array(faq).max(30),
  ctaLabel: optionalLine(80),
  priceFrom: optionalLine(80),
  seoTitle: optionalLine(70),
  seoDescription: optionalLine(170),
  ogImage: imageUrl,
  canonicalUrl: httpsUrl,
  noindex: z.coerce.boolean(),
  status: z.enum(SERVICE_STATUSES),
  sortOrder: z.coerce.number().int().min(-100000).max(100000),
}).partial().strict();

export type ServicePatch = z.infer<typeof servicePatch>;

export const publishInput = z.object({ published: z.boolean() }).strict();

export const listQuery = z.object({
  q: z.string().max(100).optional().transform((s) => (s ? s.trim() : undefined)),
  status: z.enum(SERVICE_STATUSES).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});
