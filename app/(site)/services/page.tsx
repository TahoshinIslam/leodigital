import type { Metadata } from "next";
import ServicesIndexView from "@/views/site/services/ServicesIndexView";

export const metadata: Metadata = {
  title: "Digital marketing services",
  description:
    "SEO, Meta and Google Ads, email, influencer marketing, content, web and online PR — Leotech's digital marketing services for ambitious Bangladeshi brands.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Digital marketing services | Leotech", url: "/services" },
};

export default function ServicesPage() {
  return <ServicesIndexView />;
}
