import "server-only";
import type { PoolConnection } from "mysql2/promise";
import { exec, sql } from "@/server/db/pool";
import type { AuditEntry } from "@/lib/types";

export async function insert(
  e: { userId: number | null; action: string; entityType: string; entityId?: string | number | null; summary: string; ip?: string | null },
  db?: PoolConnection,
) {
  await exec(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, summary, ip) VALUES (?, ?, ?, ?, ?, ?)",
    [e.userId, e.action, e.entityType, e.entityId == null ? null : String(e.entityId), e.summary.slice(0, 255), e.ip ?? null],
    db,
  );
}

export async function recent(limit: number): Promise<AuditEntry[]> {
  const rows = await sql<{
    id: number; action: string; entity_type: string; entity_id: string | null; summary: string;
    user_name: string | null; created_at: Date;
  }>(
    `SELECT a.id, a.action, a.entity_type, a.entity_id, a.summary, u.name AS user_name, a.created_at
     FROM audit_logs a LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC, a.id DESC LIMIT ?`,
    [String(limit)],
  );
  return rows.map((r) => ({
    id: Number(r.id), action: r.action, entityType: r.entity_type, entityId: r.entity_id, summary: r.summary,
    userName: r.user_name, createdAt: new Date(r.created_at).toISOString(),
  }));
}
