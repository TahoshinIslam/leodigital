import Link from "next/link";
import { Container } from "@/components/site/ui";
import type { NavService } from "@/components/site/nav/types";
import { getContent } from "@/content";
import { localePath } from "@/lib/i18n/config";

// Evaluated when the module loads (build time for the static shell).
const BUILD_YEAR = new Date().getFullYear();

export default async function Footer({ services }: { services: NavService[] }) {
  const { ui, contact, socials, locale } = await getContent();
  const f = ui.footer;
  const L = (p: string) => localePath(locale, p);
  const company = [
    { label: f.about, href: L("/#why") },
    { label: f.studio, href: L("/#studio") },
    { label: f.clients, href: L("/#testimonials") },
    { label: f.playbook, href: L("/#playbook") },
    { label: f.allServices, href: L("/services") },
  ];
  const columns = [
    { title: f.services, links: services.map((s) => ({ label: s.title, href: L(`/services/${s.slug}`) })) },
    { title: f.company, links: company },
  ];
  return (
    <footer className="border-t border-white/8 bg-ink-footer pt-18 pb-10">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-[18px]">
            <span className="text-[26px] font-bold tracking-[-0.02em] text-white">
              leotech<span className="text-accent">.</span>
            </span>
            <p className="m-0 max-w-[300px] font-body text-[14.5px] leading-[1.65] text-white/50">
              {f.tagline}
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
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent/70 uppercase">{f.contact}</span>
            {contact.phones.map((p) => (
              <span key={p} className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)]">
                {p}
              </span>
            ))}
            <span className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)]">{contact.email}</span>
            <span className="font-body text-[14.5px] text-[rgba(212,235,224,0.65)]">
              {f.address}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/8 pt-7">
          <span className="font-mono text-xs tracking-[0.1em] text-white/40">Leotech © 2016–{BUILD_YEAR}</span>
          <div className="flex gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-[0.14em] text-white/50 uppercase no-underline transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
