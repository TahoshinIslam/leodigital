import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Paginated, Service, ServiceSummary } from "@/lib/types";
import { fieldErrors } from "@/lib/validation/common";
import {
  listQuery,
  publishInput,
  serviceInput,
  servicePatch,
  type ServicePatch,
} from "@/lib/validation/service";
import { assertCan } from "@/server/auth/guard";
import type { SessionUser } from "@/server/auth/session";
import { isDuplicateKey, transaction } from "@/server/db/pool";
import { conflict, notFound, validationError } from "@/server/http/errors";
import { invalidateServices, TAGS } from "@/server/modules/cache-tags";
import * as audit from "@/server/repositories/audit.repository";
import * as repo from "@/server/repositories/service.repository";

/**
 * Business logic for services. Route Handlers (JSON API) and Server Actions
 * (admin UI) both call these functions, so validation, authorization, audit
 * logging and cache invalidation happen in exactly one place.
 */

// ── Public, cached reads ─────────────────────────────────────────────────
// Prerendered into the static shell and kept until an admin change expires
// the tag (or a day passes as a safety net).

export async function getPublishedServices(): Promise<ServiceSummary[]> {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("days");
  return repo.listPublished();
}

export async function getPublishedService(slug: string): Promise<Service | null> {
  "use cache";
  cacheTag(TAGS.services, TAGS.service(slug));
  cacheLife("days");
  return repo.findPublishedBySlug(slug);
}

export async function getServiceRedirect(oldSlug: string): Promise<string | null> {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("days");
  return repo.findRedirectSlug(oldSlug);
}

// ── Admin ────────────────────────────────────────────────────────────────

type Actor = Pick<SessionUser, "id" | "role" | "name">;
type Ctx = { ip?: string | null };

function parse<T>(schema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false; error: import("zod").ZodError } }, raw: unknown): T {
  const r = schema.safeParse(raw);
  if (!r.success) throw validationError(fieldErrors(r.error));
  return r.data;
}

export async function listServices(actor: Actor, rawQuery: unknown): Promise<Paginated<ServiceSummary>> {
  assertCan(actor, "services:read");
  return repo.list(parse(listQuery, rawQuery));
}

export async function getService(actor: Actor, id: number): Promise<Service> {
  assertCan(actor, "services:read");
  const s = await repo.findById(id);
  if (!s) throw notFound("Service not found");
  return s;
}

const slugConflict = () => conflict("That URL slug is already used by another service", { slug: ["Already in use"] });

export async function createService(actor: Actor, raw: unknown, ctx: Ctx = {}): Promise<Service> {
  assertCan(actor, "services:create");
  const input = parse(serviceInput, raw);
  // Publishing is a separate permission: editors can only create drafts.
  if (input.status === "published") assertCan(actor, "services:publish");
  if (await repo.slugTaken(input.slug)) throw slugConflict();

  try {
    const service = await transaction(async (db) => {
      const id = await repo.insert(input, actor.id, db);
      await audit.insert(
        { userId: actor.id, action: "service.create", entityType: "service", entityId: id, summary: `Created “${input.title}”`, ip: ctx.ip },
        db,
      );
      return (await repo.findById(id, db))!;
    });
    invalidateServices(service.slug);
    return service;
  } catch (err) {
    if (isDuplicateKey(err)) throw slugConflict();
    throw err;
  }
}

export async function updateService(actor: Actor, id: number, raw: unknown, ctx: Ctx = {}): Promise<Service> {
  assertCan(actor, "services:update");
  const patch: ServicePatch = parse(servicePatch, raw);
  const current = await repo.findById(id);
  if (!current) throw notFound("Service not found");
  if (patch.status && patch.status !== current.status) assertCan(actor, "services:publish");
  // Editing a live page is allowed for editors, but changing its public URL is
  // a publishing decision.
  if (patch.slug && patch.slug !== current.slug && current.status === "published") assertCan(actor, "services:publish");
  if (patch.heroImage && !(patch.heroImageAlt ?? current.heroImageAlt)) {
    throw validationError({ heroImageAlt: ["Describe the image for screen readers and SEO"] });
  }
  if (patch.slug && patch.slug !== current.slug && (await repo.slugTaken(patch.slug, id))) throw slugConflict();

  try {
    const updated = await transaction(async (db) => {
      await repo.update(id, patch, actor.id, db);
      if (patch.slug && patch.slug !== current.slug) await repo.recordSlugChange(current.slug, id, patch.slug, db);
      const statusChanged = patch.status && patch.status !== current.status;
      await audit.insert(
        {
          userId: actor.id,
          action: statusChanged ? (patch.status === "published" ? "service.publish" : "service.unpublish") : "service.update",
          entityType: "service",
          entityId: id,
          summary: statusChanged
            ? `${patch.status === "published" ? "Published" : "Unpublished"} “${patch.title ?? current.title}”`
            : `Updated “${patch.title ?? current.title}”`,
          ip: ctx.ip,
        },
        db,
      );
      return (await repo.findById(id, db))!;
    });
    invalidateServices(current.slug, updated.slug);
    return updated;
  } catch (err) {
    if (isDuplicateKey(err)) throw slugConflict();
    throw err;
  }
}

export async function setPublished(actor: Actor, id: number, raw: unknown, ctx: Ctx = {}): Promise<Service> {
  const { published } = parse(publishInput, raw);
  return updateService(actor, id, { status: published ? "published" : "draft" }, ctx);
}

export async function deleteService(actor: Actor, id: number, ctx: Ctx = {}): Promise<void> {
  assertCan(actor, "services:delete");
  const current = await repo.findById(id);
  if (!current) throw notFound("Service not found");
  await transaction(async (db) => {
    await repo.remove(id, db);
    await audit.insert(
      { userId: actor.id, action: "service.delete", entityType: "service", entityId: id, summary: `Deleted “${current.title}”`, ip: ctx.ip },
      db,
    );
  });
  invalidateServices(current.slug);
}
