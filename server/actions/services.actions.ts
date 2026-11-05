"use server";

import { redirect } from "next/navigation";
import { id as idSchema } from "@/lib/validation/common";
import { action } from "@/server/http/action";
import { badRequest } from "@/server/http/errors";
import { createService, deleteService, setPublished, updateService } from "@/server/modules/services";

/** FormData → plain object for the service schema. Repeaters arrive as JSON strings. */
function readServiceForm(fd: FormData) {
  const str = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : "";
  };
  const json = (k: string) => {
    try {
      const v = JSON.parse(str(k) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      throw badRequest(`Could not read the ${k} list`);
    }
  };
  return {
    title: str("title"),
    slug: str("slug"),
    eyebrow: str("eyebrow"),
    summary: str("summary"),
    body: str("body"),
    heroImage: str("heroImage"),
    heroImageAlt: str("heroImageAlt"),
    features: json("features"),
    processSteps: json("processSteps"),
    faqs: json("faqs"),
    ctaLabel: str("ctaLabel"),
    priceFrom: str("priceFrom"),
    seoTitle: str("seoTitle"),
    seoDescription: str("seoDescription"),
    ogImage: str("ogImage"),
    canonicalUrl: str("canonicalUrl"),
    noindex: fd.get("noindex") === "on",
    // Absent for users without publish rights: leave the status unchanged.
    status: fd.has("status") ? str("status") : undefined,
    sortOrder: str("sortOrder") || "0",
  };
}

const readId = (fd: FormData) => {
  const r = idSchema.safeParse(fd.get("id"));
  if (!r.success) throw badRequest("Missing service id");
  return r.data;
};

export const createServiceAction = action("services:create", async ({ user, ip, formData }) => {
  const s = await createService(user, readServiceForm(formData), { ip });
  redirect(`/admin/services/${s.id}?saved=1`);
});

export const updateServiceAction = action("services:update", async ({ user, ip, formData }) => {
  const data = readServiceForm(formData);
  const s = await updateService(user, readId(formData), data, { ip });
  return { message: `Saved “${s.title}”` };
});

export const togglePublishAction = action("services:publish", async ({ user, ip, formData }) => {
  const s = await setPublished(user, readId(formData), { published: formData.get("published") === "true" }, { ip });
  return { message: s.status === "published" ? `“${s.title}” is live` : `“${s.title}” is now a draft` };
});

export const deleteServiceAction = action("services:delete", async ({ user, ip, formData }) => {
  await deleteService(user, readId(formData), { ip });
  if (formData.get("redirect") === "list") redirect("/admin/services?deleted=1");
  return { message: "Service deleted" };
});
