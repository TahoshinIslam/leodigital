import "server-only";
import { exec, sql, sqlOne } from "@/server/db/pool";
import type { Role } from "@/lib/auth/permissions";
import type { SafeUser } from "@/lib/types";

type Row = {
  id: number; name: string; email: string; password_hash: string; role: Role; is_active: boolean;
  last_login_at: Date | null; created_at: Date;
};

const toSafe = (r: Row): SafeUser => ({
  id: r.id, name: r.name, email: r.email, role: r.role, isActive: !!r.is_active,
  lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : null,
  createdAt: new Date(r.created_at).toISOString(),
});

/** Includes the hash — only the login flow may call this. */
export async function findForLogin(email: string) {
  const r = await sqlOne<Row>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return r ? { user: toSafe(r), passwordHash: r.password_hash } : null;
}

export async function findById(id: number): Promise<SafeUser | null> {
  const r = await sqlOne<Row>("SELECT * FROM users WHERE id = ?", [id]);
  return r ? toSafe(r) : null;
}

export async function list(): Promise<SafeUser[]> {
  const rows = await sql<Row>("SELECT * FROM users ORDER BY created_at ASC");
  return rows.map(toSafe);
}

export async function count(): Promise<{ total: number; active: number }> {
  const r = await sqlOne<{ total: number; active: number }>(
    "SELECT COUNT(*) AS total, COALESCE(SUM(is_active = 1), 0) AS active FROM users",
  );
  return { total: Number(r?.total ?? 0), active: Number(r?.active ?? 0) };
}

export async function countActiveSuperAdmins(): Promise<number> {
  const r = await sqlOne<{ n: number }>(
    "SELECT COUNT(*) AS n FROM users WHERE role = 'super_admin' AND is_active = 1",
  );
  return Number(r?.n ?? 0);
}

export async function insert(u: { name: string; email: string; passwordHash: string; role: Role }) {
  const res = await exec("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [
    u.name, u.email, u.passwordHash, u.role,
  ]);
  return res.insertId;
}

export async function update(
  id: number,
  patch: { name?: string; role?: Role; isActive?: boolean; passwordHash?: string },
) {
  const sets: string[] = [];
  const params: (string | number | boolean)[] = [];
  if (patch.name !== undefined) { sets.push("name = ?"); params.push(patch.name); }
  if (patch.role !== undefined) { sets.push("role = ?"); params.push(patch.role); }
  if (patch.isActive !== undefined) { sets.push("is_active = ?"); params.push(patch.isActive ? 1 : 0); }
  if (patch.passwordHash !== undefined) { sets.push("password_hash = ?"); params.push(patch.passwordHash); }
  if (!sets.length) return;
  await exec(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);
}

export async function touchLogin(id: number) {
  await exec("UPDATE users SET last_login_at = UTC_TIMESTAMP() WHERE id = ?", [id]);
}
