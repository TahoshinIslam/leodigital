import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import ServiceArt from "@/components/site/service/ServiceArt";
import { Accent, ArrowRight, Container } from "@/components/site/ui";
import type { SiteContent } from "@/content";
import { localePath, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site-url";
import type { Service, ServiceSummary } from "@/lib/types";
import { renderMarkdown } from "@/server/security/sanitize";

/**
 * The one layout every service detail page shares. All content comes from the
 * database row; sections without content are simply omitted. Pure Server
 * Component — no client JavaScript beyond the site nav.
 */
export default function ServiceDetailView({
  service,
  related,
  locale,
  content,
}: {
  service: Service;
  related: ServiceSummary[];
  locale: Locale;
  content: SiteContent;
}) {
  const { contact } = content;
  const t = content.ui.services;
  const L = (p: string) => localePath(locale, p);
  const html = service.body ? renderMarkdown(service.body) : "";
  const url = absoluteUrl(L(`/services/${service.slug}`));
  const cta = service.ctaLabel || t.defaultCta;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.seoDescription || service.summary,
      serviceType: service.title,
      inLanguage: LOCALE_META[locale].hreflang,
      url,
      ...(service.heroImage ? { image: absoluteUrl(service.heroImage) } : {}),
      areaServed: { "@type": "Country", name: "Bangladesh" },
      provider: {
        "@type": "ProfessionalService",
        name: "Leotech",
        url: absoluteUrl(L("/")),
        email: contact.email,
        telephone: contact.phones[0],
        address: { "@type": "PostalAddress", streetAddress: contact.address[0].replace(/,$/, ""), addressLocality: "Dhaka", postalCode: "1216", addressCountry: "BD" },
      },
    },
  ];
  if (service.faqs.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    });
  }

  return (
    <article className="relative z-2">
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <Container className="pt-10">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: L("/") },
            { label: t.breadcrumbServices, href: L("/services") },
            { label: service.title, href: L(`/services/${service.slug}`) },
          ]}
        />
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.15fr_1fr]">
          <header className="flex flex-col gap-6">
            {service.eyebrow ? (
              <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-white/70 uppercase">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {service.eyebrow}
              </span>
            ) : null}
            <h1 className="m-0 text-[clamp(44px,6.2vw,92px)] leading-[0.95] font-medium tracking-[-0.045em] text-balance">
              {service.title}
            </h1>
            <p className="m-0 max-w-[560px] font-body text-lg leading-relaxed text-white/70">{service.summary}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={L("/#contact")}
                className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 font-body text-[15px] font-bold text-ink no-underline shadow-[0_10px_34px_rgba(73,220,122,0.3)] transition-transform hover:-translate-y-0.5"
              >
                {cta} <ArrowRight size={16} />
              </Link>
              {service.priceFrom ? (
                <span className="rounded-full border border-white/15 px-5 py-3.5 font-body text-[14.5px] text-white/80">
                  {t.from[0]}<strong className="text-white">{service.priceFrom}</strong>{t.from[1]}
                </span>
              ) : null}
            </div>
          </header>
          <ServiceArt
            src={service.heroImage}
            alt={service.heroImageAlt}
            seed={service.id}
            label={service.title.split(" ")[0]}
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[4/3] rounded-[22px] border border-white/8"
          />
        </div>
      </Container>

      {/* Body + features */}
      <Container className="mt-[clamp(72px,8vw,120px)] grid gap-14 lg:grid-cols-[1.2fr_1fr]">
        {html ? <div className="prose-leo" dangerouslySetInnerHTML={{ __html: html }} /> : <div />}
        {service.features.length ? (
          <section aria-labelledby="features-h" className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="features-h" className="m-0 font-mono text-xs tracking-[0.2em] text-accent uppercase">{t.whatYouGet}</h2>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
              {service.features.map((f, i) => (
                <li key={i} className="rounded-2xl border border-white/8 bg-ink-card p-5">
                  <div className="flex items-start gap-3.5">
                    <span aria-hidden className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                    <div>
                      <h3 className="m-0 text-[17px] font-semibold text-white">{f.title}</h3>
                      <p className="m-0 mt-1.5 font-body text-[14.5px] leading-relaxed text-white/60">{f.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>

      {/* Process */}
      {service.processSteps.length ? (
        <section aria-labelledby="process-h" className="mt-[clamp(80px,9vw,140px)] border-y border-white/8 bg-ink-raised py-[clamp(72px,8vw,120px)]">
          <Container>
            <h2 id="process-h" className="m-0 max-w-[700px] text-[clamp(34px,4vw,56px)] leading-[1.02] font-semibold tracking-[-0.03em]">
              {t.howWeWork[0]}<Accent>{t.howWeWork[1]}</Accent>
            </h2>
            <ol className="m-0 mt-12 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {service.processSteps.map((s, i) => (
                <li key={i} className="flex flex-col gap-3 border-t border-white/12 pt-6">
                  <span className="font-mono text-xs tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="m-0 text-[20px] font-semibold text-white">{s.title}</h3>
                  <p className="m-0 font-body text-[14.5px] leading-relaxed text-white/60">{s.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* FAQ — native <details>, no JS */}
      {service.faqs.length ? (
        <Container className="mt-[clamp(80px,9vw,140px)] grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="m-0 text-[clamp(34px,4vw,56px)] leading-[1.02] font-semibold tracking-[-0.03em]">
            {t.faq[0]}<Accent>{t.faq[1]}</Accent>
          </h2>
          <div className="flex flex-col">
            {service.faqs.map((f, i) => (
              <details key={i} className="group border-b border-white/10 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[18px] font-semibold text-white">
                  {f.question}
                  <span aria-hidden className="text-2xl leading-none text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="m-0 mt-3 font-body text-[15px] leading-relaxed text-white/65">{f.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      ) : null}

      {/* Related */}
      {related.length ? (
        <Container className="mt-[clamp(80px,9vw,140px)]">
          <div className="flex items-end justify-between gap-6">
            <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em]">{t.related}</h2>
            <Link href={L("/services")} className="hidden font-body text-[14.5px] font-semibold text-accent no-underline sm:inline">
              {t.allServices}
            </Link>
          </div>
          <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={L(`/services/${r.slug}`)} className="block h-full rounded-2xl border border-white/8 bg-ink-card p-6 no-underline transition-colors hover:border-accent/40">
                  <h3 className="m-0 text-[18px] font-semibold text-white">{r.title}</h3>
                  <p className="m-0 mt-2 font-body text-[14px] leading-relaxed text-white/55">{r.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {/* CTA */}
      <Container className="py-[clamp(80px,9vw,140px)]">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[28px] border border-accent/25 bg-[radial-gradient(100%_140%_at_0%_0%,rgba(73,220,122,0.18),transparent_60%),#081512] p-[clamp(28px,5vw,64px)] md:flex-row md:items-center">
          <div>
            <h2 className="m-0 text-[clamp(30px,3.6vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em]">
              {t.ctaHeading[0]}<Accent>{service.title}{t.ctaHeading[1]}</Accent>
            </h2>
            <p className="m-0 mt-3 font-body text-white/65">{t.ctaNote}</p>
          </div>
          <Link href={L("/#contact")} className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-accent px-7 py-4 font-body text-[15px] font-bold text-ink no-underline">
            {cta} <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </article>
  );
}
