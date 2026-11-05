import "server-only";
import { exec, sqlOne } from "@/server/db/pool";

export async function insert(m: { filename: string; originalName: string; mimeType: string; sizeBytes: number; uploadedBy: number }) {
  const res = await exec(
    "INSERT INTO media (filename, original_name, mime_type, size_bytes, uploaded_by) VALUES (?, ?, ?, ?, ?)",
    [m.filename, m.originalName.slice(0, 255), m.mimeType, m.sizeBytes, m.uploadedBy],
  );
  return res.insertId;
}

export async function findByFilename(filename: string) {
  return sqlOne<{ filename: string; mime_type: string; size_bytes: number }>(
    "SELECT filename, mime_type, size_bytes FROM media WHERE filename = ?",
    [filename],
  );
}

export async function count(): Promise<number> {
  const r = await sqlOne<{ n: number }>("SELECT COUNT(*) AS n FROM media");
  return Number(r?.n ?? 0);
}
