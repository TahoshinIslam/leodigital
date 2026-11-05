import { requestNow } from "@/server/time";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Lightbulb,
  PenSquare,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import Greeting from "@/components/admin/Greeting";
import LiveClock from "@/components/admin/LiveClock";
import MiniCalendar from "@/components/admin/MiniCalendar";
import { ButtonLink, Card, CardHeader, EmptyState, IconTile, StatusPill, relativeTime, type Tone } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import { getAdminT } from "@/lib/i18n/admin";
import { auditSummary } from "@/lib/i18n/admin/audit";
import type { SessionUser } from "@/server/auth/session";
import { getDashboard } from "@/server/modules/dashboard";
import { summary as vitalsSummary } from "@/server/modules/vitals";

const TZ = "Asia/Dhaka";

const ACTION_META: Record<string, { tone: Tone; icon: React.ReactNode }> = {
  "service.create": { tone: "brand", icon: <PlusCircle size={16} /> },
  "service.update": { tone: "violet", icon: <PenSquare size={16} /> },
  "service.publish": { tone: "em", icon: <Globe size={16} /> },
  "service.unpublish": { tone: "amber", icon: <FileText size={16} /> },
  "service.delete": { tone: "rose", icon: <FileText size={16} /> },
  "media.upload": { tone: "cyan", icon: <Layers size={16} /> },
  "user.create": { tone: "brand", icon: <Users size={16} /> },
  "user.update": { tone: "violet", icon: <ShieldCheck size={16} /> },
  "auth.login": { tone: "em", icon: <ShieldCheck size={16} /> },
  "auth.login_failed": { tone: "rose", icon: <ShieldCheck size={16} /> },
};

export default async function DashboardView({ user }: { user: SessionUser }) {
  const [data, tr] = await Promise.all([getDashboard(user), getAdminT()]);
  const D_ = tr.dashboard;
  const lang = tr.lang;
  const nf = (n: number) => n.toLocaleString(tr.locale);
  const now = requestNow();
  const firstName = user.name.split(" ")[0] ?? user.name;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", hour12: false }).formatToParts(now);
  const p = (t: string) => parts.find((x) => x.type === t)?.value ?? "";
  const today = `${p("year")}-${p("month")}-${p("day")}`;
  const serverHour = Number(p("hour")) % 24;

  const { services: svc } = data;
  const publishedPct = svc.total ? Math.round((svc.published / svc.total) * 100) : 0;
  const maxDay = Math.max(1, ...data.days.map((d) => d.n));
  const weekTotal = data.days.slice(-7).reduce((a, d) => a + d.n, 0);
  const prevWeek = data.days.slice(0, 7).reduce((a, d) => a + d.n, 0);
  const activeDays = data.days.filter((d) => d.n > 0).map((d) => d.day);

  const ins = D_.insights;
  const insight =
    svc.draft > 0
      ? { ...ins.drafts(svc.draft), href: "/admin/services?status=draft" }
      : data.gaps.missingSeo > 0
        ? { ...ins.seo(data.gaps.missingSeo), href: "/admin/services?status=published" }
        : data.gaps.missingImage > 0
          ? { ...ins.image(data.gaps.missingImage), href: "/admin/services?status=published" }
          : { ...ins.done, href: "/services" };

  const K = D_.kpi;
  const kpis: { label: string; value: string; sub: React.ReactNode; tone: Tone; icon: React.ReactNode; bar?: number }[] = [
    { label: K.total, value: nf(svc.total), sub: K.totalSub(svc.published), tone: "brand", icon: <Layers size={19} />, bar: publishedPct },
    { label: K.published, value: nf(svc.published), sub: K.publishedSub(publishedPct), tone: "em", icon: <Globe size={19} /> },
    { label: K.drafts, value: nf(svc.draft), sub: svc.draft ? K.needsReview : K.nothingPending, tone: svc.draft ? "amber" : "muted", icon: <FileText size={19} /> },
    {
      label: K.edits,
      value: nf(weekTotal),
      sub: <span className={weekTotal >= prevWeek ? "text-a-em" : "text-a-rose"}>{K.vsLast(Math.abs(weekTotal - prevWeek), weekTotal >= prevWeek)}</span>,
      tone: "violet",
      icon: <Activity size={19} />,
    },
    { label: K.team, value: nf(data.users.active), sub: K.teamSub(data.users.total, data.mediaCount), tone: "cyan", icon: <Users size={19} /> },
  ];

  const quick = [
    { href: "/admin/services/new", label: D_.quickItems.new, icon: <PlusCircle size={18} />, show: can(user.role, "services:create") },
    { href: "/admin/services", label: D_.quickItems.all, icon: <Layers size={18} />, show: can(user.role, "services:read") },
    { href: "/admin/services?status=draft", label: D_.quickItems.drafts, icon: <FileText size={18} />, show: can(user.role, "services:read") },
    { href: "/admin/users", label: D_.quickItems.users, icon: <ShieldCheck size={18} />, show: can(user.role, "users:read") },
    { href: "/admin/activity", label: D_.quickItems.activity, icon: <Activity size={18} />, show: can(user.role, "audit:read") },
    { href: "/", label: D_.quickItems.site, icon: <ExternalLink size={18} />, show: true },
  ].filter((q) => q.show);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Banner ─────────────────────────────────────────────── */}
      <section
        aria-label="Welcome"
        className="relative isolate overflow-hidden rounded-[24px] border border-white/10 bg-[#070b18] text-white shadow-[0_24px_60px_-28px_rgba(30,79,209,.55)]"
      >
        {/* Artwork */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_85%_at_8%_0%,rgba(91,140,255,.55),transparent_60%),radial-gradient(45%_70%_at_62%_110%,rgba(154,123,255,.45),transparent_60%),radial-gradient(35%_60%_at_95%_10%,rgba(69,224,232,.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(90deg,transparent,#000_30%,#000_70%,transparent)]" />
          <svg className="absolute right-[30%] bottom-0 h-[70%] w-[46%] opacity-60 max-lg:hidden" viewBox="0 0 400 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bn-line" x1="0" x2="1">
                <stop offset="0" stopColor="#45e0e8" stopOpacity="0" />
                <stop offset=".5" stopColor="#8fb0ff" />
                <stop offset="1" stopColor="#9a7bff" />
              </linearGradient>
              <linearGradient id="bn-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#5b8cff" stopOpacity=".35" />
                <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 140 C 40 130, 60 100, 100 108 S 160 70, 200 76 S 260 40, 300 46 S 360 12, 400 18 L400 160 L0 160Z" fill="url(#bn-fill)" />
            <path d="M0 140 C 40 130, 60 100, 100 108 S 160 70, 200 76 S 260 40, 300 46 S 360 12, 400 18" fill="none" stroke="url(#bn-line)" strokeWidth="2.5" />
          </svg>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,24,.92)_0%,rgba(7,11,24,.55)_45%,rgba(7,11,24,.25)_100%)]" />
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-semibold text-white/85 backdrop-blur">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#3ed598]" /> {D_.websiteLive(svc.published)}
              </span>
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-semibold text-white/85 backdrop-blur">
                {tr.roles[user.role]}
              </span>
            </div>
            <h1 className="m-0 text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-0.03em]">
              <Greeting name={firstName} timeZone={TZ} serverHour={serverHour} />
            </h1>
            <p className="m-0 max-w-[520px] text-[14.5px] leading-relaxed text-white/70">
              {D_.intro} {svc.draft ? D_.draftsWaiting(svc.draft) : D_.allPublished}
            </p>
            <div className="flex items-center gap-2 text-[13px] text-white/75">
              <CalendarDays size={16} aria-hidden />
              {new Intl.DateTimeFormat(tr.locale, { timeZone: TZ, weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(now)}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {can(user.role, "services:create") ? (
                <Link href="/admin/services/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#0b1020] no-underline hover:bg-white/90">
                  <PlusCircle size={16} /> {D_.newService}
                </Link>
              ) : null}
              <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline backdrop-blur hover:bg-white/14">
                <ExternalLink size={16} /> {D_.viewSite}
              </Link>
            </div>
          </div>

          {/* Clock + calendar */}
          <div className="grid gap-4 rounded-[20px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl sm:grid-cols-[auto_240px] sm:items-start">
            <div className="sm:min-w-[210px] sm:border-r sm:border-white/10 sm:pr-5">
              <LiveClock timeZone={TZ} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/[0.06] px-3 py-2">
                  <div className="font-admin-mono text-[10px] tracking-[0.12em] text-white/50 uppercase">{tr.time.edits14}</div>
                  <div className="text-[18px] font-bold">{nf(data.days.reduce((a, d) => a + d.n, 0))}</div>
                </div>
                <div className="rounded-xl bg-white/[0.06] px-3 py-2">
                  <div className="font-admin-mono text-[10px] tracking-[0.12em] text-white/50 uppercase">{tr.time.activeDays}</div>
                  <div className="text-[18px] font-bold">{nf(activeDays.length)}</div>
                </div>
              </div>
            </div>
            <MiniCalendar today={today} activeDays={activeDays} />
          </div>
        </div>
      </section>

      {/* ── KPIs ───────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} as="div" className="p-5">
            <div className="flex items-start justify-between gap-3">
              <IconTile tone={k.tone}>{k.icon}</IconTile>
            </div>
            <div className="mt-4 font-admin-mono text-[10.5px] tracking-[0.14em] text-a-t3 uppercase">{k.label}</div>
            <div className="mt-1 text-[30px] leading-none font-extrabold tracking-[-0.03em] text-a-t1 tabular-nums">{k.value}</div>
            {k.bar !== undefined ? (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-a-card2" role="progressbar" aria-valuenow={k.bar} aria-valuemin={0} aria-valuemax={100} aria-label={K.sharePublished}>
                <div className="h-full rounded-full bg-a-brand" style={{ width: `${k.bar}%` }} />
              </div>
            ) : null}
            <div className="mt-2.5 text-[12px] text-a-t2">{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* ── Core Web Vitals (field data, p75) ─────────────────── */}
      <Card>
        <CardHeader title={D_.vitals} subtitle={D_.vitalsSub} />
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-5">
          {vitalsSummary().map((v) => {
            const unit = v.name === "CLS" ? "" : "ms";
            const shown = v.p75 === null ? "—" : v.name === "CLS" ? (v.p75 / 1000).toFixed(2) : String(v.p75);
            const tone = v.rating === "good" ? "text-a-em" : v.rating === "poor" ? "text-a-rose" : v.rating ? "text-a-amber" : "text-a-t3";
            return (
              <div key={v.name} className="rounded-xl border border-a-bd bg-a-card2 px-4 py-3">
                <div className="font-admin-mono text-[10.5px] tracking-[0.14em] text-a-t3 uppercase">{v.name}</div>
                <div className={`mt-1 text-[22px] font-extrabold tabular-nums ${tone}`}>
                  {shown}
                  {v.p75 !== null && unit ? <span className="ml-0.5 text-[12px] font-semibold">{unit}</span> : null}
                </div>
                <div className="text-[11.5px] text-a-t3">{v.samples ? D_.samples(v.samples) : D_.noData}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Chart + insight + quick actions ────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_1fr]">
        <Card>
          <CardHeader title={D_.chart} subtitle={D_.chartSub} />
          <div className="px-5 pt-6 pb-5">
            <div className="flex h-[170px] items-end gap-[6px]" role="img" aria-label={D_.chartAria(data.days.map((d) => d.n).join(", "))}>
              {data.days.map((d) => {
                const isToday = d.day === today;
                return (
                  <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                    <div
                      className={`w-full rounded-t-md transition-colors ${isToday ? "bg-a-brand" : "bg-a-brand/35 group-hover:bg-a-brand/70"}`}
                      style={{ height: `${Math.max(4, (d.n / maxDay) * 100)}%` }}
                    />
                    <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-a-t1 px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-a-bg group-hover:block">
                      {d.n}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex gap-[6px]">
              {data.days.map((d, i) => (
                <div key={d.day} className="flex-1 text-center font-admin-mono text-[9.5px] text-a-t3">
                  {i % 2 === 1 ? new Date(`${d.day}T00:00:00Z`).toLocaleDateString(tr.locale, { day: "numeric", month: "short", timeZone: "UTC" }) : ""}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex flex-col rounded-[18px] border border-a-amber/25 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--a-amber)_12%,var(--a-card)),var(--a-card))] p-5 shadow-a">
          <div className="flex items-center gap-2 text-[13px] font-bold text-a-amber">
            <Lightbulb size={17} /> {D_.insight}
          </div>
          <p className="m-0 mt-4 text-[16px] leading-snug font-bold text-a-t1">{insight.title}</p>
          <p className="m-0 mt-2 flex-1 text-[13px] leading-relaxed text-a-t2">{insight.body}</p>
          <Link href={insight.href} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-a-amber px-4 py-2.5 text-[13.5px] font-bold text-white no-underline hover:opacity-90">
            {insight.cta} <ArrowRight size={16} />
          </Link>
        </div>

        <Card>
          <CardHeader title={D_.quick} />
          <div className="grid grid-cols-3 gap-2.5 p-5">
            {quick.map((q) => (
              <Link
                key={q.href + q.label}
                href={q.href}
                target={q.href === "/" ? "_blank" : undefined}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-a-bd bg-a-card2 p-2 text-center text-[11.5px] font-semibold text-a-t2 no-underline transition-all hover:-translate-y-0.5 hover:border-a-brand/40 hover:text-a-t1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-a-brand/10 text-a-brand">{q.icon}</span>
                {q.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Recently updated + activity ────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title={D_.recent}
            subtitle={D_.recentSub}
            action={<ButtonLink href="/admin/services" variant="ghost" small>{tr.common.viewAll} <ArrowRight size={14} /></ButtonLink>}
          />
          {data.latest.length ? (
            <ul className="m-0 mt-3 list-none p-0">
              {data.latest.map((s) => (
                <li key={s.id} className="flex items-center gap-4 border-t border-a-bd px-5 py-3.5">
                  <IconTile tone={s.status === "published" ? "em" : "amber"}><Layers size={17} /></IconTile>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/services/${s.id}`} className="block truncate text-[14px] font-bold text-a-t1 no-underline hover:text-a-brand">
                      {s.title}
                    </Link>
                    <div className="truncate font-admin-mono text-[11.5px] text-a-t3">/services/{s.slug}</div>
                  </div>
                  <StatusPill status={s.status} labels={tr.common} />
                  <span className="hidden w-28 text-right text-[12px] text-a-t3 sm:block">{relativeTime(s.updatedAt, now, lang)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={D_.noServices} action={<ButtonLink href="/admin/services/new" variant="primary">{D_.createFirst}</ButtonLink>} />
          )}
        </Card>

        <Card>
          <CardHeader
            title={D_.activityTitle}
            action={can(user.role, "audit:read") ? <ButtonLink href="/admin/activity" variant="ghost" small>{tr.common.viewAll} <ArrowRight size={14} /></ButtonLink> : undefined}
          />
          {data.activity.length ? (
            <ul className="m-0 mt-3 list-none px-5 pb-4">
              {data.activity.map((a) => {
                const meta = ACTION_META[a.action] ?? { tone: "muted" as Tone, icon: <Activity size={16} /> };
                return (
                  <li key={a.id} className="flex items-start gap-3 py-2.5">
                    <IconTile tone={meta.tone}>{meta.icon}</IconTile>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 truncate text-[13px] font-semibold text-a-t1">{auditSummary(a.summary, tr)}</p>
                      <p className="m-0 text-[11.5px] text-a-t3">{a.userName ?? tr.common.system}</p>
                    </div>
                    <span className="shrink-0 text-[11.5px] text-a-t3">{relativeTime(a.createdAt, now, lang)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title={can(user.role, "audit:read") ? D_.noActivity : D_.activityAdmins} />
          )}
        </Card>
      </div>
    </div>
  );
}
