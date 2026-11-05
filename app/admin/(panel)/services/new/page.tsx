import type { Metadata } from "next";
import { getAdminT } from "@/lib/i18n/admin";
import { requirePageUser } from "@/server/auth/guard";
import ServiceEditorView from "@/views/admin/services/ServiceEditorView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminT();
  return { title: t.services.new };
}

export default async function NewServicePage() {
  const user = await requirePageUser("/admin/services/new");
  return <ServiceEditorView user={user} id={null} />;
}
