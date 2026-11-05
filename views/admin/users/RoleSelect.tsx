"use client";

import { useActionState, useRef } from "react";
import { initialActionState } from "@/lib/action-state";
import { ROLE_LABELS, ROLE_RANK, ROLES, type Role } from "@/lib/auth/permissions";
import { updateUserAction } from "@/server/actions/users.actions";

/** Change a user's role; submits on change. Only roles up to the actor's own are offered. */
export default function RoleSelect({ id, role, maxRole }: { id: number; role: Role; maxRole: Role }) {
  const [state, action, pending] = useActionState(updateUserAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`role-${id}`} className="sr-only">Role</label>
      <select
        id={`role-${id}`}
        name="role"
        defaultValue={role}
        disabled={pending}
        onChange={() => formRef.current?.requestSubmit()}
        className="a-input !w-auto !py-1.5 !text-[12.5px] font-semibold"
      >
        {ROLES.filter((r) => ROLE_RANK[r] <= ROLE_RANK[maxRole]).map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      {state.at && !state.ok ? <span role="alert" className="text-[11.5px] text-a-rose">{state.message}</span> : null}
    </form>
  );
}
