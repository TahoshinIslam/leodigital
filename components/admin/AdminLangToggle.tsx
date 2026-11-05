"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAdminT } from "@/lib/i18n/admin/client";
import { setAdminLang } from "@/server/actions/ui.actions";

/** EN | বাং switch for the admin interface. */
export default function AdminLangToggle() {
  const t = useAdminT();
  const router = useRouter();
  const [pending, start] = useTransition();
  const set = (l: "en" | "bn") =>
    start(async () => {
      await setAdminLang(l);
      router.refresh();
    });
  return (
    <div role="group" aria-label={t.shell.language} className={`flex h-10 items-center gap-0.5 rounded-xl border border-a-bd bg-a-card p-1 ${pending ? "opacity-60" : ""}`}>
      <Languages size={16} className="mx-1.5 text-a-t3" aria-hidden />
      {(["en", "bn"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          aria-pressed={t.lang === l}
          lang={l}
          className={`rounded-lg px-2.5 py-1 text-[12.5px] font-semibold ${t.lang === l ? "bg-a-brand text-white" : "text-a-t2 hover:text-a-t1"}`}
        >
          {l === "en" ? "EN" : "বাংলা"}
        </button>
      ))}
    </div>
  );
}
