"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ActionState } from "@/lib/action-state";

/** Inline status line for an action result. Announced to screen readers. */
export default function FormFeedback({ state }: { state: ActionState }) {
  if (!state.at || !state.message) return <div aria-live="polite" />;
  return (
    <div
      key={state.at}
      role={state.ok ? "status" : "alert"}
      aria-live="polite"
      className={`flex animate-[a-rise_.25s_ease-out] items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-medium ${
        state.ok ? "border-a-em/25 bg-a-em/8 text-a-em" : "border-a-rose/25 bg-a-rose/8 text-a-rose"
      }`}
    >
      {state.ok ? <CheckCircle2 size={16} className="mt-px shrink-0" /> : <AlertCircle size={16} className="mt-px shrink-0" />}
      <span>{state.message}</span>
    </div>
  );
}
