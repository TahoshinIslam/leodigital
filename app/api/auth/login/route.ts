import { forbidden } from "@/server/http/errors";
import { publicApi } from "@/server/http/api";
import { login } from "@/server/modules/auth";
import { isSameOrigin } from "@/server/security/request";

/** JSON login for API clients on the same origin. Sets the session cookie. */
export const POST = publicApi({}, async ({ req, ip, json }) => {
  if (!isSameOrigin(req)) throw forbidden("Cross-site request blocked");
  const user = await login(await json(), { ip, userAgent: req.headers.get("user-agent") });
  return Response.json({ data: { id: user.id, name: user.name, role: user.role } }, { headers: { "Cache-Control": "no-store" } });
});
