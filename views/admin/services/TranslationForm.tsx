"use client";

import { Copy, Languages, Save } from "lucide-react";
import { useActionState, useState } from "react";
import FormFeedback from "@/components/admin/FormFeedback";
import Repeater from "@/components/admin/Repeater";
import { buttonClass, Card, CardHeader, Field } from "@/components/admin/ui";
import { initialActionState, type ActionState } from "@/lib/action-state";
import type { Service } from "@/lib/types";
import type { ServiceTranslation } from "@/server/modules/services";

type Props = {
  id: number;
  locale: "bn";
  source: Service;
  translation: ServiceTranslation;
  action: (s: ActionState, fd: FormData) => Promise<ActionState>;
};

/** The English original, shown under each field as the text to translate. */
function Source({ children }: { children: React.ReactNode }) {
  return children ? (
    <p className="m-0 mt-1.5 line-clamp-3 rounded-lg bg-a-card2 px-3 py-2 text-[12px] leading-relaxed text-a-t3">
      <span className="mr-1.5 font-admin-mono text-[10px] tracking-[0.12em] uppercase">EN</span>
      {children}
    </p>
  ) : null;
}

/**
 * Bangla translation of one service. Every field is optional: whatever is left
 * empty falls back to the English text on the public /bn page, so a service can
 * go live in Bangla one field at a time.
 */
export default function TranslationForm({ id, locale, source, translation: t, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const fe = state.fieldErrors ?? {};
  const err = (k: string) => fe[k] ?? Object.entries(fe).find(([key]) => key.startsWith(`${k}.`))?.[1];

  // Lists can be seeded from English, then translated item by item.
  const [lists, setLists] = useState({ features: t.features, processSteps: t.processSteps, faqs: t.faqs });
  const [seed, setSeed] = useState(0);
  const startFromEnglish = (k: "features" | "processSteps" | "faqs") => {
    setLists((l) => ({ ...l, [k]: source[k] }));
    setSeed((n) => n + 1);
  };

  const input = (name: keyof ServiceTranslation, label: string, max: number, src: string | null, opts: { multiline?: boolean; rows?: number } = {}) => (
    <Field label={label} htmlFor={`tr-${name}`} error={err(name)}>
      {opts.multiline ? (
        <textarea id={`tr-${name}`} name={name} lang="bn" rows={opts.rows ?? 3} maxLength={max} defaultValue={String(t[name] ?? "")} placeholder={src ?? ""} className="a-input resize-y" />
      ) : (
        <input id={`tr-${name}`} name={name} lang="bn" maxLength={max} defaultValue={String(t[name] ?? "")} placeholder={src ?? ""} className="a-input" />
      )}
      <Source>{src}</Source>
    </Field>
  );

  const listCard = (
    k: "features" | "processSteps" | "faqs",
    title: string,
    fields: { key: string; label: string; multiline?: boolean; maxLength: number }[],
    addLabel: string,
    max: number,
  ) => (
    <Card>
      <CardHeader
        title={title}
        subtitle={source[k].length ? `${source[k].length} in English` : "None in English"}
        action={
          source[k].length ? (
            <button type="button" onClick={() => startFromEnglish(k)} className={buttonClass("ghost", true)}>
              <Copy size={14} /> Start from English
            </button>
          ) : undefined
        }
      />
      <div className="p-5">
        <Repeater
          key={`${k}-${seed}`}
          name={k}
          defaultValue={lists[k] as unknown as Record<string, string>[]}
          fields={fields}
          addLabel={addLabel}
          max={max}
          error={err(k)}
        />
      </div>
    </Card>
  );

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" noValidate>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="locale" value={locale} />

      <div className="flex min-w-0 flex-col gap-5">
        <FormFeedback state={state} />
        <Card>
          <CardHeader title={<span className="inline-flex items-center gap-2"><Languages size={17} className="text-a-violet" /> বাংলা content</span>} subtitle="Shown at /bn. Leave a field empty to use the English text." />
          <div className="flex flex-col gap-4 p-5">
            {input("title", "Title", 160, source.title)}
            <div className="grid gap-4 sm:grid-cols-2">
              {input("eyebrow", "Eyebrow", 120, source.eyebrow)}
              {input("priceFrom", "Starting price", 80, source.priceFrom)}
            </div>
            {input("summary", "Summary", 500, source.summary, { multiline: true })}
            {input("body", "Page body (Markdown)", 50000, source.body, { multiline: true, rows: 12 })}
            {input("ctaLabel", "Call-to-action label", 80, source.ctaLabel || "Book a free consultation")}
          </div>
        </Card>
        {listCard("features", "What you get", [{ key: "title", label: "Feature", maxLength: 120 }, { key: "description", label: "Description", multiline: true, maxLength: 1000 }], "Add feature", 24)}
        {listCard("processSteps", "Process", [{ key: "title", label: "Step", maxLength: 120 }, { key: "description", label: "Description", multiline: true, maxLength: 1000 }], "Add step", 12)}
        {listCard("faqs", "FAQs", [{ key: "question", label: "Question", maxLength: 200 }, { key: "answer", label: "Answer", multiline: true, maxLength: 2000 }], "Add question", 30)}
      </div>

      <div className="flex flex-col gap-5 xl:sticky xl:top-[84px] xl:self-start">
        <Card>
          <CardHeader title="Save" subtitle="Slug, images and publishing are shared with English." />
          <div className="flex flex-col gap-3 p-5">
            <button type="submit" disabled={pending} className={`${buttonClass("primary")} h-11`}>
              <Save size={16} /> {pending ? "Saving…" : "Save Bangla version"}
            </button>
            {t.updatedAt ? (
              <p className="m-0 text-[11.5px] text-a-t3">
                Last saved {new Date(t.updatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" })}
              </p>
            ) : (
              <p className="m-0 text-[11.5px] text-a-t3">Not translated yet — the Bangla page currently shows English.</p>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader title="Search & social" subtitle="Bangla snippet for search engines." />
          <div className="flex flex-col gap-4 p-5">
            {input("seoTitle", "Meta title", 70, source.seoTitle)}
            {input("seoDescription", "Meta description", 170, source.seoDescription, { multiline: true })}
            {input("heroImageAlt", "Hero image alt text", 250, source.heroImageAlt)}
          </div>
        </Card>
      </div>
    </form>
  );
}
