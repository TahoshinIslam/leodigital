import "server-only";
import { ROLE_RANK, type Role } from "@/lib/auth/permissions";
import type { SafeUser } from "@/lib/types";
import { fieldErrors } from "@/lib/validation/common";
import { createUserInput, updateUserInput } from "@/lib/validation/user";
import { assertCan } from "@/server/auth/guard";
import { hashPassword } from "@/server/auth/password";
import type { SessionUser } from "@/server/auth/session";
import { isDuplicateKey } from "@/server/db/pool";
import { badRequest, conflict, forbidden, notFound, validationError } from "@/server/http/errors";
import * as audit from "@/server/repositories/audit.repository";
import * as sessions from "@/server/repositories/session.repository";
import * as users from "@/server/repositories/user.repository";

type Actor = Pick<SessionUser, "id" | "role">;
type Ctx = { ip?: string | null };

export async function listUsers(actor: Actor): Promise<SafeUser[]> {
  assertCan(actor, "users:read");
  return users.list();
}

export async function createUser(actor: Actor, raw: unknown, ctx: Ctx = {}): Promise<SafeUser> {
  assertCan(actor, "users:manage");
  const r = createUserInput.safeParse(raw);
  if (!r.success) throw validationError(fieldErrors(r.error));
  const { name, email, password, role } = r.data;
  try {
    const id = await users.insert({ name, email, role, passwordHash: await hashPassword(password) });
    await audit.insert({ userId: actor.id, action: "user.create", entityType: "user", entityId: id, summary: `Added ${name} as ${role}`, ip: ctx.ip });
    return (await users.findById(id))!;
  } catch (err) {
    if (isDuplicateKey(err)) throw conflict("A user with that email already exists", { email: ["Already in use"] });
    throw err;
  }
}

export async function updateUser(actor: Actor, id: number, raw: unknown, ctx: Ctx = {}): Promise<SafeUser> {
  assertCan(actor, "users:manage");
  const r = updateUserInput.safeParse(raw);
  if (!r.success) throw validationError(fieldErrors(r.error));
  const patch = r.data;
  const target = await users.findById(id);
  if (!target) throw notFound("User not found");

  if (ROLE_RANK[target.role] > ROLE_RANK[actor.role as Role]) throw forbidden("You cannot change a user above your role");
  if (id === actor.id && (patch.role && patch.role !== target.role || patch.isActive === false)) {
    throw badRequest("You cannot change your own role or deactivate yourself");
  }
  // Never leave the system without an active super admin.
  const losesSuper = target.role === "super_admin" && ((patch.role && patch.role !== "super_admin") || patch.isActive === false);
  if (losesSuper && (await users.countActiveSuperAdmins()) <= 1) throw badRequest("At least one active super admin is required");

  await users.update(id, {
    name: patch.name,
    role: patch.role,
    isActive: patch.isActive,
    passwordHash: patch.password ? await hashPassword(patch.password) : undefined,
  });
  // Role, status or password change → sign the user out everywhere.
  if (patch.role || patch.isActive === false || patch.password) await sessions.removeAllForUser(id);
  await audit.insert({
    userId: actor.id, action: "user.update", entityType: "user", entityId: id,
    summary: `Updated ${target.name}${patch.role ? ` → ${patch.role}` : ""}${patch.isActive === false ? " (deactivated)" : patch.isActive ? " (activated)" : ""}`,
    ip: ctx.ip,
  });
  return (await users.findById(id))!;
}
