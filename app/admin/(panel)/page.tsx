import type { Metadata } from "next";
import { requirePageUser } from "@/server/auth/guard";
import DashboardView from "@/views/admin/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const user = await requirePageUser("/admin");
  return <DashboardView user={user} />;
}
