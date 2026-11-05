"use client";

import { useNow } from "@/components/admin/LiveClock";

/** "Good morning/afternoon/evening" in the admin's time zone, updating live. */
export default function Greeting({ name, timeZone, serverHour }: { name: string; timeZone: string; serverHour: number }) {
  const t = useNow();
  const hour = t ? Number(new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hour12: false }).format(t)) % 24 : serverHour;
  const part = hour < 5 ? "Good evening" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <>
      {part},{" "}
      <span className="bg-[linear-gradient(90deg,#8fb0ff,#45e0e8)] bg-clip-text text-transparent">{name}</span>
    </>
  );
}
