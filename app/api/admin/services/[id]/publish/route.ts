import { adminApi, idParam } from "@/server/http/api";
import { setPublished } from "@/server/modules/services";

/** POST { "published": true | false } */
export const POST = adminApi("services:publish", {}, async ({ params, user, ip, json }) =>
  setPublished(user, idParam(params.id), await json(), { ip }),
);
