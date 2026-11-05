import "server-only";
import { z } from "zod";

/**
 * Server-only configuration, validated once at first use. Nothing here is
 * ever sent to the browser — only NEXT_PUBLIC_* variables are, and the only
 * one this app defines is the public site URL.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

  DB_HOST: z.string().min(1).default("127.0.0.1"),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().regex(/^[A-Za-z0-9_]+$/),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(100).default(10),

  SESSION_TTL_HOURS: z.coerce.number().positive().max(24 * 30).default(12),

  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("")
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim().replace(/\/$/, ""))
        .filter(Boolean),
    ),

  UPLOAD_DIR: z.string().default("./storage/uploads"),
  UPLOAD_MAX_MB: z.coerce.number().positive().max(50).default(5),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    // Names only — never echo values, they may be secrets.
    const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Invalid or missing environment variables: ${keys}. See .env.example.`);
  }
  cached = parsed.data;
  return cached;
}

export const isProd = () => env().NODE_ENV === "production";
