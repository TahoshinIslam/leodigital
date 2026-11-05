import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// HTTPS-only directives are applied only when the public site URL is https.
const isHttps = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

/**
 * Content Security Policy. Next.js injects small inline bootstrap scripts, so
 * script-src needs 'unsafe-inline' unless every page is rendered per request
 * with a nonce — which would throw away static prerendering for the public
 * site. Everything else is locked to our own origin.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self' https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isHttps ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(!isHttps ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

// Hosts whose https images may go through the image optimizer, e.g.
// IMAGE_REMOTE_HOSTS=images.unsplash.com,cdn.example.com
const remoteHosts = (process.env.IMAGE_REMOTE_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory makes Next infer the wrong workspace root.
  turbopack: { root: path.resolve(process.cwd()) },

  // Partial prerendering + `use cache`: public pages are served from a static
  // shell, with DB data cached by tag and expired when an admin edits a service.
  cacheComponents: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/media/**" }, { pathname: "/**", search: "" }],
    remotePatterns: remoteHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      // (Next.js already serves /_next/static with immutable year-long caching.)
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
