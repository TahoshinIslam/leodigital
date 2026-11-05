import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "../globals.css";
import AdminRoot, { AdminRootFallback } from "@/views/admin/layout/AdminRoot";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Leotech" },
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = { colorScheme: "light dark" };

/** Root layout for the admin panel (English only), separate from the public site's. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Suspense fallback={<AdminRootFallback />}>
          <AdminRoot>{children}</AdminRoot>
        </Suspense>
      </body>
    </html>
  );
}
