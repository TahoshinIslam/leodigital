"use client";

import { UserPlus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import FormFeedback from "@/components/admin/FormFeedback";
import { buttonClass, Field } from "@/components/admin/ui";
import { initialActionState } from "@/lib/action-state";
import { ROLE_LABELS, ROLE_RANK, ROLES, type Role } from "@/lib/auth/permissions";
import { createUserAction } from "@/server/actions/users.actions";

export default function NewUserForm({ maxRole }: { maxRole: Role }) {
  const [state, action, pending] = useActionState(createUserAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const fe = state.fieldErrors ?? {};

  // Clear the form after a successful add.
  useEffect(() => {
    if (state.ok && state.at) formRef.current?.reset();
  }, [state.ok, state.at]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3.5" noValidate>
      <FormFeedback state={state} />
      <Field label="Full name" htmlFor="nu-name" error={fe.name}>
        <input id="nu-name" name="name" required maxLength={120} className="a-input" autoComplete="off" />
      </Field>
      <Field label="Email" htmlFor="nu-email" error={fe.email}>
        <input id="nu-email" name="email" type="email" required maxLength={190} className="a-input" autoComplete="off" />
      </Field>
      <Field label="Temporary password" htmlFor="nu-password" error={fe.password} hint="12+ characters, letters with numbers or symbols.">
        <input id="nu-password" name="password" type="password" required minLength={12} maxLength={128} className="a-input" autoComplete="new-password" />
      </Field>
      <Field label="Role" htmlFor="nu-role" error={fe.role}>
        <select id="nu-role" name="role" defaultValue="editor" className="a-input">
          {ROLES.filter((r) => ROLE_RANK[r] <= ROLE_RANK[maxRole]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} mt-1`}>
        <UserPlus size={16} /> {pending ? "Adding…" : "Add user"}
      </button>
    </form>
  );
}
