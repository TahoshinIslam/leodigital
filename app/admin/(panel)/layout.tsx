import AdminShell from "@/views/admin/layout/AdminShell";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
