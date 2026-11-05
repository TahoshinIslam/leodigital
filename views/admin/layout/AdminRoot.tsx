import { cookies } from "next/headers";
import { adminFontVars } from "@/lib/fonts/admin";
import { hindSiliguri } from "@/lib/fonts/site";
import { AdminLangProvider } from "@/lib/i18n/admin/client";

/** Themed, localised wrapper for every /admin page. Reads the theme and language cookies, so it renders per request. */
export default async function AdminRoot({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const theme = jar.get("admin_theme")?.value === "dark" ? "dark" : "light";
  const lang = jar.get("admin_lang")?.value === "bn" ? "bn" : "en";
  return (
    <div lang={lang} className={`admin-root ${adminFontVars} ${hindSiliguri.variable} min-h-screen antialiased`} data-theme={theme}>
      <AdminLangProvider lang={lang}>{children}</AdminLangProvider>
    </div>
  );
}

export function AdminRootFallback() {
  return <div className={`admin-root ${adminFontVars} min-h-screen`} />;
}
