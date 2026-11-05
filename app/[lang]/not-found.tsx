import Link from "next/link";
import { getContent } from "@/content";
import { localePath } from "@/lib/i18n/config";

export default async function NotFound() {
  const { ui, locale } = await getContent();
  const t = ui.notFound;
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{t.code}</span>
      <h1 className="m-0 text-[clamp(40px,6vw,80px)] leading-none font-medium tracking-[-0.04em]">{t.title}</h1>
      <p className="m-0 max-w-[460px] font-body text-white/65">{t.body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href={localePath(locale, "/")} className="rounded-full bg-accent px-6 py-3 font-body font-bold text-ink no-underline">{t.home}</Link>
        <Link href={localePath(locale, "/services")} className="rounded-full border border-white/20 px-6 py-3 font-body font-semibold text-white no-underline">{t.services}</Link>
      </div>
    </div>
  );
}
