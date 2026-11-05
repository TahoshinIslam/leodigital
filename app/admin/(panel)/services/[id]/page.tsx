import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePageUser } from "@/server/auth/guard";
import ServiceEditorView from "@/views/admin/services/ServiceEditorView";

export const metadata: Metadata = { title: "Edit service" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditServicePage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) notFound();
  const user = await requirePageUser(`/admin/services/${n}`);
  return <ServiceEditorView user={user} id={n} saved={sp.saved === "1"} />;
}
