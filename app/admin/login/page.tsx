import type { Metadata } from "next";
import LoginView from "@/views/admin/auth/LoginView";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <LoginView searchParams={searchParams} />;
}
