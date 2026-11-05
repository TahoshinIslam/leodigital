import type { Metadata } from "next";
import HomeView from "@/views/site/home/HomeView";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <HomeView />;
}
