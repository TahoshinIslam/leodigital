import BorderGlow from "@/components/BorderGlow";
import Reveal from "@/components/anim/Reveal";
import ServicesBackdrop from "@/components/ServicesBackdrop";
import { Accent, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { services, type Tile } from "@/content/site";

// The service tiles carry a self-animating (no-hover) shining border in the
// brand green/cyan. #49DC7A ≈ hsl(146 68% 57%).
const SERVICE_MESH = ["#49dc7a", "#22f2ef", "#2ecc8f"];

function ServiceCard({ tile }: { tile: Tile }) {
  return (
    <BorderGlow
      autoShine
      className="h-full"
      colors={SERVICE_MESH}
      glowColor="146 68 57"
      backgroundColor="#0C1B16"
      borderRadius={14}
      glowRadius={26}
      coneSpread={26}
      glowIntensity={1}
    >
      <div className="flex h-full flex-col gap-3 px-[26px] py-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.12em] text-accent">{tile.num}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-white/25" aria-hidden>
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
        <div className="mt-1 text-[19px] font-semibold tracking-[-0.015em] text-white">{tile.title}</div>
        <p className="m-0 font-body text-[14.5px] leading-relaxed text-white/55">{tile.copy}</p>
      </div>
    </BorderGlow>
  );
}

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
            <ServiceCard key={t.num} tile={t} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
