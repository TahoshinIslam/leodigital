import type { Metadata } from "next";
import { requirePageUser } from "@/server/auth/guard";
import ServiceEditorView from "@/views/admin/services/ServiceEditorView";

export const metadata: Metadata = { title: "New service" };

export default async function NewServicePage() {
  const user = await requirePageUser("/admin/services/new");
  return <ServiceEditorView user={user} id={null} />;
}
