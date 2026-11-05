import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Small server-safe building blocks for admin pages. */

export function Card({ children, className = "", as: Tag = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" | "article" }) {
  return <Tag className={`min-w-0 rounded-[18px] border border-a-bd bg-a-card shadow-a ${className}`}>{children}</Tag>;
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div>
        <h2 className="m-0 text-[15.5px] font-bold tracking-[-0.01em] text-a-t1">{title}</h2>
        {subtitle ? <p className="m-0 mt-0.5 text-[12.5px] text-a-t3">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <div className="mb-1.5 font-admin-mono text-[11px] tracking-[0.12em] text-a-t3 uppercase">{eyebrow}</div> : null}
        <h1 className="m-0 text-[26px] leading-tight font-extrabold tracking-[-0.025em] text-a-t1">{title}</h1>
        {subtitle ? <p className="m-0 mt-1 text-[13.5px] text-a-t2">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-xl text-[13.5px] font-semibold no-underline transition-all disabled:cursor-not-allowed disabled:opacity-55 cursor-pointer",
  primary: "bg-a-brand px-4 py-2.5 text-white shadow-[0_6px_18px_-6px_var(--a-brand)] hover:bg-a-brand2",
  secondary: "border border-a-bd2 bg-a-card px-4 py-2.5 text-a-t1 hover:bg-a-card2",
  ghost: "px-3 py-2 text-a-t2 hover:bg-a-card2 hover:text-a-t1",
  danger: "border border-a-rose/30 bg-a-rose/8 px-4 py-2.5 text-a-rose hover:bg-a-rose/14",
  sm: "!px-3 !py-1.5 !text-[12.5px] !rounded-lg",
};
export type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
export const buttonClass = (v: BtnVariant = "secondary", small = false) => `${btn.base} ${btn[v]} ${small ? btn.sm : ""}`;

export function ButtonLink({ variant = "secondary", small, className = "", ...props }: ComponentProps<typeof Link> & { variant?: BtnVariant; small?: boolean }) {
  return <Link {...props} className={`${buttonClass(variant, small)} ${className}`} />;
}

const tones = {
  brand: "bg-a-brand/10 text-a-brand",
  em: "bg-a-em/12 text-a-em",
  amber: "bg-a-amber/14 text-a-amber",
  rose: "bg-a-rose/12 text-a-rose",
  violet: "bg-a-violet/12 text-a-violet",
  cyan: "bg-a-cyan/12 text-a-cyan",
  muted: "bg-a-card2 text-a-t2",
};
export type Tone = keyof typeof tones;

export function Pill({ tone = "muted", children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap ${tones[tone]}`}>
      {dot ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: "draft" | "published" }) {
  return status === "published" ? <Pill tone="em" dot>Published</Pill> : <Pill tone="amber" dot>Draft</Pill>;
}

export function IconTile({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{children}</span>;
}

export function Field({ label, htmlFor, hint, error, children, counter }: { label: string; htmlFor: string; hint?: ReactNode; error?: string[]; children: ReactNode; counter?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[12.5px] font-semibold text-a-t1">{label}</label>
        {counter}
      </div>
      {children}
      {error?.length ? (
        <p id={`${htmlFor}-error`} role="alert" className="m-0 text-[12px] font-medium text-a-rose">{error[0]}</p>
      ) : hint ? (
        <p className="m-0 text-[12px] text-a-t3">{hint}</p>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <p className="m-0 text-[15px] font-bold text-a-t1">{title}</p>
      {children ? <p className="m-0 max-w-sm text-[13px] text-a-t2">{children}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--a-em),var(--a-cyan))] font-bold text-white"
    >
      {initials(name)}
    </span>
  );
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
export function relativeTime(iso: string, now: number) {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
