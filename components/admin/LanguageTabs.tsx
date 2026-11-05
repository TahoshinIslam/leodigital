import Link from "next/link";
import { getAdminT } from "@/lib/i18n/admin";

/** English / বাংলা tabs on the service editor. */
export default async function LanguageTabs({ id, active }: { id: number; active: "en" | "bn" }) {
  const label = (await getAdminT()).translate.tabs;
  const tab = (href: string, label: React.ReactNode, on: boolean) => (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold no-underline ${on ? "bg-a-card text-a-t1 shadow-a" : "text-a-t2 hover:text-a-t1"}`}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label={label} className="flex w-fit gap-1 rounded-xl bg-a-card2 p-1">
      {tab(`/admin/services/${id}`, "English", active === "en")}
      {tab(`/admin/services/${id}/bn`, <span lang="bn">বাংলা</span>, active === "bn")}
    </nav>
  );
}
