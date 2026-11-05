import { publicApi, preflight } from "@/server/http/api";
import { getPublishedServices } from "@/server/modules/services";
import { LIMITS } from "@/server/security/rate-limit";

/** Public, CORS-enabled list of published services. */
export const GET = publicApi({ cors: true, rateLimit: { limit: LIMITS.publicApi, key: "ip" } }, async () => {
  const items = await getPublishedServices();
  return Response.json(
    { data: items.map((item) => ({ ...item, status: undefined })) },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400" } },
  );
});

export const OPTIONS = preflight;
