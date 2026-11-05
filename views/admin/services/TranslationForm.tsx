"use client";

import { Copy, Languages, Save } from "lucide-react";
import { useActionState, useState } from "react";
import FormFeedback from "@/components/admin/FormFeedback";
import Repeater from "@/components/admin/Repeater";
import { buttonClass, Card, CardHeader, Field } from "@/components/admin/ui";
import { initialActionState, type ActionState } from "@/lib/action-state";
import type { Service } from "@/lib/types";
import type { ServiceTranslation } from "@/server/modules/services";
import { useAdminT } from "@/lib/i18n/admin/client";

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
  const tr = useAdminT();
  const F = tr.form;
  const X = tr.translate;
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
        subtitle={X.inEnglish(source[k].length)}
        action={
          source[k].length ? (
            <button type="button" onClick={() => startFromEnglish(k)} className={buttonClass("ghost", true)}>
              <Copy size={14} /> {X.startEnglish}
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
          <CardHeader title={<span className="inline-flex items-center gap-2"><Languages size={17} className="text-a-violet" /> {X.contentTitle}</span>} subtitle={X.contentSub} />
          <div className="flex flex-col gap-4 p-5">
            {input("title", F.title, 160, source.title)}
            <div className="grid gap-4 sm:grid-cols-2">
              {input("eyebrow", F.eyebrow, 120, source.eyebrow)}
              {input("priceFrom", F.price, 80, source.priceFrom)}
            </div>
            {input("summary", F.summary, 500, source.summary, { multiline: true })}
            {input("body", X.bodyMd, 50000, source.body, { multiline: true, rows: 12 })}
            {input("ctaLabel", F.cta, 80, source.ctaLabel || F.ctaPh)}
          </div>
        </Card>
        {listCard("features", F.features, [{ key: "title", label: F.feature, maxLength: 120 }, { key: "description", label: F.description, multiline: true, maxLength: 1000 }], F.addFeature, 24)}
        {listCard("processSteps", F.process, [{ key: "title", label: F.step, maxLength: 120 }, { key: "description", label: F.description, multiline: true, maxLength: 1000 }], F.addStep, 12)}
        {listCard("faqs", F.faqs, [{ key: "question", label: F.question, maxLength: 200 }, { key: "answer", label: F.answer, multiline: true, maxLength: 2000 }], F.addQuestion, 30)}
      </div>

      <div className="flex flex-col gap-5 xl:sticky xl:top-[84px] xl:self-start">
        <Card>
          <CardHeader title={X.save} subtitle={X.saveSub} />
          <div className="flex flex-col gap-3 p-5">
            <button type="submit" disabled={pending} className={`${buttonClass("primary")} h-11`}>
              <Save size={16} /> {pending ? tr.common.saving : X.saveBtn}
            </button>
            {t.updatedAt ? (
              <p className="m-0 text-[11.5px] text-a-t3">
                {X.lastSaved(new Date(t.updatedAt).toLocaleString(tr.locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }))}
              </p>
            ) : (
              <p className="m-0 text-[11.5px] text-a-t3">{X.notYet}</p>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader title={F.seo} subtitle={X.seoSub} />
          <div className="flex flex-col gap-4 p-5">
            {input("seoTitle", F.metaTitle, 70, source.seoTitle)}
            {input("seoDescription", F.metaDesc, 170, source.seoDescription, { multiline: true })}
            {input("heroImageAlt", X.heroAlt, 250, source.heroImageAlt)}
          </div>
        </Card>
      </div>
    </form>
  );
}
