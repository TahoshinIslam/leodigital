"use server";

import { cookies } from "next/headers";

/** Persist the admin colour theme so the server renders it without a flash. */
export async function setAdminTheme(theme: "light" | "dark") {
  if (theme !== "light" && theme !== "dark") return;
  (await cookies()).set("admin_theme", theme, { path: "/admin", sameSite: "lax", httpOnly: true, maxAge: 60 * 60 * 24 * 365 });
}
