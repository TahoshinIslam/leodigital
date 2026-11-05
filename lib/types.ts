import type { Role } from "@/lib/auth/permissions";
import type { ServiceStatus } from "@/lib/validation/service";

export type ServiceItem = { title: string; description: string };
export type ServiceFaq = { question: string; answer: string };

export type Service = {
  id: number;
  slug: string;
  title: string;
  eyebrow: string | null;
  summary: string;
  body: string;
  heroImage: string | null;
  heroImageAlt: string | null;
  features: ServiceItem[];
  processSteps: ServiceItem[];
  faqs: ServiceFaq[];
  ctaLabel: string | null;
  priceFrom: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  status: ServiceStatus;
  publishedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedByName?: string | null;
};

/** The slim shape used by lists, cards, nav and the sitemap. */
export type ServiceSummary = Pick<
  Service,
  "id" | "slug" | "title" | "eyebrow" | "summary" | "heroImage" | "heroImageAlt" | "status" | "sortOrder" | "updatedAt" | "publishedAt"
>;

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type AuditEntry = {
  id: number;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  userName: string | null;
  createdAt: string;
};

export type Paginated<T> = { items: T[]; total: number; page: number; perPage: number };
