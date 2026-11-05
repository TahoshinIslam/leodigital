import { ShieldAlert } from "lucide-react";
import { ButtonLink, Card } from "@/components/admin/ui";
import { getAdminT } from "@/lib/i18n/admin";

export default async function AccessDenied({ what }: { what: string }) {
  const t = (await getAdminT()).common;
  return (
    <Card className="mx-auto mt-10 max-w-lg p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-a-rose/10 text-a-rose">
        <ShieldAlert size={22} />
      </span>
      <h1 className="m-0 mt-4 text-[20px] font-extrabold text-a-t1">{t.noAccess(what)}</h1>
      <p className="m-0 mt-2 text-[13.5px] text-a-t2">{t.askSuper}</p>
      <div className="mt-6"><ButtonLink href="/admin" variant="secondary">{t.backDashboard}</ButtonLink></div>
    </Card>
  );
}
