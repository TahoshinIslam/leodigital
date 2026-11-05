import CursorGlow from "@/components/site/CursorGlow";
import SmoothScroll from "@/components/site/anim/SmoothScroll";
import { getPublishedServices } from "@/server/modules/services";
import BrandWeb from "@/views/site/home/sections/BrandWeb";
import Contact from "@/views/site/home/sections/Contact";
import Cta from "@/views/site/home/sections/Cta";
import Hero from "@/views/site/home/sections/Hero";
import Industries from "@/views/site/home/sections/Industries";
import Playbook from "@/views/site/home/sections/Playbook";
import Pricing from "@/views/site/home/sections/Pricing";
import Services from "@/views/site/home/sections/Services";
import Studio from "@/views/site/home/sections/Studio";
import Testimonials from "@/views/site/home/sections/Testimonials";
import Why from "@/views/site/home/sections/Why";

/**
 * The marketing home page. Smooth scrolling and the cursor glow are mounted
 * here rather than in the site layout, so service detail pages don't download
 * Lenis/GSAP at all.
 */
export default async function HomeView() {
  const services = await getPublishedServices();
  return (
    <>
      <SmoothScroll />
      <CursorGlow />
      <Hero />
      <Why />
      <Industries />
      <Services services={services} />
      <Playbook />
      <BrandWeb />
      <Studio />
      <Testimonials />
      <Pricing />
      <Cta />
      <Contact />
    </>
  );
}
