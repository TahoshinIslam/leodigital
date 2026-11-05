"use client";

import { useSyncExternalStore } from "react";

// One shared 1-second ticker for every clock on the page.
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

const store = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    if (!timer) {
      now = Date.now();
      timer = setInterval(() => {
        now = Date.now();
        listeners.forEach((l) => l());
      }, 1000);
    }
    return () => {
      listeners.delete(cb);
      if (!listeners.size && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };
  },
  get: () => now || Date.now(),
  // Server render shows a placeholder; the real time appears after hydration.
  server: () => 0,
};

export function useNow() {
  return useSyncExternalStore(store.subscribe, store.get, store.server);
}

export default function LiveClock({ timeZone }: { timeZone: string }) {
  const t = useNow();
  const d = t ? new Date(t) : null;
  const parts = d
    ? new Intl.DateTimeFormat("en-US", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).formatToParts(d)
    : [];
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "--";
  const tzName = d
    ? new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value
    : "";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 font-admin-mono text-[10.5px] tracking-[0.16em] text-white/60 uppercase">
        <span aria-hidden className="h-1.5 w-1.5 animate-[a-pulse_2s_ease-in-out_infinite] rounded-full bg-[#3ed598]" />
        Local time · {tzName || timeZone}
      </div>
      <time
        dateTime={d?.toISOString()}
        aria-live="off"
        className="flex items-baseline gap-1.5 font-admin-mono leading-none font-semibold text-white tabular-nums"
      >
        <span className="text-[clamp(36px,4.2vw,52px)] tracking-[-0.04em]">
          {get("hour")}
          <span className="animate-[a-pulse_1s_steps(1)_infinite] text-white/50">:</span>
          {get("minute")}
        </span>
        <span className="text-[18px] text-white/55">{get("second")}</span>
        <span className="ml-1 text-[13px] font-bold tracking-[0.08em] text-[#8fb0ff]">{d ? get("dayPeriod") : ""}</span>
      </time>
      <div className="text-[13px] text-white/70">
        {d ? new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d) : " "}
      </div>
    </div>
  );
}
