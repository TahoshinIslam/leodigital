"use client";

import { Activity, ExternalLink, LayoutDashboard, Layers, PlusCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can, type Role } from "@/lib/auth/permissions";
import { useAdminT } from "@/lib/i18n/admin/client";

type Item = { href: string; label: string; icon: React.ReactNode; show: boolean; exact?: boolean; external?: boolean; badge?: number };

export default function SidebarNav({ role, drafts }: { role: Role; drafts: number }) {
  const pathname = usePathname();
  const t = useAdminT().shell;
  const ic = { size: 18, strokeWidth: 1.7 } as const;
  const groups: { title: string; items: Item[] }[] = [
    { title: t.overview, items: [{ href: "/admin", label: t.dashboard, icon: <LayoutDashboard {...ic} />, show: true, exact: true }] },
    {
      title: t.content,
      items: [
        { href: "/admin/services", label: t.services, icon: <Layers {...ic} />, show: can(role, "services:read"), badge: drafts || undefined },
        { href: "/admin/services/new", label: t.newService, icon: <PlusCircle {...ic} />, show: can(role, "services:create"), exact: true },
      ],
    },
    {
      title: t.system,
      items: [
        { href: "/admin/users", label: t.users, icon: <ShieldCheck {...ic} />, show: can(role, "users:read") },
        { href: "/admin/activity", label: t.activity, icon: <Activity {...ic} />, show: can(role, "audit:read") },
        { href: "/", label: t.viewSite, icon: <ExternalLink {...ic} />, show: true, external: true },
      ],
    },
  ];

  const isActive = (it: Item) =>
    !it.external && (it.exact ? pathname === it.href : pathname === it.href || (pathname.startsWith(`${it.href}/`) && pathname !== "/admin/services/new"));

  return (
    <nav aria-label="Admin" className="flex flex-col gap-5">
      {groups.map((g) => {
        const items = g.items.filter((i) => i.show);
        if (!items.length) return null;
        return (
          <div key={g.title}>
            <div className="px-3 pb-1.5 font-admin-mono text-[10.5px] tracking-[0.16em] text-a-t3 uppercase">{g.title}</div>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {items.map((it) => {
                const active = isActive(it);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      target={it.external ? "_blank" : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium no-underline transition-colors ${
                        active ? "bg-a-brand/10 font-semibold text-a-t1" : "text-a-t2 hover:bg-a-card2 hover:text-a-t1"
                      }`}
                    >
                      {active ? <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r bg-a-brand" /> : null}
                      <span className={active ? "text-a-brand" : ""}>{it.icon}</span>
                      <span className="flex-1">{it.label}</span>
                      {it.badge ? (
                        <span className="rounded-md bg-a-card2 px-1.5 py-0.5 font-admin-mono text-[10.5px] text-a-t2" title={`${it.badge} ${t.draftsBadge}`}>
                          {it.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
