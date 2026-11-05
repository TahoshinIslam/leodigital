import { readImage } from "@/server/storage/uploads";

/**
 * Serves admin-uploaded images. Filenames are random UUIDs, so the content at a
 * URL never changes and can be cached forever. `nosniff` + a locked-down CSP
 * stop a crafted file from ever being interpreted as HTML or script.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const img = await readImage(file);
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.mime,
      "Content-Length": String(img.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
