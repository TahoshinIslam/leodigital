import { badRequest, tooLarge } from "@/server/http/errors";
import { adminApi } from "@/server/http/api";
import { env } from "@/server/env";
import { saveImage } from "@/server/storage/uploads";

/** multipart/form-data with a single `file` field. */
export const POST = adminApi("media:upload", {}, async ({ req, user, ip }) => {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > env().UPLOAD_MAX_MB * 1024 * 1024 + 64 * 1024) throw tooLarge(`Images must be ${env().UPLOAD_MAX_MB} MB or smaller`);
  if (!req.headers.get("content-type")?.includes("multipart/form-data")) throw badRequest("Send multipart/form-data");
  const form = await req.formData();
  const file = form.get("file");
  const saved = await saveImage(user, file instanceof File ? file : null, { ip });
  return Response.json({ data: saved }, { status: 201 });
});
