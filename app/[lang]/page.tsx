import type { Metadata } from "next";
import { alternatesFor, isLocale } from "@/lib/i18n/config";
import HomeView from "@/views/site/home/HomeView";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { alternates: alternatesFor(lang, "/") } : {};
}

export default function HomePage() {
  return <HomeView />;
}
