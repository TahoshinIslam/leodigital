"use client";

import { useActionState } from "react";
import { buttonClass, type BtnVariant } from "@/components/admin/ui";
import { initialActionState, type ActionState } from "@/lib/action-state";
import { useAdminT } from "@/lib/i18n/admin/client";

/**
 * A one-button form bound to a Server Action (publish toggle, delete, role
 * change …). Works without JS as a normal form post; with JS it shows pending
 * state, an optional confirm prompt and the result message.
 */
export default function InlineAction({
  action,
  fields,
  label,
  pendingLabel,
  variant = "secondary",
  small = true,
  confirm,
  icon,
  title,
}: {
  action: (s: ActionState, fd: FormData) => Promise<ActionState>;
  fields: Record<string, string | number>;
  label: string;
  pendingLabel?: string;
  variant?: BtnVariant;
  small?: boolean;
  confirm?: string;
  icon?: React.ReactNode;
  title?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const working = useAdminT().common.working;
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className="inline-flex items-center gap-2"
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={String(v)} />
      ))}
      <button type="submit" disabled={pending} title={title ?? label} className={buttonClass(variant, small)}>
        {icon}
        <span>{pending ? (pendingLabel ?? working) : label}</span>
      </button>
      {state.at && !state.ok && state.message ? (
        <span role="alert" className="text-[12px] font-medium text-a-rose">{state.message}</span>
      ) : null}
    </form>
  );
}
