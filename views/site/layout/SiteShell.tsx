import Footer from "@/components/site/Footer";
import Nav from "@/components/site/nav/Nav";
import type { NavCopy } from "@/components/site/nav/types";
import WebVitals from "@/components/site/WebVitals";
import { getContent } from "@/content";
import { siteFontVars } from "@/lib/fonts/site";
import { localePath } from "@/lib/i18n/config";
import { getPublishedServices } from "@/server/modules/services";

/**
 * Public website chrome. The service list for the menu and footer comes from
 * the tagged cache (per locale), so it is part of the prerendered shell and
 * refreshes the moment an admin publishes, unpublishes or translates a service.
 */
export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const t = await getContent();
  const services = await getPublishedServices(t.locale);
  const navServices = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    eyebrow: s.eyebrow,
    heroImage: s.heroImage,
    heroImageAlt: s.heroImageAlt,
  }));

  const copy: NavCopy = {
    locale: t.locale,
    links: t.navLinks.map((l) => ({ ...l, href: localePath(t.locale, l.href) })),
    nav: t.ui.nav,
    menu: t.ui.menu,
    language: t.ui.language,
    industries: t.industries.map((i) => ({ title: i.title, copy: i.copy })),
    phone: t.contact.phones[0],
    email: t.contact.email,
  };

  return (
    <div className={`${siteFontVars} relative min-h-screen bg-ink font-sans text-white`}>
      {/* Apply the visitor's Motion preference before first paint. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("leotech:motion")==="off")document.documentElement.dataset.motion="off"}catch(e){}`,
        }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.ui.nav.skip}
      </a>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-1"
        style={{ background: "radial-gradient(145% 150% at 50% 16%, transparent 74%, rgba(0,0,0,0.30) 100%)" }}
      />
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-1 opacity-[0.045] mix-blend-overlay" />

      <WebVitals />
      <Nav services={navServices} copy={copy} />
      <main id="main">{children}</main>
      <Footer services={navServices.slice(0, 6)} />
    </div>
  );
}
