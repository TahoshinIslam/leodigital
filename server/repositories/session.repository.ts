import "server-only";
import { exec, sqlOne } from "@/server/db/pool";
import type { Role } from "@/lib/auth/permissions";

export type SessionUserRow = {
  session_id: string; expires_at: Date;
  id: number; name: string; email: string; role: Role; is_active: boolean;
};

export async function create(s: { idHash: string; userId: number; expiresAt: Date; ip: string | null; userAgent: string | null }) {
  await exec(
    "INSERT INTO sessions (id, user_id, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    [s.idHash, s.userId, s.expiresAt, s.ip, s.userAgent?.slice(0, 255) ?? null],
  );
}

/** Valid session + active user in one round trip. */
export async function findValid(idHash: string): Promise<SessionUserRow | null> {
  return sqlOne<SessionUserRow>(
    `SELECT s.id AS session_id, s.expires_at, u.id, u.name, u.email, u.role, u.is_active
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > UTC_TIMESTAMP() AND u.is_active = 1`,
    [idHash],
  );
}

export async function remove(idHash: string) {
  await exec("DELETE FROM sessions WHERE id = ?", [idHash]);
}

export async function removeAllForUser(userId: number) {
  await exec("DELETE FROM sessions WHERE user_id = ?", [userId]);
}

export async function purgeExpired() {
  await exec("DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()");
}
