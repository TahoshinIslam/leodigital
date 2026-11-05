import type { Metadata } from "next";
import { getAdminT } from "@/lib/i18n/admin";
import { requirePageUser } from "@/server/auth/guard";
import UsersView from "@/views/admin/users/UsersView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminT();
  return { title: t.users.title };
}

export default async function UsersPage() {
  const user = await requirePageUser("/admin/users");
  return <UsersView user={user} />;
}
