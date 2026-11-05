import CountUp from "@/components/site/anim/CountUp";
import HeroBackdrop from "@/components/site/HeroBackdrop";
import { Accent, Container, GhostButton, PrimaryButton } from "@/components/site/ui";
import { getContent } from "@/content";

export default async function Hero() {
  const { home, stats } = await getContent();
  const c = home.hero;
  return (
    <section className="relative -mt-[74px] overflow-hidden bg-ink pt-[74px]">
      {/* Hyperspeed road backdrop. Fills the hero; the component gates itself to
          lg+ and caps the pixel ratio, so tablet/phone stay a clean dark hero. */}
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
        <HeroBackdrop />
      </div>

      {/* Single legibility scrim: darkens behind the headline and settles the
          road into the page before the stats strip. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(115% 65% at 32% 40%, rgba(4,10,10,0.72), transparent 60%), linear-gradient(180deg, rgba(4,10,10,0.5) 0%, transparent 30%, transparent 68%, #040A0A 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[30px] left-1/2 z-[1] hidden -translate-x-1/2 text-[clamp(170px,22vw,320px)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-white/3 select-none md:block"
      >
        {c.watermark}
      </div>

      <Container className="relative z-10">
        {/* The entrance is CSS (see .hero-* in globals.css), not GSAP: it starts
            at first paint instead of waiting for hydration, so the headline —
            the page's LCP element — is visible within a frame of FCP. */}
        <div className="hero-settle origin-center">
          <div className="flex min-h-[620px] flex-col justify-center gap-8 pt-[90px] pb-4">
            <div className="hero-fade [animation-delay:120ms]">
              <div className="inline-flex items-center gap-3.5 self-start">
                <span
                  aria-hidden
                  className="h-px w-9"
                  style={{ background: "linear-gradient(90deg, #49DC7A, rgba(73,220,122,0.15))" }}
                />
                <span className="font-mono text-[12.5px] tracking-[0.16em] text-white/75 uppercase">
                  {c.eyebrow}
                </span>
              </div>
            </div>

            <h1 className="m-0 max-w-[16ch] text-[clamp(60px,8.4vw,132px)] leading-[0.9] font-medium tracking-[-0.052em] text-white">
              <span className="hero-line">
                <span>{c.title[0]}</span>
              </span>{" "}
              <span className="hero-line">
                <span className="[animation-delay:110ms]">
                  <Accent>{c.title[1]}</Accent>
                </span>
              </span>
            </h1>

            <div className="hero-fade [animation-delay:420ms]">
              <p className="m-0 max-w-[540px] font-body text-lg leading-relaxed text-white/65">
                {c.lede}
              </p>
            </div>

            <div className="hero-fade [animation-delay:540ms]">
              <div className="flex flex-wrap items-center gap-4">
                <PrimaryButton href="#contact">{c.primary}</PrimaryButton>
                <GhostButton href="#services">{c.secondary}</GhostButton>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-1 pb-[26px]">
          <div className="animate-scroll-cue flex flex-col items-center gap-2">
            <span className="font-mono text-[10.5px] tracking-[0.24em] text-white/40 uppercase">
              {c.scroll}
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
