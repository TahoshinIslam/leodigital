/**
 * Session cookie settings, shared by the server and the proxy. Secure cookies
 * (and the stricter __Host- prefix) are used whenever the site is served over
 * HTTPS; a plain-HTTP local/XAMPP setup still works.
 */
export function secureCookies(): boolean {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");
}

export function sessionCookieName(): string {
  return secureCookies() ? "__Host-leotech_session" : "leotech_session";
}
