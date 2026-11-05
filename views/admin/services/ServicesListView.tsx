import { requestNow } from "@/server/time";
import { Eye, Globe, PenSquare, PlusCircle, Trash2, EyeOff, Search } from "lucide-react";
import Link from "next/link";
import AccessDenied from "@/components/admin/AccessDenied";
import InlineAction from "@/components/admin/InlineAction";
import { ButtonLink, Card, EmptyState, PageHeader, StatusPill, relativeTime } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import { getAdminT } from "@/lib/i18n/admin";
import { listQuery } from "@/lib/validation/service";
import { deleteServiceAction, togglePublishAction } from "@/server/actions/services.actions";
import type { SessionUser } from "@/server/auth/session";
import { listServices } from "@/server/modules/services";
import { translatedLocales } from "@/server/repositories/service.repository";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ServicesListView({ user, searchParams }: { user: SessionUser; searchParams: SP }) {
  const tr = await getAdminT();
  const T = tr.services;
  if (!can(user.role, "services:read")) return <AccessDenied what={T.accessServices} />;

  const parsed = listQuery.safeParse({ q: first(searchParams.q), status: first(searchParams.status) || undefined, page: first(searchParams.page) });
  const query = parsed.success ? parsed.data : { page: 1, perPage: 20 };
  const [result, translated] = await Promise.all([listServices(user, query), translatedLocales()]);
  const pages = Math.max(1, Math.ceil(result.total / result.perPage));
  const now = requestNow();
  const canPublish = can(user.role, "services:publish");
  const canDelete = can(user.role, "services:delete");

  const tab = (label: string, status?: string) => {
    const active = (query as { status?: string }).status === status;
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if ((query as { q?: string }).q) params.set("q", (query as { q?: string }).q!);
    return (
      <Link
        key={label}
        href={`/admin/services${params.size ? `?${params}` : ""}`}
        aria-current={active ? "page" : undefined}
        className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold no-underline ${active ? "bg-a-card text-a-t1 shadow-a" : "text-a-t2 hover:text-a-t1"}`}
      >
        {label}
      </Link>
    );
  };

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    const q = query as { q?: string; status?: string };
    if (q.status) params.set("status", q.status);
    if (q.q) params.set("q", q.q);
    params.set("page", String(p));
    return `/admin/services?${params}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={tr.shell.content}
        title={T.title}
        subtitle={T.subtitle}
        actions={can(user.role, "services:create") ? <ButtonLink href="/admin/services/new" variant="primary"><PlusCircle size={16} /> {T.new}</ButtonLink> : undefined}
      />

      {searchParams.deleted ? (
        <div role="status" className="rounded-xl border border-a-em/25 bg-a-em/8 px-4 py-3 text-[13px] font-medium text-a-em">{T.deleted}</div>
      ) : null}

      <Card>
        <div className="flex flex-col gap-3 border-b border-a-bd p-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={T.filter} className="flex w-fit gap-1 rounded-xl bg-a-card2 p-1">
            {tab(T.all)}
            {tab(T.published, "published")}
            {tab(T.drafts, "draft")}
          </nav>
          <form className="relative w-full sm:w-72" role="search">
            {(query as { status?: string }).status ? <input type="hidden" name="status" value={(query as { status?: string }).status} /> : null}
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-a-t3" aria-hidden />
            <label htmlFor="svc-q" className="sr-only">{T.search}</label>
            <input id="svc-q" name="q" type="search" defaultValue={(query as { q?: string }).q ?? ""} placeholder={T.search} maxLength={100} className="a-input !py-2 pl-9" />
          </form>
        </div>

        {result.items.length === 0 ? (
          <EmptyState title={T.none} action={can(user.role, "services:create") ? <ButtonLink href="/admin/services/new" variant="primary">{T.new}</ButtonLink> : undefined}>
            {T.noneHint}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="font-admin-mono text-[10.5px] tracking-[0.12em] text-a-t3 uppercase">
                  <th scope="col" className="px-5 py-3 font-medium">{T.cols.service}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{T.cols.status}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{T.cols.order}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{T.cols.updated}</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">{T.cols.actions}</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((s) => (
                  <tr key={s.id} className="border-t border-a-bd align-middle hover:bg-a-card2/60">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/services/${s.id}`} className="text-[14px] font-bold text-a-t1 no-underline hover:text-a-brand">{s.title}</Link>
                      <div className="flex items-center gap-2 font-admin-mono text-[11.5px] text-a-t3">
                        /services/{s.slug}
                        {translated.get(s.id)?.includes("bn") ? (
                          <Link href={`/admin/services/${s.id}/bn`} lang="bn" title={T.bnDone} className="rounded bg-a-violet/10 px-1.5 py-px font-admin text-[10.5px] font-semibold text-a-violet no-underline">বাংলা ✓</Link>
                        ) : (
                          <Link href={`/admin/services/${s.id}/bn`} title={T.bnAdd} className="rounded bg-a-card2 px-1.5 py-px font-admin text-[10.5px] font-semibold text-a-t3 no-underline hover:text-a-violet">+ বাংলা</Link>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5"><StatusPill status={s.status} labels={tr.common} /></td>
                    <td className="px-3 py-3.5 font-admin-mono text-[12.5px] text-a-t2">{s.sortOrder}</td>
                    <td className="px-3 py-3.5 text-[12.5px] text-a-t2">{relativeTime(s.updatedAt, now, tr.lang)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {s.status === "published" ? (
                          <ButtonLink href={`/services/${s.slug}`} target="_blank" variant="ghost" small aria-label={T.view(s.title)}><Eye size={15} /></ButtonLink>
                        ) : null}
                        <ButtonLink href={`/admin/services/${s.id}`} variant="secondary" small><PenSquare size={14} /> {tr.common.edit}</ButtonLink>
                        {canPublish ? (
                          <InlineAction
                            action={togglePublishAction}
                            fields={{ id: s.id, published: s.status === "published" ? "false" : "true" }}
                            label={s.status === "published" ? T.unpublish : T.publish}
                            pendingLabel={tr.common.saving}
                            variant={s.status === "published" ? "ghost" : "primary"}
                            icon={s.status === "published" ? <EyeOff size={14} /> : <Globe size={14} />}
                          />
                        ) : null}
                        {canDelete ? (
                          <InlineAction
                            action={deleteServiceAction}
                            fields={{ id: s.id }}
                            label=""
                            title={T.deleteTitle(s.title)}
                            pendingLabel="…"
                            variant="danger"
                            icon={<Trash2 size={14} />}
                            confirm={T.confirmDelete(s.title)}
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <nav aria-label="Pagination" className="flex items-center justify-between border-t border-a-bd px-5 py-3 text-[12.5px] text-a-t2">
            <span>{T.page(result.page, pages, result.total)}</span>
            <div className="flex gap-1.5">
              {result.page > 1 ? <ButtonLink href={pageHref(result.page - 1)} small>{tr.common.previous}</ButtonLink> : null}
              {result.page < pages ? <ButtonLink href={pageHref(result.page + 1)} small>{tr.common.next}</ButtonLink> : null}
            </div>
          </nav>
        ) : null}
      </Card>
    </div>
  );
}
