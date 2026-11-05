import { sqlOne } from "@/server/db/pool";
import { publicApi } from "@/server/http/api";

/** Liveness + DB connectivity. Reveals nothing beyond up/down. */
export const GET = publicApi({}, async () => {
  try {
    await sqlOne("SELECT 1 AS ok");
    return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "degraded" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
});
