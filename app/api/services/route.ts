import { isLocale } from "@/lib/i18n/config";
import { publicApi, preflight } from "@/server/http/api";
import { getPublishedServices } from "@/server/modules/services";
import { LIMITS } from "@/server/security/rate-limit";

/** Public, CORS-enabled list of published services. */
export const GET = publicApi({ cors: true, rateLimit: { limit: LIMITS.publicApi, key: "ip" } }, async ({ req }) => {
  // ?lang=bn for the Bangla text (falls back to English per field).
  const lang = req.nextUrl.searchParams.get("lang");
  const items = await getPublishedServices(isLocale(lang) ? lang : "en");
  return Response.json(
    { data: items.map((item) => ({ ...item, status: undefined })) },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400", Vary: "Origin" } },
  );
});

export const OPTIONS = preflight;
