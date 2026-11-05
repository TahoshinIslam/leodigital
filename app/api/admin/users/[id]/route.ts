import { adminApi, idParam } from "@/server/http/api";
import { updateUser } from "@/server/modules/users";

export const PATCH = adminApi("users:manage", {}, async ({ params, user, ip, json }) =>
  updateUser(user, idParam(params.id), await json(), { ip }),
);
