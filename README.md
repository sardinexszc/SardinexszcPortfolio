# Sardinexszc Portfolio

The public portfolio is a Next.js application deployed on Vercel. Supabase provides Google sign-in and PostgreSQL storage. Plain PHP Vercel Functions provide the admin content API; Laravel has been removed.

## Project structure

```text
apps/
  web/       Next.js portfolio, admin UI, and PHP API functions
supabase/
  migrations/
  seed.sql
```

## Supabase setup

1. Create a Supabase project.
2. In the SQL Editor, run `supabase/migrations/202609240001_portfolio_and_admin.sql`.
3. Run `supabase/seed.sql` once to load the starter portfolio content.
4. In **Authentication → Providers**, enable Google. Create a Web OAuth client in Google Cloud. Add the portfolio origin (for example `https://ivansalinas.vercel.app`) as an authorized JavaScript origin, and add the Supabase callback URI shown on the Google provider setup page as an authorized redirect URI.
5. In Supabase **Authentication → URL Configuration**, set the Site URL to `https://ivansalinas.vercel.app` and allow `https://ivansalinas.vercel.app/auth/callback`. Add local/preview URLs only when needed.
6. Sign in once at `/loginauthentication`. In the SQL Editor, find that Google user in `auth.users` by email and add their UUID to `public.admin_users`:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'YOUR_GOOGLE_EMAIL';
```

The database policies make the portfolio content publicly readable and permit writes only for UUIDs in `admin_users`. Never add a service-role key to the frontend or PHP function environment.

## Vercel deployment

Set the Vercel project root to `apps/web`, then add these variables for Production:

| Variable | Value |
| --- | --- |
| `SITE_URL` | `https://ivansalinas.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (`sb_publishable_...`) |
| `SUPABASE_URL` | Same Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Same Supabase publishable key |

The `NEXT_PUBLIC_` values are used by Next.js for Google Auth and public content reads. The server-side values are used by PHP functions. Publishable keys are safe for client use when RLS is enabled; never use a Supabase secret key here.

Vercel builds the site and PHP functions from `apps/web/vercel.json`. The PHP functions use Vercel’s community PHP runtime. After setting environment variables, redeploy the project.

## Local development

Copy `apps/web/.env.example` to `apps/web/.env.local` and add your Supabase values. Run the Next.js site with `npm run dev` from `apps/web`. PHP API functions are available locally through Vercel CLI (`vercel dev`) with PHP installed.

## Quality checks

```powershell
Set-Location apps/web
npm run typecheck
npm run lint
npm run build
```

The portfolio homepage remains at `/`. Admin sign-in is available directly at `/loginauthentication`; the protected content editor is at `/admin`.
