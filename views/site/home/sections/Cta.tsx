import SplitReveal from "@/components/site/anim/SplitReveal";
import { Accent, Container, Eyebrow, PrimaryButton } from "@/components/site/ui";

export default function Cta() {
  return (
    <section className="border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]">
      <Container className="flex flex-col gap-[72px]">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-[22px]">
            <Eyebrow index="09">Partnership</Eyebrow>
            <SplitReveal
              as="h2"
              className="m-0 text-[clamp(34px,3.8vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em] text-white"
            >
              Make Leotech your <Accent>growth partner.</Accent>
            </SplitReveal>
          </div>
          <div className="flex flex-col gap-5">
            <p className="m-0 font-body text-[16.5px] leading-[1.7] text-white/65">
              We are committed to results that speak for themselves. Rigorous tracking, analysis, and
              optimization keep every engagement aligned with your objectives — more traffic, higher
              conversion, stronger brand visibility. Outcomes you can point to in a board meeting.
            </p>
            <p className="m-0 font-body text-[16.5px] leading-[1.7] text-white/65">
              At the core is client satisfaction: we go beyond the brief to understand your business,
              exceed expectations, and build partnerships on trust, transparency, and integrity.
            </p>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[28px] border border-white/12 p-[clamp(56px,7vw,96px)] text-center shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_90px_rgba(73,220,122,0.12)]"
          style={{ background: "linear-gradient(180deg, #0A1E17, #040A0A)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "radial-gradient(60% 90% at 50% 125%, rgba(73,220,122,0.4), transparent 65%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-7">
            <span className="font-mono text-xs tracking-[0.15em] text-white/70 uppercase">
              Free consultation — Saturday to Thursday
            </span>
            <SplitReveal
              as="h2"
              className="m-0 max-w-[760px] text-[clamp(40px,5vw,72px)] leading-none font-semibold tracking-[-0.035em] text-white"
            >
              Your competitors hope <Accent>you&rsquo;ll wait.</Accent>
            </SplitReveal>
            <PrimaryButton href="#contact">Book a free consultation</PrimaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
