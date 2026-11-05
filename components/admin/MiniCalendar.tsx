"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

/**
 * Month calendar for the dashboard banner. Today is highlighted; days with
 * content activity get a dot. Keyboard and screen-reader friendly grid.
 */
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function MiniCalendar({ today, activeDays }: { today: string; activeDays: string[] }) {
  const [ty, tm, td] = today.split("-").map(Number);
  const [view, setView] = useState({ y: ty, m: tm - 1 });
  const active = new Set(activeDays);

  const first = new Date(Date.UTC(view.y, view.m, 1));
  const daysInMonth = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const label = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const shift = (delta: number) =>
    setView((v) => {
      const d = new Date(Date.UTC(v.y, v.m + delta, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });
  const isCurrentMonth = view.y === ty && view.m === tm - 1;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="w-full">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="text-[13.5px] font-bold text-white" aria-live="polite">{label}</div>
        <div className="flex items-center gap-1">
          {!isCurrentMonth ? (
            <button type="button" onClick={() => setView({ y: ty, m: tm - 1 })} className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#8fb0ff] hover:bg-white/10">
              Today
            </button>
          ) : null}
          <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/75 hover:bg-white/10 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/75 hover:bg-white/10 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <table className="w-full table-fixed border-collapse text-center" aria-label={label}>
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} scope="col" className="pb-1.5 font-admin-mono text-[10px] font-medium tracking-[0.08em] text-white/45 uppercase">{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <tr key={r}>
              {cells.slice(r * 7, r * 7 + 7).map((d, c) => {
                if (!d) return <td key={c} />;
                const iso = `${view.y}-${pad(view.m + 1)}-${pad(d)}`;
                const isToday = isCurrentMonth && d === td;
                const has = active.has(iso);
                return (
                  <td key={c} className="p-0.5">
                    <span
                      aria-current={isToday ? "date" : undefined}
                      title={has ? "Content activity" : undefined}
                      className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-[12px] tabular-nums ${
                        isToday ? "bg-[#5b8cff] font-bold text-white shadow-[0_4px_14px_-2px_rgba(91,140,255,.8)]" : c >= 5 ? "text-white/50" : "text-white/85"
                      }`}
                    >
                      {d}
                      {has && !isToday ? <span aria-hidden className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#3ed598]" /> : null}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
