import { ShieldAlert } from "lucide-react";
import { ButtonLink, Card } from "@/components/admin/ui";

export default function AccessDenied({ what = "this page" }: { what?: string }) {
  return (
    <Card className="mx-auto mt-10 max-w-lg p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-a-rose/10 text-a-rose">
        <ShieldAlert size={22} />
      </span>
      <h1 className="m-0 mt-4 text-[20px] font-extrabold text-a-t1">You don&rsquo;t have access to {what}</h1>
      <p className="m-0 mt-2 text-[13.5px] text-a-t2">Ask a super admin to change your role if you need it.</p>
      <div className="mt-6"><ButtonLink href="/admin" variant="secondary">Back to dashboard</ButtonLink></div>
    </Card>
  );
}
