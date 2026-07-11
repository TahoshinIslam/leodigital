import PricingPlans from "@/views/site/home/sections/PricingPlans";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/site/ui";

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]">
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="08">Pricing</Eyebrow>
          <SectionHeading>
            Plans that scale <Accent>with your ambition.</Accent>
          </SectionHeading>
          <Lede>
            Transparent retainers — no lock-in, no surprises. Pay monthly, or commit to a year and keep
            20%. Start where you are and move up the moment the numbers say so.
          </Lede>
        </div>

        {/* The tier cards, plus the monthly/annual switch that drives them. */}
        <PricingPlans />

        <p className="mt-10 text-center font-body text-[14px] text-white/45">
          Every plan starts with a free consultation. Prices in BDT, excluding ad spend and VAT.
        </p>
      </Container>
    </section>
  );
}
