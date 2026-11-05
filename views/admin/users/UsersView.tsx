import { requestNow } from "@/server/time";
import { Check, Minus, UserCheck, UserX } from "lucide-react";
import AccessDenied from "@/components/admin/AccessDenied";
import InlineAction from "@/components/admin/InlineAction";
import { Avatar, Card, CardHeader, PageHeader, Pill, relativeTime, type Tone } from "@/components/admin/ui";
import { can, PERMISSIONS, ROLE_PERMISSIONS, ROLE_RANK, ROLES, type Role } from "@/lib/auth/permissions";
import { getAdminT } from "@/lib/i18n/admin";
import { updateUserAction } from "@/server/actions/users.actions";
import type { SessionUser } from "@/server/auth/session";
import { listUsers } from "@/server/modules/users";
import NewUserForm from "@/views/admin/users/NewUserForm";
import RoleSelect from "@/views/admin/users/RoleSelect";

const ROLE_TONE: Record<Role, Tone> = { super_admin: "violet", admin: "brand", editor: "cyan", viewer: "muted" };

export default async function UsersView({ user }: { user: SessionUser }) {
  const tr = await getAdminT();
  const U = tr.users;
  if (!can(user.role, "users:read")) return <AccessDenied what={U.access} />;
  const users = await listUsers(user);
  const manage = can(user.role, "users:manage");
  const now = requestNow();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow={tr.shell.system} title={U.title} subtitle={U.subtitle} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title={U.team} subtitle={U.accounts(users.length)} />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="font-admin-mono text-[10.5px] tracking-[0.12em] text-a-t3 uppercase">
                  <th scope="col" className="px-5 py-3 font-medium">{U.cols.user}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{U.cols.role}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{U.cols.status}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{U.cols.last}</th>
                  {manage ? <th scope="col" className="px-5 py-3 text-right font-medium">{U.cols.actions}</th> : null}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const self = u.id === user.id;
                  const editable = manage && !self && ROLE_RANK[u.role] <= ROLE_RANK[user.role];
                  return (
                    <tr key={u.id} className="border-t border-a-bd">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size={34} />
                          <div className="min-w-0">
                            <div className="truncate text-[13.5px] font-bold text-a-t1">{u.name}{self ? <span className="ml-1.5 text-[11px] font-medium text-a-t3">{tr.common.you}</span> : null}</div>
                            <div className="truncate text-[12px] text-a-t3">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        {editable ? <RoleSelect id={u.id} role={u.role} maxRole={user.role} /> : <Pill tone={ROLE_TONE[u.role]}>{tr.roles[u.role]}</Pill>}
                      </td>
                      <td className="px-3 py-3.5">{u.isActive ? <Pill tone="em" dot>{tr.common.active}</Pill> : <Pill tone="rose" dot>{tr.common.disabled}</Pill>}</td>
                      <td className="px-3 py-3.5 text-[12.5px] text-a-t2">{u.lastLoginAt ? relativeTime(u.lastLoginAt, now, tr.lang) : tr.common.never}</td>
                      {manage ? (
                        <td className="px-5 py-3.5 text-right">
                          {editable ? (
                            <InlineAction
                              action={updateUserAction}
                              fields={{ id: u.id, isActive: u.isActive ? "false" : "true" }}
                              label={u.isActive ? U.disable : U.enable}
                              variant={u.isActive ? "ghost" : "secondary"}
                              icon={u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                              confirm={u.isActive ? U.confirmDisable(u.name) : undefined}
                            />
                          ) : null}
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {manage ? (
          <Card>
            <CardHeader title={U.add} subtitle={U.addSub} />
            <div className="p-5">
              <NewUserForm maxRole={user.role} />
            </div>
          </Card>
        ) : null}
      </div>

      <Card>
        <CardHeader title={U.matrix} subtitle={U.matrixSub} />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="px-5 py-3 font-admin-mono text-[10.5px] font-medium tracking-[0.12em] text-a-t3 uppercase">{U.permission}</th>
                {ROLES.map((r) => (
                  <th key={r} scope="col" className="px-3 py-3 text-center">
                    <Pill tone={ROLE_TONE[r]}>{tr.roles[r]}</Pill>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p} className="border-t border-a-bd">
                  <td className="px-5 py-2.5 font-admin-mono text-[12.5px] text-a-t1">{p}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="px-3 py-2.5 text-center">
                      {ROLE_PERMISSIONS[r].has(p) ? (
                        <Check size={16} className="mx-auto text-a-em" aria-label={U.allowed} />
                      ) : (
                        <Minus size={16} className="mx-auto text-a-t3" aria-label={U.notAllowed} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-a-bd">
                <td className="px-5 py-3 text-[12px] text-a-t3">{U.summary}</td>
                {ROLES.map((r) => (
                  <td key={r} className="px-3 py-3 text-center text-[11.5px] leading-snug text-a-t2">{tr.roleDescriptions[r]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
