import AccessDenied from "@/components/admin/AccessDenied";
import { Card, EmptyState, PageHeader, Pill, type Tone } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import type { SessionUser } from "@/server/auth/session";
import * as audit from "@/server/repositories/audit.repository";

const tone = (action: string): Tone =>
  action.endsWith("delete") || action.endsWith("failed") ? "rose" : action.endsWith("publish") ? "em" : action.endsWith("unpublish") ? "amber" : action.startsWith("auth") ? "muted" : "brand";

export default async function ActivityView({ user }: { user: SessionUser }) {
  if (!can(user.role, "audit:read")) return <AccessDenied what="the activity log" />;
  const entries = await audit.recent(200);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="System" title="Activity log" subtitle="Every content change, sign-in and permission change, newest first." />
      <Card>
        {entries.length === 0 ? (
          <EmptyState title="Nothing logged yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="font-admin-mono text-[10.5px] tracking-[0.12em] text-a-t3 uppercase">
                  <th scope="col" className="px-5 py-3 font-medium">When</th>
                  <th scope="col" className="px-3 py-3 font-medium">Who</th>
                  <th scope="col" className="px-3 py-3 font-medium">Action</th>
                  <th scope="col" className="px-5 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t border-a-bd">
                    <td className="px-5 py-3 font-admin-mono text-[12px] whitespace-nowrap text-a-t2">
                      {new Date(e.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" })}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-a-t1">{e.userName ?? "—"}</td>
                    <td className="px-3 py-3"><Pill tone={tone(e.action)}>{e.action}</Pill></td>
                    <td className="px-5 py-3 text-[13px] text-a-t2">{e.summary}</td>
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
