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
4. The portfolio homepage POSTs to `/api/track-visit` once per page load. A first-party, one-year cookie ensures each browser is counted once; cleared cookies/new devices are counted again. The two resume links request `/api/track-download`, which logs each successfully delivered PDF. Direct requests to the original static PDF path bypass tracking. Counts start at zero when the tables are created.

Both analytics tables have RLS enabled and no public policies. Only server-side Next.js routes use the secret key; `/analytics` checks the live Supabase Auth user and the configured admin UUID before querying counts. Authentication pages are dynamic and must not be cached.
