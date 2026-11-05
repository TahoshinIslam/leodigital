import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import ServiceArt from "@/components/site/service/ServiceArt";
import { Accent, ArrowRight, Container } from "@/components/site/ui";
import { getContent } from "@/content";
import { localePath } from "@/lib/i18n/config";
import { getPublishedServices } from "@/server/modules/services";

export default async function ServicesIndexView() {
  const { ui, locale } = await getContent();
  const t = ui.services;
  const L = (p: string) => localePath(locale, p);
  const services = await getPublishedServices(locale);

  return (
    <div className="relative z-2">
      <Container className="pt-10 pb-[clamp(80px,9vw,140px)]">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: L("/") }, { label: t.breadcrumbServices, href: L("/services") }]} />
        <header className="mt-8 flex max-w-[860px] flex-col gap-6">
          <h1 className="m-0 text-[clamp(44px,6.4vw,96px)] leading-[0.95] font-medium tracking-[-0.045em]">
            {t.indexTitle[0]}<Accent>{t.indexTitle[1]}</Accent>
          </h1>
          <p className="m-0 max-w-[600px] font-body text-lg leading-relaxed text-white/65">
            {t.indexLede}
          </p>
        </header>

        {services.length === 0 ? (
          <p className="mt-16 font-body text-white/60">{t.empty}</p>
        ) : (
          <ul className="m-0 mt-16 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={L(`/services/${s.slug}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-white/8 bg-ink-card no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-ink-card-hover"
                >
                  <ServiceArt
                    src={s.heroImage}
                    alt={s.heroImageAlt}
                    seed={i}
                    label={String(i + 1).padStart(2, "0")}
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[16/9]"
                  />
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    {s.eyebrow ? (
                      <span className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">{s.eyebrow}</span>
                    ) : null}
                    <h2 className="m-0 text-[22px] font-semibold tracking-[-0.02em] text-white">{s.title}</h2>
                    <p className="m-0 flex-1 font-body text-[15px] leading-relaxed text-white/60">{s.summary}</p>
                    <span className="mt-2 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-accent">
                      {t.learnMore} <span className="transition-transform group-hover:translate-x-1"><ArrowRight size={15} /></span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
