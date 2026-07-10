import Accordion from "@/components/Accordion";
import PlaybookBackdrop from "@/components/PlaybookBackdrop";
import { Accent, Container, Eyebrow, Lede, SectionHeading } from "@/components/ui";
import { playbook } from "@/content/site";

export default function Playbook() {
  return (
    <section
      id="playbook"
      className="relative isolate overflow-hidden border-t border-white/8 bg-ink py-[clamp(96px,10vw,150px)]"
    >
      {/* DotField grid: fixed while the six blocks scroll over them. */}
      <PlaybookBackdrop />

      {/* Holds contrast for a section that is almost entirely body copy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(110% 60% at 50% 45%, rgba(4,10,10,0.62), rgba(4,10,10,0.80) 55%, rgba(4,10,10,0.93) 100%), linear-gradient(180deg, #040A0A 0%, transparent 10%, transparent 90%, #040A0A 100%)",
        }}
      />

      <Container className="relative flex flex-col gap-[clamp(64px,7vw,100px)]">
        <div className="flex max-w-[760px] flex-col gap-[22px]">
          <Eyebrow index="04">The playbook</Eyebrow>
          <SectionHeading>
            How each channel <Accent>earns its keep.</Accent>
          </SectionHeading>
          <Lede>
            No black boxes. This is the work, in depth — what we do, why it compounds, and how it is
            measured.
          </Lede>
        </div>

        {playbook.map((block) => (
          <div
            key={block.id}
            className="grid gap-16 border-t border-white/10 pt-13 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
          >
            <div className="flex flex-col gap-[18px]">
              <Eyebrow index={block.index}>{block.eyebrow}</Eyebrow>
              <h3 className="m-0 text-[30px] leading-[1.08] font-semibold tracking-[-0.02em] text-white">
                {block.heading}
              </h3>
              <p className="m-0 font-body text-[15.5px] leading-[1.65] text-white/60">{block.copy}</p>

              {block.chips && (
                <div className="mt-1.5 flex flex-wrap gap-2.5">
                  {block.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/12 bg-accent/4 px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] text-white/65 uppercase"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Accordion items={block.items} />
          </div>
        ))}
      </Container>
    </section>
  );
}
