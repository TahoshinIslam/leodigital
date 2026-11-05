"use client";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import FormFeedback from "@/components/admin/FormFeedback";
import { buttonClass, Field } from "@/components/admin/ui";
import { initialActionState } from "@/lib/action-state";
import { loginAction } from "@/server/actions/auth.actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);
  const [show, setShow] = useState(false);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormFeedback state={state} />
      <Field label="Email" htmlFor="email" error={fe.email}>
        <input id="email" name="email" type="email" autoComplete="username" required maxLength={190} className="a-input" aria-invalid={!!fe.email} aria-describedby={fe.email ? "email-error" : undefined} />
      </Field>
      <Field label="Password" htmlFor="password" error={fe.password}>
        <div className="relative">
          <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required maxLength={128} className="a-input pr-11" aria-invalid={!!fe.password} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-a-t3 hover:text-a-t1">
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} mt-2 h-11`}>
        <LogIn size={17} /> {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
