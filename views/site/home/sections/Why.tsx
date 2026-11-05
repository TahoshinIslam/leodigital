import Reveal from "@/components/site/anim/Reveal";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/site/ui";
import { getContent } from "@/content";

export default async function Why() {
  const { home, whyPoints } = await getContent();
  const c = home.why;
  return (
    <section
      id="why"
      className="border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="01">{c.eyebrow}</Eyebrow>
          <SectionHeading>
            {c.heading[0]}<Accent>{c.heading[1]}</Accent>
          </SectionHeading>
          <Lede>
            {c.lede}
          </Lede>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-5">
            {c.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="m-0 font-body text-[16.5px] leading-[1.7] text-white/65">
                {p}
              </p>
            ))}
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
