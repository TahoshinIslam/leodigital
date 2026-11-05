import "server-only";
import { assertCan } from "@/server/auth/guard";
import type { SessionUser } from "@/server/auth/session";
import * as audit from "@/server/repositories/audit.repository";
import * as media from "@/server/repositories/media.repository";
import * as services from "@/server/repositories/service.repository";
import * as users from "@/server/repositories/user.repository";
import { can } from "@/lib/auth/permissions";

export async function getDashboard(actor: Pick<SessionUser, "role">) {
  assertCan(actor, "dashboard:view");
  const [svc, usr, mediaCount, activity, perDay, latest, gaps] = await Promise.all([
    services.counts(),
    users.count(),
    media.count(),
    can(actor.role, "audit:read") ? audit.recent(8) : Promise.resolve([]),
    services.updatesPerDay(14),
    services.list({ page: 1, perPage: 5, sort: "recent" }),
    services.contentGaps(),
  ]);

  // Fill gaps so the chart always shows 14 consecutive days.
  const byDay = new Map(perDay.map((d) => [d.day, d.n]));
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400_000).toISOString().slice(0, 10);
    return { day: d, n: byDay.get(d) ?? 0 };
  });

  return { services: svc, users: usr, mediaCount, activity, days, latest: latest.items, gaps };
}
