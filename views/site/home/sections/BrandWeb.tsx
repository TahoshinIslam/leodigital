import Accordion from "@/components/site/Accordion";
import SplitReveal from "@/components/site/anim/SplitReveal";
import { Accent, Container, Eyebrow } from "@/components/site/ui";
import { getContent } from "@/content";

export default async function BrandWeb() {
  const { home, brandItems } = await getContent();
  const c = home.brand;
  return (
    <section
      id="brand-web"
      className="border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-[22px]">
            <Eyebrow index="05">{c.eyebrow}</Eyebrow>
            <SplitReveal
              as="h2"
              className="m-0 text-[clamp(34px,3.8vw,52px)] leading-[1.05] font-semibold tracking-[-0.03em] text-white"
            >
              {c.heading[0]}<Accent>{c.heading[1]}</Accent>
            </SplitReveal>
            {c.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="m-0 font-body text-[15.5px] leading-[1.65] text-white/60">
                {p}
              </p>
            ))}
          </div>

          <Accordion items={brandItems} />
        </div>
      </Container>
    </section>
  );
}
