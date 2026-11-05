import { z } from "zod";
import { publicApi } from "@/server/http/api";
import { badRequest } from "@/server/http/errors";
import { record } from "@/server/modules/vitals";
import { LIMITS } from "@/server/security/rate-limit";
import { isSameOrigin } from "@/server/security/request";

const metric = z.object({
  name: z.enum(["LCP", "INP", "CLS", "FCP", "TTFB", "FID"]),
  value: z.number().finite().min(0).max(600_000),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  id: z.string().max(80),
  path: z.string().max(300).regex(/^\/[^\s]*$/),
  nav: z.string().max(40).optional(),
});

/** Receives Core Web Vitals beacons from the public site. */
export const POST = publicApi({ rateLimit: { limit: LIMITS.publicApi, key: "ip" }, maxBodyBytes: 2048 }, async ({ req, json }) => {
  if (!isSameOrigin(req)) return new Response(null, { status: 204 });
  const parsed = metric.safeParse(await json());
  if (!parsed.success) throw badRequest("Invalid metric");
  record(parsed.data);
  return new Response(null, { status: 204 });
});
