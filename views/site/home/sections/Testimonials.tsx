import Reveal from "@/components/site/anim/Reveal";
import { Accent, Container, Eyebrow, SectionHeading } from "@/components/site/ui";
import { testimonials } from "@/content/site";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-white/8 bg-ink-raised py-[clamp(96px,10vw,150px)]"
    >
      <Container>
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="07">Client words</Eyebrow>
          <SectionHeading>
            They said it <Accent>better.</Accent>
          </SectionHeading>
        </div>

        <Reveal stagger={0.12} className="mt-16 grid gap-[18px] lg:grid-cols-[1.3fr_1fr]">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="m-0 flex flex-col justify-between gap-10 rounded-3xl border border-white/12 p-10"
              style={
                t.featured
                  ? {
                      background:
                        "linear-gradient(160deg, rgba(73,220,122,0.07), rgba(73,220,122,0.02) 45%, rgba(9,19,18,0))",
                    }
                  : { background: "rgba(9,19,18,0.5)" }
              }
            >
              <blockquote
                className={`m-0 font-serif italic text-white ${
                  t.featured ? "text-3xl leading-[1.35]" : "text-2xl leading-[1.4]"
                }`}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex flex-col gap-1">
                <span className="text-base font-semibold text-white">{t.name}</span>
                <span className="font-mono text-xs tracking-[0.16em] text-accent/70 uppercase">
                  {t.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
