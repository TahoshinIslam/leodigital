import BorderGlow from "@/components/site/BorderGlow";
import Reveal from "@/components/site/anim/Reveal";
import ServicesBackdrop from "@/components/site/ServicesBackdrop";
import Link from "next/link";
import { Accent, ArrowRight, Container, Eyebrow, SectionHeading } from "@/components/site/ui";
import { getContent } from "@/content";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { ServiceSummary } from "@/lib/types";

// The service tiles carry a self-animating (no-hover) shining border in the
// brand green/cyan. #49DC7A ≈ hsl(146 68% 57%).
const SERVICE_MESH = ["#49dc7a", "#22f2ef", "#2ecc8f"];

function ServiceCard({ service, index, locale }: { service: ServiceSummary; index: number; locale: Locale }) {
  return (
    <Link
      href={localePath(locale, `/services/${service.slug}`)}
      className="group block h-full rounded-[14px] no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
    <BorderGlow
      autoShine
      className="h-full"
      colors={SERVICE_MESH}
      glowColor="146 68 57"
      backgroundColor="#0C1B16"
      borderRadius={14}
      glowRadius={26}
      coneSpread={26}
      glowIntensity={1}
    >
      <div className="flex h-full flex-col gap-3 px-[26px] py-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.12em] text-accent">{String(index + 1).padStart(2, "0")}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 transition-colors group-hover:text-accent" aria-hidden>
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
        <h3 className="m-0 mt-1 text-[19px] font-semibold tracking-[-0.015em] text-white">{service.title}</h3>
        <p className="m-0 font-body text-[14.5px] leading-relaxed text-white/55">{service.summary}</p>
      </div>
    </BorderGlow>
    </Link>
  );
}

export default async function Services({ services }: { services: ServiceSummary[] }) {
  const { home, locale } = await getContent();
  const c = home.services;
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      {/* Fixed orb: stays put while this section scrolls over it. */}
      <ServicesBackdrop />

      {/* Settles the orb into the band and protects the tiles' contrast. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 50%, rgba(9,19,18,0.10), rgba(9,19,18,0.45) 55%, rgba(9,19,18,0.80) 100%), linear-gradient(180deg, #091312 0%, transparent 12%, transparent 88%, #091312 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute top-6 -right-10 -z-10 text-[clamp(130px,15vw,230px)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-white/4 select-none"
      >
        {c.watermark}
      </div>

      <Container className="relative">
        <div className="flex max-w-[820px] flex-col gap-[22px]">
          <Eyebrow index="03">{c.eyebrow}</Eyebrow>
          <SectionHeading>
            {c.heading[0]}<Accent>{c.heading[1]}</Accent>
          </SectionHeading>
        </div>

        <Reveal stagger={0.07} className="mt-16 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} locale={locale} />
          ))}
        </Reveal>

        <div className="mt-12">
          <Link
            href={localePath(locale, "/services")}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-body text-[14.5px] font-semibold text-white no-underline transition-colors hover:border-accent hover:text-accent"
          >
            {c.all} <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
