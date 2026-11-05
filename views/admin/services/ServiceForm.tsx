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
import { useAdminT } from "@/lib/i18n/admin/client";

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
  const tr = useAdminT();
  const F = tr.form;
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

  const previewTitle = seoTitle || `${title || F.serviceTitle} | Leotech`;
  const previewDesc = seoDescription || summary || F.previewDesc;
  const slugChanged = service && service.status === "published" && slug !== service.slug;

  const inv = (k: string) => (err(k) ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" noValidate>
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      {/* ── Main column ── */}
      <div className="flex min-w-0 flex-col gap-5">
        <FormFeedback state={state} />

        <Card>
          <CardHeader title={F.content} subtitle={F.contentSub} />
          <div className="flex flex-col gap-4 p-5">
            <Field label={F.title} htmlFor="title" error={err("title")} counter={<Counter value={title} max={160} />}>
              <input
                id="title" name="title" required maxLength={160} value={title} {...inv("title")}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className="a-input text-[16px] font-bold"
                placeholder={F.titlePh}
              />
            </Field>

            <Field
              label={F.slug}
              htmlFor="slug"
              error={err("slug")}
              hint={slugChanged ? F.slugLive : F.slugHint}
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
              <Field label={F.eyebrow} htmlFor="eyebrow" error={err("eyebrow")} hint={F.eyebrowHint}>
                <input id="eyebrow" name="eyebrow" maxLength={120} defaultValue={service?.eyebrow ?? ""} className="a-input" placeholder={F.eyebrowPh} />
              </Field>
              <Field label={F.price} htmlFor="priceFrom" error={err("priceFrom")} hint={F.priceHint}>
                <input id="priceFrom" name="priceFrom" maxLength={80} defaultValue={service?.priceFrom ?? ""} className="a-input" />
              </Field>
            </div>

            <Field label={F.summary} htmlFor="summary" error={err("summary")} counter={<Counter value={summary} max={500} />} hint={F.summaryHint}>
              <textarea id="summary" name="summary" required rows={3} maxLength={500} value={summary} onChange={(e) => setSummary(e.target.value)} {...inv("summary")} className="a-input resize-y" />
            </Field>

            <Field
              label={F.body}
              htmlFor="body"
              error={err("body")}
              hint={F.bodyHint}
            >
              <textarea id="body" name="body" rows={14} maxLength={50000} defaultValue={service?.body ?? ""} className="a-input resize-y font-admin-mono text-[13px] leading-relaxed" />
            </Field>

            <Field label={F.cta} htmlFor="ctaLabel" error={err("ctaLabel")}>
              <input id="ctaLabel" name="ctaLabel" maxLength={80} defaultValue={service?.ctaLabel ?? ""} placeholder={F.ctaPh} className="a-input" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title={F.features} subtitle={F.featuresSub} />
          <div className="p-5">
            <Repeater
              name="features"
              defaultValue={service?.features ?? []}
              fields={[{ key: "title", label: F.feature, maxLength: 120 }, { key: "description", label: F.description, multiline: true, maxLength: 1000 }]}
              addLabel={F.addFeature}
              error={err("features")}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title={F.process} subtitle={F.processSub} />
          <div className="p-5">
            <Repeater
              name="processSteps"
              defaultValue={service?.processSteps ?? []}
              fields={[{ key: "title", label: F.step, maxLength: 120 }, { key: "description", label: F.description, multiline: true, maxLength: 1000 }]}
              addLabel={F.addStep}
              max={12}
              error={err("processSteps")}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title={F.faqs} subtitle={F.faqsSub} />
          <div className="p-5">
            <Repeater
              name="faqs"
              defaultValue={service?.faqs ?? []}
              fields={[{ key: "question", label: F.question, maxLength: 200 }, { key: "answer", label: F.answer, multiline: true, maxLength: 2000 }]}
              addLabel={F.addQuestion}
              max={30}
              error={err("faqs")}
            />
          </div>
        </Card>
      </div>

      {/* ── Side column ── */}
      <div className="flex flex-col gap-5 xl:sticky xl:top-[84px] xl:self-start">
        <Card>
          <CardHeader title={F.publishing} action={service ? <StatusPill status={service.status} labels={tr.common} /> : undefined} />
          <div className="flex flex-col gap-4 p-5">
            {canPublish ? (
              <Field label={F.visibility} htmlFor="status" error={err("status")}>
                <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="a-input">
                  <option value="draft">{F.optDraft}</option>
                  <option value="published">{F.optPublished}</option>
                </select>
              </Field>
            ) : (
              <p className="m-0 rounded-xl bg-a-card2 px-3.5 py-3 text-[12.5px] text-a-t2">
                {service ? F.isStatus(service.status) : F.startsDraft} {F.needsAdmin}
              </p>
            )}
            <Field label={F.sortOrder} htmlFor="sortOrder" hint={F.sortHint} error={err("sortOrder")}>
              <input id="sortOrder" name="sortOrder" type="number" step={1} defaultValue={service?.sortOrder ?? 0} className="a-input" />
            </Field>
            <button type="submit" disabled={pending} className={`${buttonClass("primary")} h-11`}>
              {status === "published" && canPublish ? <Globe size={16} /> : <Save size={16} />}
              {pending ? tr.common.saving : service ? F.saveChanges : status === "published" && canPublish ? F.createPublish : F.createDraft}
            </button>
            {service?.status === "published" ? (
              <Link href={`/services/${service.slug}`} target="_blank" className={buttonClass("secondary")}>
                <ExternalLink size={15} /> {F.viewLive}
              </Link>
            ) : null}
            {service ? (
              <p className="m-0 text-[11.5px] text-a-t3">
                {F.lastSaved(new Date(service.updatedAt).toLocaleString(tr.locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }), service.updatedByName ?? null)}
              </p>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader title={F.hero} />
          <div className="flex flex-col gap-4 p-5">
            <ImageField name="heroImage" defaultValue={service?.heroImage ?? null} label={tr.image.hero} aspect="aspect-[4/3]" />
            <Field label={F.alt} htmlFor="heroImageAlt" error={err("heroImageAlt")} hint={F.altHint}>
              <input id="heroImageAlt" name="heroImageAlt" maxLength={250} defaultValue={service?.heroImageAlt ?? ""} {...inv("heroImageAlt")} className="a-input" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title={F.seo} subtitle={F.seoSub} />
          <div className="flex flex-col gap-4 p-5">
            {/* Snippet preview */}
            <div className="rounded-xl border border-a-bd bg-a-bg2 p-3.5" aria-label={F.preview}>
              <div className="truncate text-[12px] text-a-t3">{siteUrl.replace(/^https?:\/\//, "")} › services › {slug || "slug"}</div>
              <div className="mt-0.5 line-clamp-1 text-[16px] leading-snug font-medium text-[#1a0dab] [.admin-root[data-theme=dark]_&]:text-[#8ab4f8]">{previewTitle}</div>
              <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-a-t2">{previewDesc}</div>
            </div>
            <Field label={F.metaTitle} htmlFor="seoTitle" error={err("seoTitle")} counter={<Counter value={seoTitle} max={70} ideal={[30, 60]} />}>
              <input id="seoTitle" name="seoTitle" maxLength={70} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="a-input" />
            </Field>
            <Field label={F.metaDesc} htmlFor="seoDescription" error={err("seoDescription")} counter={<Counter value={seoDescription} max={170} ideal={[110, 160]} />}>
              <textarea id="seoDescription" name="seoDescription" rows={3} maxLength={170} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="a-input resize-y" />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-semibold text-a-t1">{F.shareImage}</span>
              <ImageField name="ogImage" defaultValue={service?.ogImage ?? null} label={tr.image.share} aspect="aspect-[1200/630]" />
              <span className="text-[12px] text-a-t3">{F.shareHint}</span>
            </div>
            <Field label={F.canonical} htmlFor="canonicalUrl" error={err("canonicalUrl")} hint={F.canonicalHint}>
              <input id="canonicalUrl" name="canonicalUrl" type="url" maxLength={500} defaultValue={service?.canonicalUrl ?? ""} placeholder="https://…" className="a-input" />
            </Field>
            <label className="flex items-start gap-2.5 text-[13px] text-a-t1">
              <input type="checkbox" name="noindex" defaultChecked={service?.noindex ?? false} className="mt-0.5 h-4 w-4 accent-[var(--a-brand)]" />
              <span>
                {F.noindex}
                <span className="block text-[12px] text-a-t3">{F.noindexHint}</span>
              </span>
            </label>
          </div>
        </Card>
      </div>
    </form>
  );
}
