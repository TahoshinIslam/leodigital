import { adminApi } from "@/server/http/api";
import { createService, listServices } from "@/server/modules/services";

export const GET = adminApi("services:read", {}, async ({ req, user }) =>
  listServices(user, Object.fromEntries(req.nextUrl.searchParams)),
);

export const POST = adminApi("services:create", {}, async ({ user, ip, json }) => {
  const service = await createService(user, await json(), { ip });
  return Response.json({ data: service }, { status: 201, headers: { Location: `/api/admin/services/${service.id}` } });
});
