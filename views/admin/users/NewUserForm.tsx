"use client";

import { UserPlus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import FormFeedback from "@/components/admin/FormFeedback";
import { buttonClass, Field } from "@/components/admin/ui";
import { initialActionState } from "@/lib/action-state";
import { ROLE_RANK, ROLES, type Role } from "@/lib/auth/permissions";
import { useAdminT } from "@/lib/i18n/admin/client";
import { createUserAction } from "@/server/actions/users.actions";

export default function NewUserForm({ maxRole }: { maxRole: Role }) {
  const tr = useAdminT();
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
      <Field label={tr.users.name} htmlFor="nu-name" error={fe.name}>
        <input id="nu-name" name="name" required maxLength={120} className="a-input" autoComplete="off" />
      </Field>
      <Field label={tr.users.email} htmlFor="nu-email" error={fe.email}>
        <input id="nu-email" name="email" type="email" required maxLength={190} className="a-input" autoComplete="off" />
      </Field>
      <Field label={tr.users.tempPass} htmlFor="nu-password" error={fe.password} hint={tr.users.passHint}>
        <input id="nu-password" name="password" type="password" required minLength={12} maxLength={128} className="a-input" autoComplete="new-password" />
      </Field>
      <Field label={tr.users.role} htmlFor="nu-role" error={fe.role}>
        <select id="nu-role" name="role" defaultValue="editor" className="a-input">
          {ROLES.filter((r) => ROLE_RANK[r] <= ROLE_RANK[maxRole]).map((r) => (
            <option key={r} value={r}>{tr.roles[r]}</option>
          ))}
        </select>
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} mt-1`}>
        <UserPlus size={16} /> {pending ? tr.users.adding : tr.users.addBtn}
      </button>
    </form>
  );
}
