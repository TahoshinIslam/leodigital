import { slug as slugSchema } from "@/lib/validation/common";
import { notFound } from "@/server/http/errors";
import { publicApi, preflight } from "@/server/http/api";
import { getPublishedService } from "@/server/modules/services";
import { LIMITS } from "@/server/security/rate-limit";

export const GET = publicApi({ cors: true, rateLimit: { limit: LIMITS.publicApi, key: "ip" } }, async ({ params }) => {
  const parsed = slugSchema.safeParse(params.slug);
  if (!parsed.success) throw notFound("Service not found");
  const s = await getPublishedService(parsed.data);
  if (!s) throw notFound("Service not found");
  // Internal fields stay internal.
  const { status, updatedByName, ...rest } = s;
  void status;
  void updatedByName;
  return Response.json(
    { data: rest },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400" } },
  );
});

export const OPTIONS = preflight;
