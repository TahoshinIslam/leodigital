import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/auth/cookie";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n/config";

/**
 * Two jobs:
 *
 * 1. Public site locales. Pages live under app/[lang]. English keeps clean,
 *    unprefixed URLs (rewritten internally to /en/…); Bangla is served at
 *    /bn/…. A literal /en/… URL redirects to its unprefixed twin so each page
 *    has one canonical address. On a first visit with no saved choice, a
 *    browser that prefers Bangla is sent to the /bn version.
 *
 * 2. Admin. No session cookie → straight to the login page. This is a UX
 *    shortcut only; every admin page, Server Action and API route still
 *    verifies the session and the RBAC permission on the server.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLogin = pathname === "/admin/login";
    if (pathname.startsWith("/admin") && !isLogin && !req.cookies.has(sessionCookieName())) {
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

  // /bn and /bn/… are real routes.
  if (pathname === "/bn" || pathname.startsWith("/bn/")) return NextResponse.next();

  // /en/… → canonical unprefixed URL.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  // First visit, Bangla-preferring browser → Bangla site. Crawlers send no
  // Accept-Language and always get English.
  if (!req.cookies.has(LOCALE_COOKIE) && prefersBangla(req.headers.get("accept-language"))) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/bn" : `/bn${pathname}`;
    const res = NextResponse.redirect(url, 307);
    res.headers.set("Vary", "Accept-Language, Cookie");
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

/** True when the visitor ranks Bangla above English (q-values respected). */
function prefersBangla(header: string | null): boolean {
  if (!header) return false;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = Number(params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1);
      return { lang: tag.split("-")[0], q: Number.isFinite(q) ? q : 0 };
    })
    .filter((x) => x.lang === "bn" || x.lang === "en")
    .sort((a, b) => b.q - a.q);
  return ranked[0]?.lang === "bn";
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    // Every public page: skip Next internals, APIs, uploaded media, metadata
    // routes and any file with an extension (favicon.ico, images, …).
    "/((?!_next/|api/|media/|sitemap\\.xml|robots\\.txt|.*\\.[A-Za-z0-9]+$).*)",
  ],
};
