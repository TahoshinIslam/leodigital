import PricingPlans from "@/views/site/home/sections/PricingPlans";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/site/ui";
import { getContent } from "@/content";

export default async function Pricing() {
  const { home, pricing, annualDiscount } = await getContent();
  const c = home.pricing;
  return (
    <section id="pricing" className="border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]">
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="08">{c.eyebrow}</Eyebrow>
          <SectionHeading>
            {c.heading[0]}<Accent>{c.heading[1]}</Accent>
          </SectionHeading>
          <Lede>
            {c.lede}
          </Lede>
        </div>

        {/* The tier cards, plus the monthly/annual switch that drives them. */}
        <PricingPlans tiers={pricing} discount={annualDiscount} labels={{ monthly: c.monthly, annual: c.annual, period: c.period }} />

        <p className="mt-10 text-center font-body text-[14px] text-white/45">
          {c.footnote}
        </p>
      </Container>
    </section>
  );
}
