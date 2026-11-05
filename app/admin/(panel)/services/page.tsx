import type { Metadata } from "next";
import { getAdminT } from "@/lib/i18n/admin";
import { requirePageUser } from "@/server/auth/guard";
import ServicesListView from "@/views/admin/services/ServicesListView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminT();
  return { title: t.services.title };
}

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requirePageUser("/admin/services");
  return <ServicesListView user={user} searchParams={await searchParams} />;
}
