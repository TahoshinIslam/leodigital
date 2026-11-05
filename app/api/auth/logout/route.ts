import { forbidden } from "@/server/http/errors";
import { publicApi } from "@/server/http/api";
import { logout } from "@/server/modules/auth";
import { isSameOrigin } from "@/server/security/request";

export const POST = publicApi({}, async ({ req, ip }) => {
  if (!isSameOrigin(req)) throw forbidden("Cross-site request blocked");
  await logout({ ip });
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
});
