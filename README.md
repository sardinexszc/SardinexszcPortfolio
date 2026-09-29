# Sardinexszc Portfolio

The portfolio is a static Next.js landing page deployed on Vercel. It contains the public portfolio presentation, selected work, experience, research, education, and contact links.

## Project structure

```text
apps/
  web/       Next.js landing page
```

## Vercel deployment

Set the Vercel project root to `apps/web`. The analytics API uses a dedicated Supabase project and server-side Vercel functions.

The project uses the native Next.js framework preset, `npm ci` for installation, and `npm run build` for production builds.

## Local development

Run the Next.js site with `npm run dev` from `apps/web`.

## Quality checks

```powershell
Set-Location apps/web
npm run typecheck
npm run lint
npm run build
```

The portfolio homepage is available at `/`. The private login is at `/loginauthentication` and the protected analytics page is at `/analytics`.

## Analytics setup

1. Create a **dedicated portfolio** Supabase project. Run `apps/web/sql/portfolio_analytics.sql` in that project's SQL editor. Create one user in Supabase Auth with an email and password; copy that user's immutable UUID for `SUPABASE_ADMIN_USER_ID`. Disable public sign-ups in the Supabase Auth settings if this is admin-only.
2. Copy `apps/web/.env.example` to `apps/web/.env.local`. Set the project URL and publishable key, plus the **server-only** Supabase secret key and admin UUID. Never commit `.env.local` or expose the secret through a `NEXT_PUBLIC_` variable.
3. Add the same four variables to the Vercel project for Preview and Production. Set Vercel's root directory to `apps/web`, then deploy the branch.
4. The portfolio homepage POSTs to `/api/track-visit` once per page load. A first-party, one-year cookie ensures each browser is counted once; cleared cookies/new devices are counted again. The two resume links request `/api/track-download`, which serves the private PDF after recording the request. The PDF is not stored under `public/`, so its former static URL cannot bypass tracking. Counts start at zero when the tables are created.

For project engagement, also apply `apps/web/sql/portfolio_engagement.sql` to the same project. Opening a project detail panel records a `project_open` event; following a live project, GitHub repository, GitHub profile, or LinkedIn profile link records an `outbound_click` event via `/api/track-engagement`. The admin dashboard groups recorded events across deployments. Project and outbound counts begin when this migration and the corresponding app deployment are in place.

Apply `apps/web/sql/portfolio_audience.sql` after the engagement migration for country/city, device/browser, and estimated visit engagement. A visit is a browser tab session with a 30-minute idle timeout when the page is loaded again. Active time starts after the landing loader and updates while the tab is visible. An engaged visit has at least 10 active seconds or a project/link interaction; a non-engaged visit is the complement. Geography is approximate, inferred by Vercel from the network address. No IP address or full user-agent string is stored in the audience tables. Dashboard audience figures include recorded deployments since this migration and deployment.

Apply `apps/web/sql/portfolio_rate_limits.sql` before deploying the rate-limited routes. It creates an atomic, one-minute counter used by the four public tracking endpoints. It stores a keyed hash of the client address rather than the address itself and returns `429` with `Retry-After` when a limit is reached. The service-role-only function and counter table have no public access.

The analytics and rate-limit tables have RLS enabled and no public policies. Only server-side Next.js routes use the secret key; `/analytics` checks the live Supabase Auth user and the configured admin UUID before querying counts. Authentication pages are dynamic and must not be cached.
