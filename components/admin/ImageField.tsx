"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useAdminT } from "@/lib/i18n/admin/client";

/**
 * Upload an image to /api/admin/uploads (validated server-side by magic bytes)
 * and store the resulting /media URL in a hidden input. An https URL can also
 * be pasted instead.
 */
export default function ImageField({ name, defaultValue, label, aspect = "aspect-[16/9]" }: { name: string; defaultValue: string | null; label: string; aspect?: string }) {
  const T = useAdminT().image;
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/uploads", { method: "POST", body: fd, credentials: "same-origin" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? T.failed);
      setUrl(json.data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : T.failed);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const isLocal = url.startsWith("/media/");

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={url} />
      <div className={`relative overflow-hidden rounded-xl border border-dashed border-a-bd2 bg-a-card2 ${aspect}`}>
        {url ? (
          <>
            {isLocal ? (
              <Image src={url} alt="" fill sizes="360px" className="object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URL preview
              <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <button type="button" onClick={() => setUrl("")} aria-label={T.remove(label)} className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
              <X size={16} />
            </button>
          </>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[12.5px] font-semibold text-a-t2 hover:text-a-brand">
            {busy ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
            {busy ? T.uploading : T.upload(label)}
            <span className="font-normal text-a-t3">{T.types}</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        aria-label={T.choose(label)}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
      <div className="flex gap-2">
        <input
          type="url"
          value={isLocal ? "" : url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={isLocal ? T.uploaded : T.paste}
          aria-label={T.url(label)}
          className="a-input !py-2 text-[12.5px]"
        />
        {url ? (
          <button type="button" onClick={() => fileRef.current?.click()} className="shrink-0 rounded-xl border border-a-bd2 px-3 text-[12px] font-semibold text-a-t2 hover:text-a-t1">
            {T.replace}
          </button>
        ) : null}
      </div>
      {error ? <p role="alert" className="m-0 text-[12px] font-medium text-a-rose">{error}</p> : null}
    </div>
  );
}
