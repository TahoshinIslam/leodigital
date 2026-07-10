import Accordion from "@/components/Accordion";
import SplitReveal from "@/components/anim/SplitReveal";
import { Accent, Container, Eyebrow } from "@/components/ui";
import { brandItems } from "@/content/site";

export default function BrandWeb() {
  return (
    <section
      id="brand-web"
      className="border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-[22px]">
            <Eyebrow index="05">Brand &amp; web</Eyebrow>
            <SplitReveal
              as="h2"
              className="m-0 text-[clamp(34px,3.8vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em] text-white"
            >
              Identity, designed <Accent>to convert.</Accent>
            </SplitReveal>
            <p className="m-0 font-body text-[15.5px] leading-[1.65] text-white/60">
              Your brand identity is what sets you apart and resonates with your audience — values,
              mission, personality, and the visual system that carries them. We build it end to end, from
              the mark on your letterhead to the site that closes the sale.
            </p>
            <p className="m-0 font-body text-[15.5px] leading-[1.65] text-white/60">
              Every piece is held to the same standard: does it look like you, and does it move the number.
            </p>
          </div>

          <Accordion items={brandItems} />
        </div>
      </Container>
    </section>
  );
}
