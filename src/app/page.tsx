import SmoothScroll from "@/components/anim/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import BrandWeb from "@/components/sections/BrandWeb";
import Contact from "@/components/sections/Contact";
import Cta from "@/components/sections/Cta";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Playbook from "@/components/sections/Playbook";
import Pricing from "@/components/sections/Pricing";
import Services from "@/components/sections/Services";
import Studio from "@/components/sections/Studio";
import Testimonials from "@/components/sections/Testimonials";
import Why from "@/components/sections/Why";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-ink text-white">
      <SmoothScroll />
      <CursorGlow />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-1"
        style={{
          background: "radial-gradient(145% 150% at 50% 16%, transparent 74%, rgba(0,0,0,0.30) 100%)",
        }}
      />
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-1 opacity-[0.045] mix-blend-overlay"
      />

      <Nav />
      <main>
        <Hero />
        <Why />
        <Industries />
        <Services />
        <Playbook />
        <BrandWeb />
        <Studio />
        <Testimonials />
        <Pricing />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
