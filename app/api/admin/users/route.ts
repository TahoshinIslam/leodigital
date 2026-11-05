import { adminApi } from "@/server/http/api";
import { createUser, listUsers } from "@/server/modules/users";

export const GET = adminApi("users:read", {}, async ({ user }) => listUsers(user));

export const POST = adminApi("users:manage", {}, async ({ user, ip, json }) =>
  Response.json({ data: await createUser(user, await json(), { ip }) }, { status: 201 }),
);
