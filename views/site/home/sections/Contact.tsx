import { Container } from "@/components/site/ui";
import { contact } from "@/content/site";

const iconClass = "text-accent";

function Phone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Mail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function Pin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const label = "font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase";
const value = "text-[22px] font-semibold tracking-[-0.01em] text-white";
const note = "m-0 font-body text-[14.5px] leading-relaxed text-white/60";

export default function Contact() {
  return (
    <section id="contact" className="bg-ink pb-[clamp(96px,10vw,150px)]">
      <Container>
        <div className="grid gap-8 border-t border-white/10 pt-13 md:grid-cols-3">
          <div className="flex flex-col gap-3.5">
            <Phone />
            <span className={label}>Call</span>
            <div className={value}>
              {contact.phones.map((p) => (
                <div key={p}>
                  <a href={`tel:${p.replace(/\s/g, "")}`} className="no-underline hover:text-accent">
                    {p}
                  </a>
                </div>
              ))}
            </div>
            <p className={note}>We answer Saturday to Thursday, 10:00–18:00.</p>
          </div>

          <div className="flex flex-col gap-3.5">
            <Mail />
            <span className={label}>Write</span>
            <div className={value}>
              <a href={`mailto:${contact.email}`} className="no-underline hover:text-accent">
                {contact.email}
              </a>
            </div>
            <p className={note}>We reply within 8 hours on business days.</p>
          </div>

          <div className="flex flex-col gap-3.5">
            <Pin />
            <span className={label}>Visit</span>
            <div className={value}>
              {contact.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            <p className={note}>Come see us, Saturday to Thursday, 10:00–18:00.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
