import { adminApi, idParam } from "@/server/http/api";
import { deleteService, getService, updateService } from "@/server/modules/services";

export const GET = adminApi("services:read", {}, async ({ params, user }) => getService(user, idParam(params.id)));

export const PATCH = adminApi("services:update", {}, async ({ params, user, ip, json }) =>
  updateService(user, idParam(params.id), await json(), { ip }),
);

export const DELETE = adminApi("services:delete", {}, async ({ params, user, ip }) => {
  await deleteService(user, idParam(params.id), { ip });
  return new Response(null, { status: 204 });
});
