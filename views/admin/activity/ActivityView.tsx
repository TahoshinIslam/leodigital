import AccessDenied from "@/components/admin/AccessDenied";
import { Card, EmptyState, PageHeader, Pill, type Tone } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import { getAdminT } from "@/lib/i18n/admin";
import { auditAction, auditSummary } from "@/lib/i18n/admin/audit";
import type { SessionUser } from "@/server/auth/session";
import * as audit from "@/server/repositories/audit.repository";

const tone = (action: string): Tone =>
  action.endsWith("delete") || action.endsWith("failed") ? "rose" : action.endsWith("publish") ? "em" : action.endsWith("unpublish") ? "amber" : action.startsWith("auth") ? "muted" : "brand";

export default async function ActivityView({ user }: { user: SessionUser }) {
  const tr = await getAdminT();
  const A = tr.activity;
  if (!can(user.role, "audit:read")) return <AccessDenied what={A.access} />;
  const entries = await audit.recent(200);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow={tr.shell.system} title={A.title} subtitle={A.subtitle} />
      <Card>
        {entries.length === 0 ? (
          <EmptyState title={A.empty} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="font-admin-mono text-[10.5px] tracking-[0.12em] text-a-t3 uppercase">
                  <th scope="col" className="px-5 py-3 font-medium">{A.cols.when}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{A.cols.who}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{A.cols.action}</th>
                  <th scope="col" className="px-5 py-3 font-medium">{A.cols.details}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t border-a-bd">
                    <td className="px-5 py-3 font-admin-mono text-[12px] whitespace-nowrap text-a-t2">
                      {new Date(e.createdAt).toLocaleString(tr.locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" })}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-a-t1">{e.userName ?? "—"}</td>
                    <td className="px-3 py-3"><Pill tone={tone(e.action)}>{auditAction(e.action, tr)}</Pill></td>
                    <td className="px-5 py-3 text-[13px] text-a-t2">{auditSummary(e.summary, tr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
