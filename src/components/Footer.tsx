import Link from "next/link";
import { Container } from "@/components/ui";
import { contact } from "@/content/site";

const columns = [
  {
    title: "Services",
    links: [
      { label: "SEO", href: "#services" },
      { label: "Meta marketing", href: "#services" },
      { label: "Google Ads", href: "#services" },
      { label: "Email marketing", href: "#services" },
      { label: "Influencer marketing", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#why" },
      { label: "Studio", href: "#studio" },
      { label: "Clients", href: "#testimonials" },
      { label: "Playbook", href: "#playbook" },
    ],
  },
];

const socials = ["Facebook", "LinkedIn", "Instagram", "YouTube"];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-ink-footer pt-18 pb-10">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-[18px]">
            <span className="text-[26px] font-bold tracking-[-0.02em] text-white">
              leotech<span className="text-accent">.</span>
            </span>
            <p className="m-0 max-w-[300px] font-body text-[14.5px] leading-[1.65] text-white/50">
              The digital marketing partner behind Bangladesh&rsquo;s ambitious brands.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent/70 uppercase">
                {col.title}
              </span>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)] no-underline transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent/70 uppercase">Contact</span>
            {contact.phones.map((p) => (
              <span key={p} className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)]">
                {p}
              </span>
            ))}
            <span className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)]">{contact.email}</span>
            <span className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)]">
              69/J Panthapath, Dhaka 1216
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/8 pt-7">
          <span className="font-mono text-xs tracking-[0.1em] text-white/40">Leotech © 2016–2026</span>
          <div className="flex gap-6">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                className="font-mono text-xs tracking-[0.14em] text-white/50 uppercase no-underline transition-colors hover:text-accent"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
