import "server-only";
import { connection, type NextRequest } from "next/server";
import type { Permission } from "@/lib/auth/permissions";
import { assertCan } from "@/server/auth/guard";
import { getSessionUser, type SessionUser } from "@/server/auth/session";
import { env } from "@/server/env";
import { AppError, badRequest, forbidden, tooLarge, unauthenticated } from "@/server/http/errors";
import { toErrorBody } from "@/server/http/report";
import { enforce, LIMITS, type Limit } from "@/server/security/rate-limit";
import { clientIpFrom, isSameOrigin } from "@/server/security/request";

/**
 * Wraps every Route Handler so that cross-cutting concerns live in one place:
 *
 *   - centralized exception handling → `{ error: { code, message, details? } }`
 *   - authentication + RBAC permission check
 *   - CSRF origin check on cookie-authenticated writes
 *   - rate limiting
 *   - CORS for routes that opt in (public read API only)
 *   - JSON body parsing with a size cap
 *   - `Cache-Control: no-store` on anything authenticated
 */
type RouteCtx = { params: Promise<Record<string, string | string[] | undefined>> };

type Args<U> = {
  req: NextRequest;
  params: Record<string, string>;
  user: U;
  ip: string;
  json: () => Promise<unknown>;
};

type Options = {
  /** Allow cross-origin reads from CORS_ALLOWED_ORIGINS (public routes only). */
  cors?: boolean;
  rateLimit?: { limit: Limit; key: "ip" | "user" };
  maxBodyBytes?: number;
};

const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin")?.replace(/\/$/, "");
  const allowed = env().CORS_ALLOWED_ORIGINS;
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

/** OPTIONS handler for CORS-enabled routes. */
export function preflight(req: Request) {
  const h = corsHeaders(req);
  return new Response(null, { status: h["Access-Control-Allow-Origin"] ? 204 : 403, headers: h });
}

/** Unauthenticated route (public JSON API). */
export function publicApi(options: Options, handler: (a: Args<null>) => Promise<Response | unknown>) {
  return build(undefined, options, handler as (a: Args<SessionUser | null>) => Promise<Response | unknown>);
}

/** Signed-in route that requires `permission`. */
export function adminApi(
  permission: Permission,
  options: Options,
  handler: (a: Args<SessionUser>) => Promise<Response | unknown>,
) {
  return build(permission, options, handler as (a: Args<SessionUser | null>) => Promise<Response | unknown>);
}

function build(
  permission: Permission | undefined,
  options: Options,
  handler: (a: Args<SessionUser | null>) => Promise<Response | unknown>,
) {
  return async (req: NextRequest, ctx: RouteCtx): Promise<Response> => {
    // Always run at request time — never prerender an API response at build.
    // Outside the try: during a build Next uses this rejection as a signal.
    await connection();
    const extra: Record<string, string> = options.cors ? corsHeaders(req) : {};
    try {
      const ip = clientIpFrom(req.headers);
      let user: SessionUser | null = null;

      if (permission) {
        if (UNSAFE.has(req.method) && !isSameOrigin(req)) throw forbidden("Cross-site request blocked");
        user = await getSessionUser();
        if (!user) throw unauthenticated();
        assertCan(user, permission);
      }

      if (options.rateLimit) {
        const who = options.rateLimit.key === "user" && user ? `u${user.id}` : ip;
        const r = enforce(`api:${req.method}:${req.nextUrl.pathname}:${who}`, options.rateLimit.limit);
        extra["X-RateLimit-Remaining"] = String(r.remaining);
      } else if (UNSAFE.has(req.method) && user) {
        enforce(`api-write:u${user.id}`, LIMITS.adminWrite);
      }

      const rawParams = await ctx.params;
      const params = Object.fromEntries(
        Object.entries(rawParams ?? {}).map(([k, v]) => [k, Array.isArray(v) ? v.join("/") : (v ?? "")]),
      );

      const max = options.maxBodyBytes ?? 256 * 1024;
      const json = async () => {
        const type = req.headers.get("content-type") ?? "";
        if (!type.includes("application/json")) throw new AppError("UNSUPPORTED_MEDIA_TYPE", 415, "Send JSON with Content-Type: application/json");
        const len = Number(req.headers.get("content-length") ?? 0);
        if (len > max) throw tooLarge("Request body is too large");
        const text = await req.text();
        if (text.length > max) throw tooLarge("Request body is too large");
        try {
          return JSON.parse(text);
        } catch {
          throw badRequest("Request body is not valid JSON");
        }
      };

      const out = await handler({ req, params, user, ip, json });
      const res = out instanceof Response ? out : Response.json({ data: out ?? null });
      for (const [k, v] of Object.entries(extra)) res.headers.set(k, v);
      if (permission) res.headers.set("Cache-Control", "private, no-store");
      return res;
    } catch (err) {
      const { status, body, headers } = toErrorBody(err);
      return Response.json(body, {
        status,
        headers: { ...extra, ...(headers ?? {}), "Cache-Control": "no-store" },
      });
    }
  };
}

/** Parse a numeric `[id]` route param or throw 404. */
export function idParam(v: string | undefined): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new AppError("NOT_FOUND", 404, "Not found");
  return n;
}
