import { LogOut, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import MobileNavToggle from "@/components/admin/MobileNavToggle";
import SidebarNav from "@/components/admin/SidebarNav";
import AdminLangToggle from "@/components/admin/AdminLangToggle";
import ThemeToggle from "@/components/admin/ThemeToggle";
import { getAdminT } from "@/lib/i18n/admin";
import { Avatar } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import { requirePageUser } from "@/server/auth/guard";
import { logoutAction } from "@/server/actions/auth.actions";
import * as services from "@/server/repositories/service.repository";

/**
 * Admin chrome: sidebar, top bar and content area. Verifies the session on
 * every request (the proxy redirect is only a shortcut).
 */
export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  const [counts, jar, t] = await Promise.all([services.counts(), cookies(), getAdminT()]);
  const s = t.shell;
  const theme = jar.get("admin_theme")?.value === "dark" ? "dark" : "light";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — static on desktop, drawer on mobile */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[264px] -translate-x-full flex-col border-r border-a-bd bg-a-bg2 transition-transform duration-300 lg:translate-x-0 [.admin-root[data-nav=open]_&]:translate-x-0">
        <div className="flex items-center gap-3 border-b border-a-bd px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--a-brand),var(--a-violet))] text-[17px] font-extrabold text-white shadow-[0_8px_20px_-8px_var(--a-brand)]">
            L
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold tracking-[-0.01em] text-a-t1">Leotech</div>
            <div className="truncate text-[11.5px] text-a-t3">{s.cms}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <SidebarNav role={user.role} drafts={counts.draft} />
        </div>

        {can(user.role, "services:create") ? (
          <div className="px-3 pb-3">
            <Link
              href="/admin/services/new"
              className="flex items-center gap-2.5 rounded-xl border border-a-bd bg-a-card2 px-3.5 py-3 text-[12.5px] text-a-t2 no-underline hover:text-a-t1"
            >
              <Sparkles size={16} className="text-a-violet" />
              <span>
                <strong className="block text-a-t1">{s.publishFaster}</strong>
                {s.draftNew}
              </span>
            </Link>
          </div>
        ) : null}

        <div className="flex items-center gap-3 border-t border-a-bd px-4 py-3.5">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-a-t1">{user.name}</div>
            <div className="truncate text-[11.5px] text-a-t3">{t.roles[user.role]}</div>
          </div>
          <form action={logoutAction}>
            <button type="submit" aria-label={s.signOut} title={s.signOut} className="flex h-9 w-9 items-center justify-center rounded-lg text-a-t3 hover:bg-a-card2 hover:text-a-rose">
              <LogOut size={17} />
            </button>
          </form>
        </div>
      </aside>

      {/* Drawer backdrop */}
      <div aria-hidden className="fixed inset-0 z-30 hidden bg-black/40 backdrop-blur-[2px] lg:hidden [.admin-root[data-nav=open]_&]:block" />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-a-bd bg-[color-mix(in_srgb,var(--a-bg)_82%,transparent)] px-4 py-3 backdrop-blur-xl sm:px-6">
          <MobileNavToggle />
          <form action="/admin/services" role="search" className="relative max-w-[440px] flex-1">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-a-t3" aria-hidden />
            <label htmlFor="admin-search" className="sr-only">{s.searchLabel}</label>
            <input
              id="admin-search"
              name="q"
              type="search"
              placeholder={s.search}
              maxLength={100}
              className="h-10 w-full rounded-xl border border-a-bd bg-a-card pr-3 pl-10 text-[13.5px] text-a-t1 placeholder:text-a-t3 focus:border-a-brand focus:shadow-[0_0_0_4px_var(--a-ring)] focus:outline-none"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-xl border border-a-bd bg-a-card px-3 py-2 text-[12.5px] text-a-t2 md:inline-flex">
              <span aria-hidden className="h-2 w-2 rounded-full bg-a-em shadow-[0_0_0_3px_color-mix(in_srgb,var(--a-em)_20%,transparent)]" />
              {counts.published} {s.live} · {counts.draft} {counts.draft === 1 ? s.draft : s.drafts}
            </span>
            <AdminLangToggle />
            <ThemeToggle initial={theme} />
          </div>
        </header>

        <main id="admin-main" className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
