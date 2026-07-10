import Link from "next/link";
import type { ReactNode } from "react";
import Magnetic from "@/components/anim/Magnetic";
import SplitReveal from "@/components/anim/SplitReveal";
import SpotlightCard from "@/components/anim/SpotlightCard";
import type { Tile } from "@/content/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1320px] px-6 md:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.15em] uppercase">
      <span className="text-accent">{index}</span>
      <span aria-hidden className="h-px w-6 bg-white/25" />
      <span className="text-white/70">{children}</span>
    </span>
  );
}

/** Note: no `text-wrap: balance` here — it interferes with SplitText line splitting. */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <SplitReveal
      as="h2"
      className="m-0 text-[clamp(38px,4.6vw,64px)] leading-[1.02] font-semibold tracking-[-0.03em] text-white"
    >
      {children}
    </SplitReveal>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <em className="font-serif text-accent font-normal italic">{children}</em>;
}

export function Lede({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`m-0 max-w-[560px] font-body text-[17px] leading-relaxed text-white/65 ${className}`}>
      {children}
    </p>
  );
}

export function ArrowRight({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/** Arrow slides right on hover; whole button is magnetic. */
export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Magnetic>
      <Link
        href={href}
        className={`group inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-[17px] font-body text-base font-bold text-ink no-underline shadow-[0_10px_34px_rgba(73,220,122,0.38),inset_0_1px_0_rgba(255,255,255,0.4)] transition-shadow duration-[350ms] ease-luxe hover:shadow-[0_18px_48px_rgba(73,220,122,0.52),inset_0_1px_0_rgba(255,255,255,0.4)] ${className}`}
      >
        {children}
        <span className="inline-flex transition-transform duration-[350ms] ease-luxe group-hover:translate-x-1">
          <ArrowRight />
        </span>
      </Link>
    </Magnetic>
  );
}

export function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Magnetic strength={0.25}>
      <Link
        href={href}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-8 py-[17px] font-body text-base font-semibold text-white no-underline backdrop-blur-[10px] transition-colors duration-[350ms] ease-luxe hover:border-accent/45 hover:bg-accent/8"
      >
        {children}
      </Link>
    </Magnetic>
  );
}

export function TileCard({ tile }: { tile: Tile }) {
  return (
    <SpotlightCard className="flex h-full flex-col gap-3 px-[26px] py-7">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.12em] text-accent">{tile.num}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 transition-all duration-500 ease-luxe group-hover:rotate-45 group-hover:text-accent" aria-hidden>
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
      <div className="mt-1 text-[19px] font-semibold tracking-[-0.015em] text-white">{tile.title}</div>
      <p className="m-0 font-body text-[14.5px] leading-relaxed text-white/55">{tile.copy}</p>
    </SpotlightCard>
  );
}
