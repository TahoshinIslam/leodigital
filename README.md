# Leotech — website + digital marketing CMS

Next.js 16.4 (App Router, Cache Components) · React 19.3 · MySQL/MariaDB (XAMPP) · Tailwind CSS 4

- **Public site**: the marketing home page, `/services` and one detail page per service at `/services/[slug]`. Every detail page uses the same layout, filled from the database.
- **Admin panel** at `/admin`: dashboard (greeting banner with live clock and calendar), service CRUD, publish/unpublish, image uploads, URL slugs, SEO fields, users and roles (RBAC), activity log, Core Web Vitals.
- **Admin in English or Bangla**: switch with the **EN | বাংলা** toggle in the top bar or on the login page; the choice is remembered per browser. Interface strings live in `lib/i18n/admin/en.ts` and `bn.ts` (type-checked to match). Server messages and validation errors are translated as well.
- **JSON API** under `/api`: a public read API (CORS-enabled) and an authenticated admin API.

## Quick start (XAMPP)

1. Start **MySQL** in the XAMPP control panel. XAMPP ships MariaDB 10.4+; MySQL 8 also works.
2. Install and configure:

   ```bash
   npm install
   cp .env.example .env.local   # then edit DB_* and SEED_ADMIN_*
   ```

   XAMPP defaults: `DB_USER=root`, `DB_PASSWORD=` (empty), `DB_PORT=3306`.
3. Create the database, tables, first super admin and starter services:

   ```bash
   npm run db:setup
   ```

   The command is idempotent. `npm run db:reset` drops all tables and starts fresh, deleting all data.
4. Run:

   ```bash
   npm run dev                      # http://localhost:3000
   npm run build && npm start       # production
   ```

   Sign in at **/admin/login** with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

> `npm run build` reads published services from the database so it can prerender them, so MySQL must be running during the build.

## Project structure

There is no `src/` folder. Only `app/` defines routes; route files stay thin and delegate to `views/`.

```
app/                     Routes only (App Router)
  (site)/                Public website (shared site layout)
    page.tsx             → views/site/home/HomeView
    services/page.tsx    → views/site/services/ServicesIndexView
    services/[slug]/     → views/site/services/ServiceDetailView (one shared layout)
  admin/
    login/               → views/admin/auth
    (panel)/             Authenticated admin (sidebar shell)
      page.tsx           → views/admin/dashboard
      services/, users/, activity/
  api/                   Route Handlers (JSON API)
    services/            Public, CORS-enabled, rate limited
    admin/…              Auth + RBAC + CSRF-checked
    auth/, health/, vitals/
  media/[file]/          Serves uploaded images
  sitemap.ts, robots.ts, not-found.tsx, error.tsx, global-error.tsx
views/                   Page implementations (named "views": a root pages/ folder would be the Pages Router)
  site/…  admin/…
components/              Reusable UI
  site/                  Public-site components (nav + full-screen menu, cards, animation)
  admin/                 Admin UI kit (cards, pills, clock, calendar, repeater, image field)
server/                  Server-only code (`import "server-only"`)
  db/pool.ts             The single MySQL pool + parameterized query helpers
  repositories/          All SQL lives here
  modules/               Business logic (services, users, auth, dashboard, vitals)
  actions/               Server Actions used by admin forms
  auth/                  Sessions, password hashing, guards
  security/              Rate limiting, origin checks, Markdown sanitizing
  http/                  Error types, API/action wrappers, central error reporting
  storage/uploads.ts     Image upload validation and storage
lib/                     Code shared by client and server (validation schemas, RBAC table, types)
content/site.ts          Static marketing copy for the home page
database/                schema.sql + seed data
scripts/db-setup.mjs     Database setup / seed
proxy.ts                 (Next 16's renamed middleware) fast admin redirect + noindex headers
```

## Roles (RBAC)

| Permission | Super admin | Admin | Editor | Viewer |
|---|:-:|:-:|:-:|:-:|
| View dashboard and services | ✓ | ✓ | ✓ | ✓ |
| Create and edit services, upload images | ✓ | ✓ | ✓ | |
| Publish / unpublish, change a live URL, delete | ✓ | ✓ | | |
| View users and the activity log | ✓ | ✓ | | |
| Manage users and roles | ✓ | | | |

Defined once in `lib/auth/permissions.ts`. The server enforces these checks on every page, Server Action and API call; hiding buttons in the UI is only a convenience. Nobody can change their own role, edit a user ranked above them, or remove the last active super admin.

## Security

- **Authentication:** opaque random session tokens. Only their SHA-256 hash is stored in the `sessions` table, so sessions can be revoked instantly. Cookies are `HttpOnly` and `SameSite=Lax`; when `NEXT_PUBLIC_SITE_URL` is https they are also `Secure` and use the `__Host-` prefix. Passwords are hashed with bcrypt (cost 12). Login checks take the same time whether or not the account exists. Changing a role, password or active status signs that user out everywhere.
- **Authorization:** `server/auth/guard.ts` plus the RBAC table. `proxy.ts` only does a fast redirect when the session cookie is missing.
- **CSRF:** Server Actions use Next's built-in Origin check. Cookie-authenticated API writes must come from the same origin (`Origin` / `Sec-Fetch-Site`).
- **SQL injection:** every query uses `?` placeholders (prepared statements), and `multipleStatements` is off. Column names come from fixed allow-lists.
- **Validation and sanitizing:** zod schemas in `lib/validation` cover every input, and control characters are stripped. Unknown fields are rejected on PATCH. Markdown is rendered and then passed through an allow-list sanitizer, so scripts, event handlers and `javascript:` URLs are removed. JSON-LD output is escaped.
- **Uploads:** the file type is read from its magic bytes, not its name or claimed MIME type. JPEG, PNG, WebP and AVIF are allowed; SVG is refused. Files get random names, are stored outside `/public`, and are served with `nosniff` and a sandbox CSP. There is a size limit.
- **Rate limiting:** login (5 attempts per 15 min per IP+email, 30 per IP), admin writes, uploads and the public API. The limiter is in-memory, which is fine for a single Node process; swap the store in `server/security/rate-limit.ts` for Redis when running several instances.
- **Headers:** CSP, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP, and HSTS on https. Admin routes get `noindex` and `no-store`.
- **CORS:** only the public read API, and only for origins listed in `CORS_ALLOWED_ORIGINS`.
- **Errors:** one handler (`server/http/report.ts`) returns `{ "error": { "code", "message", "details?" } }`. Unexpected errors are logged server-side with a request id; the client sees a generic message plus that id, never stack traces or SQL. Secrets live only in server env vars; `NEXT_PUBLIC_SITE_URL` is the only public one.

## Performance and SEO

- **Rendering and caching:** `cacheComponents` (partial prerendering). Public pages are prerendered, and service data is cached with `'use cache'` + `cacheTag`. Any admin change expires the tags immediately (`revalidateTag(tag, { expire: 0 })`), so publishing, unpublishing and edits show up on the next request without a rebuild. Pages for new services render on first visit and are then cached.
- **Little client JS:** service pages are Server Components. The FAQ uses native `<details>`; only the nav ships JavaScript. Lenis/GSAP and the WebGL effects load on the home page only.
- **Images:** `next/image` serves AVIF/WebP with responsive `srcset`, lazy-loads by default, and uses `priority` only for the hero.
- **Fonts:** `next/font` self-hosts them with size-adjusted fallbacks. The menu font isn't preloaded.
- **SEO:** per-page metadata (admin-editable title, description, OG image, canonical URL, `noindex`), `sitemap.xml`, `robots.txt`, and Service, FAQPage and BreadcrumbList JSON-LD. Renamed slugs permanently redirect.
- **Core Web Vitals:** real-visitor metrics (`useReportWebVitals` → `/api/vitals`) appear as p75 values on the admin dashboard and are logged as JSON lines. Lab check with Lighthouse (mobile, simulated slow 4G, local build):

  | Page | Perf | A11y | Best practices | SEO | LCP | CLS |
  |---|---|---|---|---|---|---|
  | `/services/seo` | 90 | 96 | 100 | 100 | 3.6 s | 0.001 |
  | `/services` | 85 | 96 | 100 | 100 | 4.2 s | 0 |
  | `/` | 57 | 96 | 100 | 100 | 3.1 s | 0 |

  The home page's score comes from its WebGL backdrops (Three.js / OGL), measured here without a GPU. That is where to focus next, for example by loading the backdrops on interaction or idle, or swapping them for video or CSS on mobile. Don't assume the framework alone makes a page fast; measure it.

## API

| Method | Path | Auth |
|---|---|---|
| GET | `/api/services`, `/api/services/:slug` | public (CORS, rate limited) |
| GET / POST | `/api/admin/services` | `services:read` / `services:create` |
| GET / PATCH / DELETE | `/api/admin/services/:id` | `services:read` / `services:update` / `services:delete` |
| POST | `/api/admin/services/:id/publish` `{ "published": true }` | `services:publish` |
| POST | `/api/admin/uploads` (multipart `file`) | `media:upload` |
| GET / POST, PATCH | `/api/admin/users`, `/api/admin/users/:id` | `users:read` / `users:manage` |
| POST | `/api/auth/login`, `/api/auth/logout` | same-origin |
| GET | `/api/health` | public |

## Scripts

`dev` · `build` · `start` · `lint` · `typecheck` · `db:setup` · `db:reset`
