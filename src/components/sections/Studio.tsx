import Reveal from "@/components/anim/Reveal";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/ui";
import { studioCards } from "@/content/site";

export default function Studio() {
  return (
    <section id="studio" className="border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]">
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="06">In-house studio</Eyebrow>
          <SectionHeading>
            Visuals that sell <Accent>before you speak.</Accent>
          </SectionHeading>
          <Lede>
            Our own video studio and editing team — so your product never waits on a third party to look
            its best.
          </Lede>
        </div>

        <Reveal stagger={0.1} className="mt-16 grid gap-[18px] md:grid-cols-3">
          {studioCards.map((c) => (
            <div key={c.title} className="group flex flex-col gap-[18px]">
              {/* Slow zoom inside a clipped frame. */}
              <div className="relative aspect-[16/11] overflow-hidden rounded-[22px]">
                <div
                  className="absolute inset-0 transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.06]"
                  style={{ background: c.gradient }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, transparent 55%, rgba(4,20,14,0.7) 100%)",
                  }}
                />
                <span className="absolute bottom-3.5 left-4 font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">
                  {c.caption}
                </span>
              </div>
              <div className="text-[21px] font-semibold tracking-[-0.01em] text-white">{c.title}</div>
              <p className="m-0 font-body text-[15px] leading-relaxed text-white/60">{c.copy}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
