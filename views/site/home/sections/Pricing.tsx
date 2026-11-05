import Link from "next/link";
import Reveal from "@/components/site/anim/Reveal";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/site/ui";
import { pricing, type PricingTier } from "@/content/site";

function Check({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
        filled ? "bg-ink/15 text-ink" : "bg-accent/15 text-accent"
      }`}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

/**
 * Three distinct card treatments that read as a progression, mirroring the
 * reference: a plain dark tier, an accent-outlined dark tier, and a fully
 * filled accent tier — each with its own button style. Brand green throughout.
 */
function PriceCard({ tier, index }: { tier: PricingTier; index: number }) {
  const filled = index === 2; // Scale: the filled highlight (last card)
  const outlined = index === 1; // Growth: accent-bordered dark card

  const cardCls = filled
    ? "border-accent/60 bg-accent text-ink shadow-[0_34px_90px_rgba(73,220,122,0.3)]"
    : outlined
      ? "border-accent/45 bg-ink-card text-white"
      : "border-white/10 bg-ink-card text-white";

  const pillCls = filled
    ? "bg-ink/12 text-ink"
    : outlined
      ? "bg-accent/12 text-accent"
      : "bg-white/8 text-white/80";

  const button = filled ? (
    <Link
      href="#contact"
      className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-[15px] font-body text-[15px] font-bold text-white no-underline transition-transform duration-[350ms] ease-luxe hover:-translate-y-0.5"
    >
      {tier.cta}
    </Link>
  ) : outlined ? (
    <Link
      href="#contact"
      className="inline-flex w-full items-center justify-center rounded-full border border-accent/60 px-8 py-[15px] font-body text-[15px] font-semibold text-accent no-underline transition-colors duration-[350ms] ease-luxe hover:bg-accent/10"
    >
      {tier.cta}
    </Link>
  ) : (
    <Link
      href="#contact"
      className="inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-[15px] font-body text-[15px] font-bold text-ink no-underline transition-transform duration-[350ms] ease-luxe hover:-translate-y-0.5"
    >
      {tier.cta}
    </Link>
  );

  return (
    <div
      className={`relative flex h-full flex-col rounded-[24px] border p-8 transition-transform duration-500 ease-luxe hover:-translate-y-[6px] ${cardCls}`}
    >
      <div className={`self-start rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase ${pillCls}`}>
        {tier.name}
      </div>

      <div className="mt-6 flex items-end gap-1.5">
        <span className="text-[clamp(40px,4.2vw,54px)] leading-none font-semibold tracking-[-0.03em]">
          {tier.price}
        </span>
        {tier.cadence && (
          <span className={`pb-1.5 font-body text-sm ${filled ? "text-ink/60" : "text-white/50"}`}>
            {tier.cadence}
          </span>
        )}
      </div>

      <p className={`mt-4 font-body text-[14.5px] leading-relaxed ${filled ? "text-ink/75" : "text-white/60"}`}>
        {tier.tagline}
      </p>

      <div className={`my-7 h-px w-full ${filled ? "bg-ink/15" : "bg-white/10"}`} />

      <ul className="m-0 flex flex-1 list-none flex-col gap-3.5 p-0">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check filled={filled} />
            <span className={`font-body text-[14.5px] leading-snug ${filled ? "text-ink/85" : "text-white/70"}`}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-9">{button}</div>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]">
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="08">Pricing</Eyebrow>
          <SectionHeading>
            Plans that scale <Accent>with your ambition.</Accent>
          </SectionHeading>
          <Lede>
            Transparent monthly retainers — no lock-in, no surprises. Start where you are and move up the
            moment the numbers say so.
          </Lede>
        </div>

        <Reveal stagger={0.08} className="mt-16 grid items-stretch gap-[18px] md:grid-cols-3">
          {pricing.map((tier, i) => (
            <PriceCard key={tier.name} tier={tier} index={i} />
          ))}
        </Reveal>

        <p className="mt-10 text-center font-body text-[14px] text-white/45">
          Every plan starts with a free consultation. Prices in BDT, excluding ad spend and VAT.
        </p>
      </Container>
    </section>
  );
}
