import CountUp from "@/components/anim/CountUp";
import HeroStage from "@/components/anim/HeroStage";
import Reveal from "@/components/anim/Reveal";
import SplitReveal from "@/components/anim/SplitReveal";
import HeroBackdrop from "@/components/HeroBackdrop";
import { Accent, Container, GhostButton, PrimaryButton } from "@/components/ui";
import { stats } from "@/content/site";

export default function Hero() {
  return (
    <section className="relative -mt-[74px] overflow-hidden bg-ink pt-[74px]">
      {/* Hyperspeed road, filling the whole hero (not a fixed height — the
          section grows with the stats strip and with wrapped mobile copy).
          Nudged right so its vanishing point lands in the empty half of the
          layout rather than behind the headline. Phones skip it entirely: at
          that width the trails cross the copy no matter how it is framed, and
          it spares the GPU. */}
      {/* Dimmed at the tighter widths, where the headline spans the full column
          and the road has nowhere to sit but behind it. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden overflow-hidden opacity-55 md:block lg:opacity-75 xl:opacity-100"
      >
        <div className="absolute inset-0 md:translate-x-[8%] lg:translate-x-[11%]">
          <HeroBackdrop />
        </div>
      </div>

      {/* Phone fallback: the original radial wash. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[660px] md:hidden"
        style={{
          background:
            "radial-gradient(70% 66% at 24% 86%, rgba(26,224,222,0.70), transparent 60%), radial-gradient(82% 64% at 78% 92%, rgba(58,222,135,0.58), transparent 58%), linear-gradient(0deg, rgba(46,210,150,0.46) 0%, rgba(46,210,150,0.50) 32%, rgba(46,210,150,0.16) 56%, transparent 74%)",
        }}
      />

      {/* Scrim: darkens the left text column, then settles the road into the
          page background before the stats strip begins. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,10,10,0.92) 0%, rgba(4,10,10,0.78) 26%, rgba(4,10,10,0.30) 50%, rgba(4,10,10,0.04) 72%, transparent 86%), linear-gradient(180deg, rgba(4,10,10,0.5) 0%, transparent 14%, transparent 58%, rgba(4,10,10,0.80) 86%, #040A0A 99%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[30px] left-1/2 z-[1] hidden -translate-x-1/2 text-[clamp(170px,22vw,320px)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-white/3 select-none md:block"
      >
        growth
      </div>

      <Container className="relative z-10">
        <HeroStage>
          <div className="flex min-h-[620px] flex-col justify-center gap-8 pt-[90px] pb-4">
            <Reveal delay={0.15}>
              <div className="inline-flex items-center gap-3.5 self-start">
                <span
                  aria-hidden
                  className="h-px w-9"
                  style={{ background: "linear-gradient(90deg, #49DC7A, rgba(73,220,122,0.15))" }}
                />
                <span className="font-mono text-[12.5px] tracking-[0.16em] text-white/75 uppercase">
                  Digital marketing agency · Dhaka
                </span>
              </div>
            </Reveal>

            <SplitReveal
              as="h1"
              immediate
              delay={0.25}
              className="m-0 max-w-[16ch] text-[clamp(60px,8.4vw,132px)] leading-[0.9] font-medium tracking-[-0.052em] text-white"
            >
              Marketing that creates <Accent>market leaders.</Accent>
            </SplitReveal>

            <Reveal delay={0.75}>
              <p className="m-0 max-w-[540px] font-body text-lg leading-relaxed text-white/65">
                Leotech is the digital marketing partner behind Bangladesh&rsquo;s ambitious brands. SEO,
                performance media, content, and web experiences — engineered to compound.
              </p>
            </Reveal>

            <Reveal delay={0.9}>
              <div className="flex flex-wrap items-center gap-4">
                <PrimaryButton href="#contact">Book a free consultation</PrimaryButton>
                <GhostButton href="#services">View services</GhostButton>
              </div>
            </Reveal>
          </div>
        </HeroStage>

        <div className="flex justify-center pt-1 pb-[26px]">
          <div className="animate-scroll-cue flex flex-col items-center gap-2">
            <span className="font-mono text-[10.5px] tracking-[0.24em] text-white/40 uppercase">
              Scroll to explore
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#49DC7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10 pb-16 md:grid-cols-4">
          {stats.map((s) => (
            <CountUp key={s.label} value={Number(s.value)} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </Container>
    </section>
  );
}
