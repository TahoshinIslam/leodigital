import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertCan } from "@/server/auth/guard";
import type { SessionUser } from "@/server/auth/session";
import { env } from "@/server/env";
import { badRequest, tooLarge, unsupportedMedia } from "@/server/http/errors";
import * as audit from "@/server/repositories/audit.repository";
import * as media from "@/server/repositories/media.repository";
import { enforce, LIMITS } from "@/server/security/rate-limit";

/**
 * Image uploads. The file type is decided from the file's magic bytes, never
 * from its name or the browser-supplied MIME type. SVG is refused (it can carry
 * script). Files get a random name and live outside /public, served by
 * app/media/[file]/route.ts.
 */
const SIGNATURES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP" },
  { mime: "image/avif", ext: "avif", test: (b) => b.subarray(4, 12).toString("latin1") === "ftypavif" },
];

export const MIME_BY_EXT: Record<string, string> = Object.fromEntries(SIGNATURES.map((s) => [s.ext, s.mime]));
export const SAFE_FILENAME = /^[a-f0-9-]{36}\.(jpg|png|webp|avif)$/;

export function uploadDir() {
  // Runtime-configured directory; excluded from build-time file tracing.
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), env().UPLOAD_DIR);
}

export async function saveImage(actor: Pick<SessionUser, "id" | "role">, file: File | null, ctx: { ip?: string | null } = {}) {
  assertCan(actor, "media:upload");
  enforce(`upload:${actor.id}`, LIMITS.upload);
  if (!file || typeof file === "string" || file.size === 0) throw badRequest("Choose an image to upload");
  const max = env().UPLOAD_MAX_MB * 1024 * 1024;
  if (file.size > max) throw tooLarge(`Images must be ${env().UPLOAD_MAX_MB} MB or smaller`);

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = SIGNATURES.find((s) => s.test(buf));
  if (!kind) throw unsupportedMedia("Use a JPEG, PNG, WebP or AVIF image");

  const filename = `${randomUUID()}.${kind.ext}`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ dir, filename), buf, { flag: "wx" });
  await media.insert({ filename, originalName: file.name || filename, mimeType: kind.mime, sizeBytes: buf.length, uploadedBy: actor.id });
  await audit.insert({ userId: actor.id, action: "media.upload", entityType: "media", entityId: filename, summary: `Uploaded ${file.name || "an image"}`, ip: ctx.ip });
  return { url: `/media/${filename}`, filename, mimeType: kind.mime, size: buf.length };
}

export async function readImage(filename: string): Promise<{ data: Buffer; mime: string } | null> {
  if (!SAFE_FILENAME.test(filename)) return null; // blocks ../ and anything unexpected
  try {
    const data = await readFile(path.join(/*turbopackIgnore: true*/ uploadDir(), filename));
    return { data, mime: MIME_BY_EXT[filename.split(".").pop()!] };
  } catch {
    return null;
  }
}
