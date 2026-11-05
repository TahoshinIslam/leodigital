import "server-only";
import type { PoolConnection } from "mysql2/promise";
import { exec, sql, sqlOne } from "@/server/db/pool";
import type { Paginated, Service, ServiceFaq, ServiceItem, ServiceSummary } from "@/lib/types";
import type { ServiceInput, ServicePatch, ServiceStatus } from "@/lib/validation/service";

/** Raw row as MySQL returns it. */
type Row = {
  id: number; slug: string; title: string; eyebrow: string | null; summary: string; body: string | null;
  hero_image: string | null; hero_image_alt: string | null;
  features: string | null; process_steps: string | null; faqs: string | null;
  cta_label: string | null; price_from: string | null;
  seo_title: string | null; seo_description: string | null; og_image: string | null; canonical_url: string | null;
  noindex: boolean; status: ServiceStatus; published_at: Date | null; sort_order: number;
  created_at: Date; updated_at: Date; updated_by_name?: string | null;
};

const iso = (d: Date | null) => (d ? new Date(d).toISOString() : null);

function parseJson<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

function toService(r: Row): Service {
  return {
    id: r.id, slug: r.slug, title: r.title, eyebrow: r.eyebrow, summary: r.summary, body: r.body ?? "",
    heroImage: r.hero_image, heroImageAlt: r.hero_image_alt,
    features: parseJson<ServiceItem>(r.features),
    processSteps: parseJson<ServiceItem>(r.process_steps),
    faqs: parseJson<ServiceFaq>(r.faqs),
    ctaLabel: r.cta_label, priceFrom: r.price_from,
    seoTitle: r.seo_title, seoDescription: r.seo_description, ogImage: r.og_image, canonicalUrl: r.canonical_url,
    noindex: !!r.noindex, status: r.status, publishedAt: iso(r.published_at), sortOrder: r.sort_order,
    createdAt: iso(r.created_at)!, updatedAt: iso(r.updated_at)!, updatedByName: r.updated_by_name ?? null,
  };
}

const SUMMARY_COLS =
  "id, slug, title, eyebrow, summary, hero_image, hero_image_alt, status, sort_order, updated_at, published_at";

function toSummary(r: Row): ServiceSummary {
  return {
    id: r.id, slug: r.slug, title: r.title, eyebrow: r.eyebrow, summary: r.summary,
    heroImage: r.hero_image, heroImageAlt: r.hero_image_alt, status: r.status, sortOrder: r.sort_order,
    updatedAt: iso(r.updated_at)!, publishedAt: iso(r.published_at),
  };
}

// Column ↔ input field mapping. Column names are fixed literals, never user input.
const COLUMNS: Record<keyof ServiceInput, string> = {
  title: "title", slug: "slug", eyebrow: "eyebrow", summary: "summary", body: "body",
  heroImage: "hero_image", heroImageAlt: "hero_image_alt",
  features: "features", processSteps: "process_steps", faqs: "faqs",
  ctaLabel: "cta_label", priceFrom: "price_from",
  seoTitle: "seo_title", seoDescription: "seo_description", ogImage: "og_image", canonicalUrl: "canonical_url",
  noindex: "noindex", status: "status", sortOrder: "sort_order",
};
const JSON_FIELDS = new Set<keyof ServiceInput>(["features", "processSteps", "faqs"]);

function toDbValue(key: keyof ServiceInput, value: unknown) {
  if (JSON_FIELDS.has(key)) return JSON.stringify(value ?? []);
  if (value === undefined) return null;
  return value as string | number | boolean | null;
}

// ── Public reads ─────────────────────────────────────────────────────────
// For a non-default locale the translation row is LEFT JOINed and each text
// field falls back to English when the translation is missing or empty.

const T = (col: string, json = false) =>
  json
    ? `COALESCE(NULLIF(NULLIF(t.${col}, ''), '[]'), s.${col}) AS ${col}`
    : `COALESCE(NULLIF(t.${col}, ''), s.${col}) AS ${col}`;

const LOCALIZED_COLS = [
  "s.id", "s.slug", T("title"), T("eyebrow"), T("summary"), T("body"), "s.hero_image", T("hero_image_alt"),
  T("features", true), T("process_steps", true), T("faqs", true), T("cta_label"), T("price_from"),
  T("seo_title"), T("seo_description"), "s.og_image", "s.canonical_url", "s.noindex", "s.status",
  "s.published_at", "s.sort_order", "s.created_at", "s.updated_at",
].join(", ");

function localizedFrom(locale: string) {
  return locale === "en"
    ? { cols: "s.*", join: "", params: [] as string[] }
    : { cols: LOCALIZED_COLS, join: "LEFT JOIN service_translations t ON t.service_id = s.id AND t.locale = ?", params: [locale] };
}

export async function listPublished(locale = "en"): Promise<ServiceSummary[]> {
  const q = localizedFrom(locale);
  const rows = await sql<Row>(
    `SELECT ${q.cols} FROM services s ${q.join} WHERE s.status = 'published' ORDER BY s.sort_order ASC, s.title ASC`,
    q.params,
  );
  return rows.map(toSummary);
}

export async function findPublishedBySlug(slug: string, locale = "en"): Promise<Service | null> {
  const q = localizedFrom(locale);
  const r = await sqlOne<Row>(
    `SELECT ${q.cols} FROM services s ${q.join} WHERE s.slug = ? AND s.status = 'published'`,
    [...q.params, slug],
  );
  return r ? toService(r) : null;
}

/** Current slug for a renamed service, if `oldSlug` used to point at one. */
export async function findRedirectSlug(oldSlug: string): Promise<string | null> {
  const r = await sqlOne<{ slug: string }>(
    `SELECT s.slug FROM service_slug_history h JOIN services s ON s.id = h.service_id
     WHERE h.old_slug = ? AND s.status = 'published'`,
    [oldSlug],
  );
  return r?.slug ?? null;
}

// ── Admin reads ──────────────────────────────────────────────────────────

export async function list(opts: {
  q?: string; status?: ServiceStatus; page: number; perPage: number; sort?: "order" | "recent";
}): Promise<Paginated<ServiceSummary>> {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (opts.status) {
    where.push("status = ?");
    params.push(opts.status);
  }
  if (opts.q) {
    where.push("(title LIKE ? OR slug LIKE ? OR summary LIKE ?)");
    const like = `%${opts.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    params.push(like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const totalRow = await sqlOne<{ n: number }>(`SELECT COUNT(*) AS n FROM services ${whereSql}`, params);
  // LIMIT/OFFSET are validated integers; mysql2 prepared statements want them as strings.
  const limit = String(opts.perPage);
  const offset = String((opts.page - 1) * opts.perPage);
  const rows = await sql<Row>(
    `SELECT ${SUMMARY_COLS} FROM services ${whereSql} ORDER BY ${opts.sort === "recent" ? "updated_at DESC" : "sort_order ASC, title ASC"} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  return { items: rows.map(toSummary), total: Number(totalRow?.n ?? 0), page: opts.page, perPage: opts.perPage };
}

export async function findById(id: number, db?: PoolConnection): Promise<Service | null> {
  const r = await sqlOne<Row>(
    `SELECT s.*, u.name AS updated_by_name FROM services s
     LEFT JOIN users u ON u.id = s.updated_by WHERE s.id = ?`,
    [id],
    db,
  );
  return r ? toService(r) : null;
}

export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
  const r = await sqlOne<{ id: number }>(
    "SELECT id FROM services WHERE slug = ? AND id <> ? LIMIT 1",
    [slug, exceptId ?? 0],
  );
  return !!r;
}

export async function counts(): Promise<{ total: number; published: number; draft: number }> {
  const r = await sqlOne<{ total: number; published: number; draft: number }>(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(status = 'published'), 0) AS published,
            COALESCE(SUM(status = 'draft'), 0) AS draft
     FROM services`,
  );
  return { total: Number(r?.total ?? 0), published: Number(r?.published ?? 0), draft: Number(r?.draft ?? 0) };
}

/** Services touched per day over the last `days` days, for the dashboard chart. */
export async function updatesPerDay(days: number): Promise<{ day: string; n: number }[]> {
  const rows = await sql<{ day: Date | string; n: number }>(
    `SELECT DATE(created_at) AS day, COUNT(*) AS n FROM audit_logs
     WHERE entity_type = 'service' AND created_at >= (UTC_TIMESTAMP() - INTERVAL ? DAY)
     GROUP BY DATE(created_at) ORDER BY day`,
    [String(days)],
  );
  return rows.map((r) => ({ day: new Date(r.day).toISOString().slice(0, 10), n: Number(r.n) }));
}

// ── Writes ───────────────────────────────────────────────────────────────

export async function insert(input: ServiceInput, userId: number, db: PoolConnection): Promise<number> {
  const keys = Object.keys(COLUMNS) as (keyof ServiceInput)[];
  const cols = keys.map((k) => COLUMNS[k]);
  const values = keys.map((k) => toDbValue(k, input[k]));
  const res = await exec(
    `INSERT INTO services (${cols.join(", ")}, published_at, created_by, updated_by)
     VALUES (${cols.map(() => "?").join(", ")}, ${input.status === "published" ? "UTC_TIMESTAMP()" : "NULL"}, ?, ?)`,
    [...values, userId, userId],
    db,
  );
  return res.insertId;
}

export async function update(id: number, patch: ServicePatch, userId: number, db: PoolConnection): Promise<void> {
  const keys = (Object.keys(patch) as (keyof ServicePatch)[]).filter((k) => patch[k] !== undefined);
  const sets = keys.map((k) => `${COLUMNS[k]} = ?`);
  const values = keys.map((k) => toDbValue(k, patch[k]));
  if (patch.status === "published") sets.push("published_at = COALESCE(published_at, UTC_TIMESTAMP())");
  if (patch.status === "draft") sets.push("published_at = NULL");
  sets.push("updated_by = ?");
  await exec(`UPDATE services SET ${sets.join(", ")} WHERE id = ?`, [...values, userId, id], db);
}

export async function remove(id: number, db: PoolConnection): Promise<void> {
  await exec("DELETE FROM services WHERE id = ?", [id], db);
}

export async function recordSlugChange(oldSlug: string, serviceId: number, newSlug: string, db: PoolConnection) {
  // The new slug must never redirect away from itself.
  await exec("DELETE FROM service_slug_history WHERE old_slug = ?", [newSlug], db);
  await exec(
    "INSERT INTO service_slug_history (old_slug, service_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE service_id = VALUES(service_id)",
    [oldSlug, serviceId],
    db,
  );
}

/** Content-quality gaps for the dashboard insight card. */
export async function contentGaps(): Promise<{ missingSeo: number; missingImage: number; missingFaq: number }> {
  const r = await sqlOne<{ missing_seo: number; missing_image: number; missing_faq: number }>(
    `SELECT COALESCE(SUM(seo_description IS NULL OR seo_description = ''), 0) AS missing_seo,
            COALESCE(SUM(hero_image IS NULL OR hero_image = ''), 0) AS missing_image,
            COALESCE(SUM(faqs IS NULL OR faqs = '[]'), 0) AS missing_faq
     FROM services WHERE status = 'published'`,
  );
  return { missingSeo: Number(r?.missing_seo ?? 0), missingImage: Number(r?.missing_image ?? 0), missingFaq: Number(r?.missing_faq ?? 0) };
}


// ── Translations ─────────────────────────────────────────────────────────

export type TranslationRow = {
  title: string | null; eyebrow: string | null; summary: string | null; body: string | null;
  hero_image_alt: string | null; features: string | null; process_steps: string | null; faqs: string | null;
  cta_label: string | null; price_from: string | null; seo_title: string | null; seo_description: string | null;
  updated_at: Date;
};

export async function findTranslation(serviceId: number, locale: string) {
  return sqlOne<TranslationRow>("SELECT * FROM service_translations WHERE service_id = ? AND locale = ?", [serviceId, locale]);
}

/** Locales that have a translation row, per service (for the admin list). */
export async function translatedLocales(): Promise<Map<number, string[]>> {
  const rows = await sql<{ service_id: number; locale: string }>("SELECT service_id, locale FROM service_translations");
  const m = new Map<number, string[]>();
  for (const r of rows) m.set(r.service_id, [...(m.get(r.service_id) ?? []), r.locale]);
  return m;
}

export async function upsertTranslation(
  serviceId: number,
  locale: string,
  t: {
    title: string | null; eyebrow: string | null; summary: string | null; body: string | null; heroImageAlt: string | null;
    features: unknown[]; processSteps: unknown[]; faqs: unknown[]; ctaLabel: string | null; priceFrom: string | null;
    seoTitle: string | null; seoDescription: string | null;
  },
  userId: number,
  db: PoolConnection,
) {
  const values = [
    t.title, t.eyebrow, t.summary, t.body, t.heroImageAlt,
    JSON.stringify(t.features), JSON.stringify(t.processSteps), JSON.stringify(t.faqs),
    t.ctaLabel, t.priceFrom, t.seoTitle, t.seoDescription, userId,
  ];
  await exec(
    `INSERT INTO service_translations
       (service_id, locale, title, eyebrow, summary, body, hero_image_alt, features, process_steps, faqs,
        cta_label, price_from, seo_title, seo_description, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), eyebrow = VALUES(eyebrow), summary = VALUES(summary), body = VALUES(body),
       hero_image_alt = VALUES(hero_image_alt), features = VALUES(features), process_steps = VALUES(process_steps),
       faqs = VALUES(faqs), cta_label = VALUES(cta_label), price_from = VALUES(price_from),
       seo_title = VALUES(seo_title), seo_description = VALUES(seo_description), updated_by = VALUES(updated_by)`,
    [serviceId, locale, ...values],
    db,
  );
}
