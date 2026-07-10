import Reveal from "@/components/anim/Reveal";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/ui";
import { whyPoints } from "@/content/site";

export default function Why() {
  return (
    <section
      id="why"
      className="border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="01">Why digital marketing</Eyebrow>
          <SectionHeading>
            Visibility is <Accent>no longer optional.</Accent>
          </SectionHeading>
          <Lede>
            Today, being found online is not a choice — it is the cost of entry for any business that
            intends to grow.
          </Lede>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-5">
            <p className="m-0 font-body text-[16.5px] leading-[1.7] text-white/65">
              Your next customer is already searching, scrolling, and comparing — long before they walk
              through a door or pick up the phone. Digital marketing puts your brand in that moment, at a
              fraction of what traditional media costs, and with every taka accounted for.
            </p>
            <p className="m-0 font-body text-[16.5px] leading-[1.7] text-white/65">
              It is also the only channel that reports back. Every campaign returns data on how customers
              behave, what they respond to, and where the next opportunity sits. That feedback loop turns
              marketing from an expense into a compounding asset — and it is why the businesses winning
              online in Bangladesh treat it as core infrastructure, not decoration.
            </p>
          </div>

          <Reveal stagger={0.08} className="flex flex-col">
            {whyPoints.map((p, i) => (
              <div
                key={p.num}
                className={`grid grid-cols-[auto_1fr] items-baseline gap-x-7 gap-y-2 border-t border-white/10 py-[22px] ${
                  i === whyPoints.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono text-xs tracking-[0.18em] text-accent">{p.num}</span>
                <div>
                  <div className="text-[19px] font-semibold tracking-[-0.01em] text-white">{p.title}</div>
                  <p className="mt-1.5 mb-0 font-body text-[15px] leading-relaxed text-white/60">{p.copy}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
