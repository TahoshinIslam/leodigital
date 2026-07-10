import Reveal from "@/components/anim/Reveal";
import ServicesBackdrop from "@/components/ServicesBackdrop";
import { Accent, Container, Eyebrow, SectionHeading, TileCard } from "@/components/ui";
import { services } from "@/content/site";

export default function Services() {
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      {/* Fixed orb: stays put while this section scrolls over it. */}
      <ServicesBackdrop />

      {/* Settles the orb into the band and protects the tiles' contrast. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 50%, rgba(9,19,18,0.10), rgba(9,19,18,0.45) 55%, rgba(9,19,18,0.80) 100%), linear-gradient(180deg, #091312 0%, transparent 12%, transparent 88%, #091312 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute top-6 -right-10 -z-10 text-[clamp(130px,15vw,230px)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-white/4 select-none"
      >
        services
      </div>

      <Container className="relative">
        <div className="flex max-w-[820px] flex-col gap-[22px]">
          <Eyebrow index="03">What we do</Eyebrow>
          <SectionHeading>
            Every channel. One number that matters: <Accent>yours.</Accent>
          </SectionHeading>
        </div>

        <Reveal stagger={0.07} className="mt-16 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((t) => (
            <TileCard key={t.num} tile={t} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
