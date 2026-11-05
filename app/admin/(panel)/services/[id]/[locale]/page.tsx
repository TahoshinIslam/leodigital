import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePageUser } from "@/server/auth/guard";
import ServiceTranslationView from "@/views/admin/services/ServiceTranslationView";

export const metadata: Metadata = { title: "Translate service" };

export default async function TranslateServicePage({ params }: PageProps<"/admin/services/[id]/[locale]">) {
  const { id, locale } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0 || locale !== "bn") notFound();
  const user = await requirePageUser(`/admin/services/${n}/${locale}`);
  return <ServiceTranslationView user={user} id={n} locale={locale} />;
}
