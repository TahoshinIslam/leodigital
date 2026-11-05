import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/auth/cookie";

/**
 * Optimistic gate for the admin area: no session cookie → straight to the login
 * page, without rendering anything. This is a UX shortcut only; every admin
 * page, Server Action and API route still verifies the session and the RBAC
 * permission on the server (see server/auth/guard.ts).
 */

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const hasSession = req.cookies.has(sessionCookieName());

  if (pathname.startsWith("/admin") && !isLogin && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
