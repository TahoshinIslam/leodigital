"use client";

import Link from "next/link";
import { useId, useState } from "react";
import Reveal from "@/components/site/anim/Reveal";
import { annualDiscount, pricing, type BillingPeriod, type PricingTier } from "@/content/site";

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

/** The Monthly / Annual pill. A radiogroup, not two buttons: the options are
 *  mutually exclusive, so arrow keys should move between them. */
function BillingToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (p: BillingPeriod) => void;
}) {
  const name = useId();
  const options: { value: BillingPeriod; label: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-ink-card p-[5px]"
    >
      {options.map((o) => {
        const active = period === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            name={name}
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-2 rounded-full px-5 py-[10px] text-[14.5px] font-semibold transition-all duration-300 ease-luxe ${
              active
                ? "bg-accent text-ink shadow-[0_8px_28px_rgba(73,220,122,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            {o.label}
            {o.value === "annual" && (
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] leading-none font-bold ${
                  active ? "bg-ink/15 text-ink" : "bg-accent/12 text-accent"
                }`}
              >
                {annualDiscount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PriceCard({
  tier,
  index,
  period,
}: {
  tier: PricingTier;
  index: number;
  period: BillingPeriod;
}) {
  const filled = index === 2; // Scale: the filled highlight (last card)
  const outlined = index === 1; // Growth: accent-bordered dark card
  const price = tier[period];

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
          {price.amount}
        </span>
        {price.cadence && (
          <span className={`pb-1.5 font-body text-sm ${filled ? "text-ink/60" : "text-white/50"}`}>
            {price.cadence}
          </span>
        )}
      </div>

      {/* Reserve the row whether or not this tier has a yearly total, so the
          cards' dividers and features stay aligned across a toggle. */}
      <p
        className={`mt-2 h-[18px] font-body text-[13px] ${filled ? "text-ink/60" : "text-white/45"}`}
      >
        {price.note ?? ""}
      </p>

      <p className={`mt-3 font-body text-[14.5px] leading-relaxed ${filled ? "text-ink/75" : "text-white/60"}`}>
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

export default function PricingPlans() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <>
      <div className="mt-10 flex justify-center md:mt-12">
        <BillingToggle period={period} onChange={setPeriod} />
      </div>

      <Reveal stagger={0.08} className="mt-12 grid items-stretch gap-[18px] md:grid-cols-3">
        {pricing.map((tier, i) => (
          <PriceCard key={tier.name} tier={tier} index={i} period={period} />
        ))}
      </Reveal>
    </>
  );
}
