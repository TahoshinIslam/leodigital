import type { Metadata } from "next";
import { getAdminT } from "@/lib/i18n/admin";
import { requirePageUser } from "@/server/auth/guard";
import DashboardView from "@/views/admin/dashboard/DashboardView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminT();
  return { title: t.dashboard.title };
}

export default async function AdminDashboardPage() {
  const user = await requirePageUser("/admin");
  return <DashboardView user={user} />;
}
