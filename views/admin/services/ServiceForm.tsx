"use client";

import { ExternalLink, Globe, Save } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import FormFeedback from "@/components/admin/FormFeedback";
import ImageField from "@/components/admin/ImageField";
import Repeater from "@/components/admin/Repeater";
import { buttonClass, Card, CardHeader, Field, StatusPill } from "@/components/admin/ui";
import { initialActionState, type ActionState } from "@/lib/action-state";
import type { Service } from "@/lib/types";
import { slugify } from "@/lib/validation/common";

type Props = {
  service: Service | null;
  action: (s: ActionState, fd: FormData) => Promise<ActionState>;
  canPublish: boolean;
  siteUrl: string;
};

function Counter({ value, max, ideal }: { value: string; max: number; ideal?: [number, number] }) {
  const n = value.length;
  const tone = n > max ? "text-a-rose" : ideal && (n < ideal[0] || n > ideal[1]) ? "text-a-amber" : "text-a-t3";
  return <span className={`font-admin-mono text-[11px] ${tone}`}>{n}/{max}</span>;
}

export default function ServiceForm({ service, action, canPublish, siteUrl }: Props) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const fe = state.fieldErrors ?? {};
  const err = (k: string) => fe[k] ?? Object.entries(fe).find(([key]) => key.startsWith(`${k}.`))?.[1];

  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!service);
  const [summary, setSummary] = useState(service?.summary ?? "");
  const [seoTitle, setSeoTitle] = useState(service?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(service?.seoDescription ?? "");
  const [status, setStatus] = useState(service?.status ?? "draft");

  const previewTitle = seoTitle || `${title || "Service title"} | Leotech`;
  const previewDesc = seoDescription || summary || "Add a summary or a meta description to control the snippet search engines show.";
  const slugChanged = service && service.status === "published" && slug !== service.slug;

  const inv = (k: string) => (err(k) ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" noValidate>
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      {/* ── Main column ── */}
      <div className="flex min-w-0 flex-col gap-5">
        <FormFeedback state={state} />

        <Card>
          <CardHeader title="Content" subtitle="Shown in the hero of the service page and on service cards." />
          <div className="flex flex-col gap-4 p-5">
            <Field label="Title" htmlFor="title" error={err("title")} counter={<Counter value={title} max={160} />}>
              <input
                id="title" name="title" required maxLength={160} value={title} {...inv("title")}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className="a-input text-[16px] font-bold"
                placeholder="e.g. Search engine optimisation"
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor="slug"
              error={err("slug")}
              hint={slugChanged ? "Changing a live URL: the old address will permanently redirect here." : "Lowercase letters, numbers and hyphens."}
            >
              <div className="flex items-stretch overflow-hidden rounded-xl border border-a-bd2 bg-a-card2 focus-within:border-a-brand focus-within:shadow-[0_0_0_4px_var(--a-ring)]">
                <span className="flex items-center pl-3 font-admin-mono text-[12.5px] whitespace-nowrap text-a-t3">/services/</span>
                <input
                  id="slug" name="slug" required maxLength={160} value={slug} {...inv("slug")}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  onBlur={() => setSlug((s) => slugify(s))}
                  className="min-w-0 flex-1 bg-transparent px-1 py-2.5 font-admin-mono text-[13px] text-a-t1 outline-none"
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" htmlFor="eyebrow" error={err("eyebrow")} hint="Small label above the title.">
                <input id="eyebrow" name="eyebrow" maxLength={120} defaultValue={service?.eyebrow ?? ""} className="a-input" placeholder="e.g. Search engine optimization" />
              </Field>
              <Field label="Starting price" htmlFor="priceFrom" error={err("priceFrom")} hint="Optional, e.g. ৳25,000/mo">
                <input id="priceFrom" name="priceFrom" maxLength={80} defaultValue={service?.priceFrom ?? ""} className="a-input" />
              </Field>
            </div>

            <Field label="Summary" htmlFor="summary" error={err("summary")} counter={<Counter value={summary} max={500} />} hint="One or two sentences. Used on cards and as the fallback meta description.">
              <textarea id="summary" name="summary" required rows={3} maxLength={500} value={summary} onChange={(e) => setSummary(e.target.value)} {...inv("summary")} className="a-input resize-y" />
            </Field>

            <Field
              label="Page body"
              htmlFor="body"
              error={err("body")}
              hint={<>Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list</code>, <code>[link](https://…)</code>. HTML is sanitised.</>}
            >
              <textarea id="body" name="body" rows={14} maxLength={50000} defaultValue={service?.body ?? ""} className="a-input resize-y font-admin-mono text-[13px] leading-relaxed" />
            </Field>

            <Field label="Call-to-action label" htmlFor="ctaLabel" error={err("ctaLabel")}>
              <input id="ctaLabel" name="ctaLabel" maxLength={80} defaultValue={service?.ctaLabel ?? ""} placeholder="Book a free consultation" className="a-input" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="What you get" subtitle="Feature cards beside the page body." />
          <div className="p-5">
            <Repeater
              name="features"
              defaultValue={service?.features ?? []}
              fields={[{ key: "title", label: "Feature", maxLength: 120 }, { key: "description", label: "Description", multiline: true, maxLength: 1000 }]}
              addLabel="Add feature"
              error={err("features")}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Process" subtitle="Numbered steps in the “How we work” band." />
          <div className="p-5">
            <Repeater
              name="processSteps"
              defaultValue={service?.processSteps ?? []}
              fields={[{ key: "title", label: "Step", maxLength: 120 }, { key: "description", label: "Description", multiline: true, maxLength: 1000 }]}
              addLabel="Add step"
              max={12}
              error={err("processSteps")}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="FAQs" subtitle="Rendered as an accordion and as FAQ structured data for search engines." />
          <div className="p-5">
            <Repeater
              name="faqs"
              defaultValue={service?.faqs ?? []}
              fields={[{ key: "question", label: "Question", maxLength: 200 }, { key: "answer", label: "Answer", multiline: true, maxLength: 2000 }]}
              addLabel="Add question"
              max={30}
              error={err("faqs")}
            />
          </div>
        </Card>
      </div>

      {/* ── Side column ── */}
      <div className="flex flex-col gap-5 xl:sticky xl:top-[84px] xl:self-start">
        <Card>
          <CardHeader title="Publishing" action={service ? <StatusPill status={service.status} /> : undefined} />
          <div className="flex flex-col gap-4 p-5">
            {canPublish ? (
              <Field label="Visibility" htmlFor="status" error={err("status")}>
                <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="a-input">
                  <option value="draft">Draft — hidden from the website</option>
                  <option value="published">Published — live on the website</option>
                </select>
              </Field>
            ) : (
              <p className="m-0 rounded-xl bg-a-card2 px-3.5 py-3 text-[12.5px] text-a-t2">
                {service ? <>This service is <strong>{service.status}</strong>.</> : "New services start as drafts."} Publishing needs an admin.
              </p>
            )}
            <Field label="Sort order" htmlFor="sortOrder" hint="Lower numbers appear first." error={err("sortOrder")}>
              <input id="sortOrder" name="sortOrder" type="number" step={1} defaultValue={service?.sortOrder ?? 0} className="a-input" />
            </Field>
            <button type="submit" disabled={pending} className={`${buttonClass("primary")} h-11`}>
              {status === "published" && canPublish ? <Globe size={16} /> : <Save size={16} />}
              {pending ? "Saving…" : service ? "Save changes" : status === "published" && canPublish ? "Create & publish" : "Create draft"}
            </button>
            {service?.status === "published" ? (
              <Link href={`/services/${service.slug}`} target="_blank" className={buttonClass("secondary")}>
                <ExternalLink size={15} /> View live page
              </Link>
            ) : null}
            {service ? (
              <p className="m-0 text-[11.5px] text-a-t3">
                Last saved {new Date(service.updatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" })}
                {service.updatedByName ? ` by ${service.updatedByName}` : ""}
              </p>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader title="Hero image" />
          <div className="flex flex-col gap-4 p-5">
            <ImageField name="heroImage" defaultValue={service?.heroImage ?? null} label="Hero image" aspect="aspect-[4/3]" />
            <Field label="Alt text" htmlFor="heroImageAlt" error={err("heroImageAlt")} hint="Describe the image for screen readers and search.">
              <input id="heroImageAlt" name="heroImageAlt" maxLength={250} defaultValue={service?.heroImageAlt ?? ""} {...inv("heroImageAlt")} className="a-input" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Search & social" subtitle="Leave blank to use the title and summary." />
          <div className="flex flex-col gap-4 p-5">
            {/* Snippet preview */}
            <div className="rounded-xl border border-a-bd bg-a-bg2 p-3.5" aria-label="Search result preview">
              <div className="truncate text-[12px] text-a-t3">{siteUrl.replace(/^https?:\/\//, "")} › services › {slug || "slug"}</div>
              <div className="mt-0.5 line-clamp-1 text-[16px] leading-snug font-medium text-[#1a0dab] [.admin-root[data-theme=dark]_&]:text-[#8ab4f8]">{previewTitle}</div>
              <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-a-t2">{previewDesc}</div>
            </div>
            <Field label="Meta title" htmlFor="seoTitle" error={err("seoTitle")} counter={<Counter value={seoTitle} max={70} ideal={[30, 60]} />}>
              <input id="seoTitle" name="seoTitle" maxLength={70} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="a-input" />
            </Field>
            <Field label="Meta description" htmlFor="seoDescription" error={err("seoDescription")} counter={<Counter value={seoDescription} max={170} ideal={[110, 160]} />}>
              <textarea id="seoDescription" name="seoDescription" rows={3} maxLength={170} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="a-input resize-y" />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-semibold text-a-t1">Social share image</span>
              <ImageField name="ogImage" defaultValue={service?.ogImage ?? null} label="Share image" aspect="aspect-[1200/630]" />
              <span className="text-[12px] text-a-t3">1200 × 630 recommended. Falls back to the hero image.</span>
            </div>
            <Field label="Canonical URL" htmlFor="canonicalUrl" error={err("canonicalUrl")} hint="Only if this content is published elsewhere first.">
              <input id="canonicalUrl" name="canonicalUrl" type="url" maxLength={500} defaultValue={service?.canonicalUrl ?? ""} placeholder="https://…" className="a-input" />
            </Field>
            <label className="flex items-start gap-2.5 text-[13px] text-a-t1">
              <input type="checkbox" name="noindex" defaultChecked={service?.noindex ?? false} className="mt-0.5 h-4 w-4 accent-[var(--a-brand)]" />
              <span>
                Hide from search engines
                <span className="block text-[12px] text-a-t3">Adds <code>noindex</code>; the page stays reachable by link.</span>
              </span>
            </label>
          </div>
        </Card>
      </div>
    </form>
  );
}
