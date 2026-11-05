import type { Metadata } from "next";
import { requirePageUser } from "@/server/auth/guard";
import ActivityView from "@/views/admin/activity/ActivityView";

export const metadata: Metadata = { title: "Activity log" };

export default async function ActivityPage() {
  const user = await requirePageUser("/admin/activity");
  return <ActivityView user={user} />;
}
