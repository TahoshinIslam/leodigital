import type { Metadata } from "next";
import { Suspense } from "react";
import AdminRoot, { AdminRootFallback } from "@/views/admin/layout/AdminRoot";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Leotech Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminRootFallback />}>
      <AdminRoot>{children}</AdminRoot>
    </Suspense>
  );
}
