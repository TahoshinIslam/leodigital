import Reveal from "@/components/site/anim/Reveal";
import IndustriesGem from "@/components/site/IndustriesGem";
import { Accent, Container, Eyebrow, Lede, SectionHeading, TileCard } from "@/components/site/ui";
import { getContent } from "@/content";

export default async function Industries() {
  const { home, industries } = await getContent();
  const c = home.industries;
  return (
    <section
      id="industries"
      className="relative overflow-hidden border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]"
    >
      {/* The emerald gem, relocated from the hero. Decorative: it sits beside
          the section intro and behind nothing that needs to be read. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[4%] right-[2%] hidden h-[320px] w-[320px] opacity-60 lg:block xl:h-[400px] xl:w-[400px]"
        style={{
          // Feather the edges so the gem dissolves into the section rather than
          // ending at a hard canvas boundary.
          maskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
        }}
      >
        <IndustriesGem />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[120px] right-[-6%] h-[600px] w-[600px]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(73,220,122,0.10), transparent 70%)" }}
      />

      <Container className="relative">
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="02">{c.eyebrow}</Eyebrow>
          <SectionHeading>
            {c.heading[0]}<Accent>{c.heading[1]}</Accent>
          </SectionHeading>
          <Lede>
            {c.lede}
          </Lede>
        </div>

        <Reveal stagger={0.07} className="mt-16 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((t) => (
            <TileCard key={t.num} tile={t} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
