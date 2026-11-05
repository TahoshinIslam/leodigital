import { z } from "zod";

/** Strip ASCII control characters (keeps \n and \t) and trim. */
export const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

/** Single-line text: control chars and newlines removed, whitespace collapsed. */
export const line = (max: number, min = 0) =>
  z
    .string()
    .transform((s) => clean(s).replace(/\s+/g, " "))
    .pipe(min > 0 ? z.string().min(min, `Must be at least ${min} characters`).max(max, `Must be at most ${max} characters`) : z.string().max(max, `Must be at most ${max} characters`));

export const optionalLine = (max: number) =>
  line(max).transform((s) => (s === "" ? null : s)).nullable().optional();

/** Multi-line text such as Markdown. Newlines kept. */
export const text = (max: number) =>
  z.string().transform(clean).pipe(z.string().max(max, `Must be at most ${max} characters`));

export const slug = z
  .string()
  .transform((s) => clean(s).toLowerCase())
  .pipe(
    z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only"),
  );

/** Images are either our own uploads (/media/…) or an absolute https URL. */
export const imageUrl = z
  .string()
  .transform(clean)
  .pipe(
    z
      .string()
      .max(500)
      .refine((v) => v === "" || /^\/media\/[A-Za-z0-9._-]+$/.test(v) || /^https:\/\/[^\s"'<>]+$/.test(v), {
        message: "Use an uploaded image or an https:// URL",
      }),
  )
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const httpsUrl = z
  .string()
  .transform(clean)
  .pipe(z.string().max(500).refine((v) => v === "" || /^https?:\/\/[^\s"'<>]+$/.test(v), "Must be a full URL"))
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const id = z.coerce.number().int().positive();

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

/** Flatten a ZodError into { field: [messages] } for forms and API responses. */
export function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_form";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
