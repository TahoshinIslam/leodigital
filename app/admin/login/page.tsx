import type { Metadata } from "next";
import { getAdminT } from "@/lib/i18n/admin";
import LoginView from "@/views/admin/auth/LoginView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminT();
  return { title: t.login.title };
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <LoginView searchParams={searchParams} />;
}
