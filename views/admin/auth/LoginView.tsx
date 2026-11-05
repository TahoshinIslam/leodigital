import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import LoginForm from "@/views/admin/auth/LoginForm";
import AdminLangToggle from "@/components/admin/AdminLangToggle";
import { getAdminT } from "@/lib/i18n/admin";

export default async function LoginView({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSessionUser()) redirect("/admin");
  const { next } = await searchParams;
  const L = (await getAdminT()).login;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-[#06080e] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_25%_25%,rgba(91,140,255,.45),transparent_60%),radial-gradient(50%_50%_at_80%_75%,rgba(154,123,255,.35),transparent_60%),radial-gradient(40%_40%_at_60%_30%,rgba(69,224,232,.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(70%_70%_at_50%_50%,#000,transparent)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#5b8cff,#9a7bff)] font-extrabold">L</span>
            <span className="text-[16px] font-extrabold">Leotech CMS</span>
          </div>
          <div>
            <h1 className="m-0 max-w-[520px] text-[44px] leading-[1.05] font-extrabold tracking-[-0.03em]">
              {L.heroTitle} <span className="bg-[linear-gradient(90deg,#8fb0ff,#45e0e8)] bg-clip-text text-transparent">{L.heroAccent}</span>
            </h1>
            <p className="mt-4 max-w-[440px] text-[15px] text-white/65">
              {L.heroBody}
            </p>
          </div>
          <p className="m-0 font-admin-mono text-[11px] tracking-[0.14em] text-white/40 uppercase">{L.staff}</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--a-brand),var(--a-violet))] font-extrabold text-white">L</span>
          </div>
          <div className="mb-6 flex justify-end"><AdminLangToggle /></div>
          <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.025em] text-a-t1">{L.welcome}</h2>
          <p className="m-0 mt-1.5 text-[14px] text-a-t2">{L.sub}</p>
          <LoginForm next={next ?? ""} />
        </div>
      </div>
    </div>
  );
}
