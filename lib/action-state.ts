/** What every admin form action returns to `useActionState`. Shared by client and server. */
export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  /** Changes on every submit so the UI can react even to identical results. */
  at?: number;
};

export const initialActionState: ActionState = { ok: false };
