"use server";

import { id as idSchema } from "@/lib/validation/common";
import { getAdminT } from "@/lib/i18n/admin";
import { action } from "@/server/http/action";
import { badRequest } from "@/server/http/errors";
import { createUser, updateUser } from "@/server/modules/users";

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : undefined;
};

export const createUserAction = action("users:manage", async ({ user, ip, formData }) => {
  const u = await createUser(user, { name: s(formData, "name"), email: s(formData, "email"), password: s(formData, "password"), role: s(formData, "role") }, { ip });
  return { message: (await getAdminT()).ok.added(u.name) };
});

export const updateUserAction = action("users:manage", async ({ user, ip, formData }) => {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) throw badRequest("Missing user id");
  const patch: Record<string, unknown> = {};
  if (formData.has("role")) patch.role = s(formData, "role");
  if (formData.has("isActive")) patch.isActive = formData.get("isActive") === "true";
  if (s(formData, "password")) patch.password = s(formData, "password");
  const u = await updateUser(user, id.data, patch, { ip });
  return { message: (await getAdminT()).ok.updated(u.name) };
});
