import type { Metadata } from "next";
import { requirePageUser } from "@/server/auth/guard";
import ServicesListView from "@/views/admin/services/ServicesListView";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requirePageUser("/admin/services");
  return <ServicesListView user={user} searchParams={await searchParams} />;
}
