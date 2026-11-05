import type { Metadata } from "next";
import { requirePageUser } from "@/server/auth/guard";
import UsersView from "@/views/admin/users/UsersView";

export const metadata: Metadata = { title: "Users & roles" };

export default async function UsersPage() {
  const user = await requirePageUser("/admin/users");
  return <UsersView user={user} />;
}
