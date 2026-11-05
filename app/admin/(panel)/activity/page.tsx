import type { Metadata } from "next";
import { getAdminT } from "@/lib/i18n/admin";
import { requirePageUser } from "@/server/auth/guard";
import ActivityView from "@/views/admin/activity/ActivityView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminT();
  return { title: t.activity.title };
}

export default async function ActivityPage() {
  const user = await requirePageUser("/admin/activity");
  return <ActivityView user={user} />;
}
