import Footer from "@/components/site/Footer";
import Nav from "@/components/site/nav/Nav";
import WebVitals from "@/components/site/WebVitals";
import { siteFontVars } from "@/lib/fonts/site";
import { getPublishedServices } from "@/server/modules/services";

/**
 * Public website chrome. The service list for the menu and footer comes from
 * the tagged cache, so it is part of the prerendered shell and refreshes the
 * moment an admin publishes or unpublishes a service.
 */
export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const services = await getPublishedServices();
  const navServices = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    eyebrow: s.eyebrow,
    heroImage: s.heroImage,
    heroImageAlt: s.heroImageAlt,
  }));

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
        Skip to content
      </a>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-1"
        style={{ background: "radial-gradient(145% 150% at 50% 16%, transparent 74%, rgba(0,0,0,0.30) 100%)" }}
      />
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-1 opacity-[0.045] mix-blend-overlay" />

      <WebVitals />
      <Nav services={navServices} />
      <main id="main">{children}</main>
      <Footer services={navServices.slice(0, 6)} />
    </div>
  );
}
