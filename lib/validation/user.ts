import { z } from "zod";
import { ROLES } from "@/lib/auth/permissions";
import { line } from "@/lib/validation/common";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address").max(190));
export const password = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(128, "Use at most 128 characters")
  .refine((p) => /[a-zA-Z]/.test(p) && /[0-9\W_]/.test(p), "Mix letters with numbers or symbols");

export const loginInput = z.object({
  email,
  password: z.string().min(1, "Enter your password").max(128),
});

export const createUserInput = z.object({
  name: line(120, 2),
  email,
  password,
  role: z.enum(ROLES),
});

export const updateUserInput = z
  .object({
    name: line(120, 2),
    role: z.enum(ROLES),
    isActive: z.boolean(),
    password: password.optional(),
  })
  .partial()
  .strict();
