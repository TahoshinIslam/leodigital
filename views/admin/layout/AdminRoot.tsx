import { cookies } from "next/headers";
import { adminFontVars } from "@/lib/fonts/admin";

/** Themed wrapper for every /admin page. Reads the theme cookie, so it renders per request. */
export default async function AdminRoot({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get("admin_theme")?.value === "dark" ? "dark" : "light";
  return (
    <div className={`admin-root ${adminFontVars} min-h-screen antialiased`} data-theme={theme}>
      {children}
    </div>
  );
}

export function AdminRootFallback() {
  return <div className={`admin-root ${adminFontVars} min-h-screen`} />;
}
