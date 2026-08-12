# Sardinexszc Portfolio

A production-minded, content-managed portfolio built as a small monorepo. The public site is a statically rendered Next.js application. A Laravel API supplies portfolio content and includes a protected Blade admin panel for updates without editing source code.

## Stack

- **Next.js 16 + React 19 + TypeScript**: server rendering, SEO metadata, and incremental revalidation.
- **Tailwind CSS 4**: utility-first responsive styling with a small custom visual system in `apps/web/src/app/globals.css`.
- **Laravel 12 + PHP 8.2**: REST API, validation, sessions, CSRF protection, and the Blade admin.
- **SQLite by default**: no database service is required for local development. Laravel's standard MySQL driver is supported by changing environment variables.
- **Open-source only**: React, Next.js, Laravel, Tailwind, Lucide, and next-themes are permissively licensed open-source packages.

## Project structure

```text
apps/
  web/  Next.js public portfolio
  api/  Laravel API and Blade admin
```

## Requirements

- Node.js 22 or newer and npm (pnpm can be substituted in the frontend folder).
- PHP 8.2 or newer with `pdo_sqlite` enabled. PHP 8.3+ is recommended.
- Composer 2.
- VS Code with the ESLint extension and PHP Intelephense are recommended.

## Setup from scratch

From the repository root in PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
New-Item -ItemType File -Force apps/api/database/database.sqlite
Set-Location apps/api
composer install
php artisan key:generate
php artisan migrate --seed
Set-Location ../web
npm install
```

The seeder creates a local admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Set those variables in `apps/api/.env` before seeding. The default credentials are intentionally simple for local setup only; replace them immediately.

Start both applications in separate VS Code terminals:

```powershell
# Terminal 1
Set-Location apps/api
php artisan serve

# Terminal 2
Set-Location apps/web
npm run dev
```

Open `http://localhost:3000` for the portfolio and `http://localhost:8000/admin/login` for the admin.

## MySQL

Create a database and change the database section of `apps/api/.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio
DB_USERNAME=portfolio
DB_PASSWORD=your-local-password
```

Then run `php artisan migrate --seed` again. No application code changes are required.

## API

The public API is versioned under `/api/v1`. Every response uses Laravel's resource envelope: `{ "data": [...] }`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/v1/projects` | Featured projects ordered for display |
| GET | `/api/v1/skills` | Skills and proficiency percentages |
| GET | `/api/v1/timeline` | Experience and education entries |

Example:

```powershell
Invoke-RestMethod http://localhost:8000/api/v1/projects
```

Admin operations are session-authenticated Blade routes and should be used through the admin UI:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST / PUT / DELETE | `/admin/projects` and `/admin/projects/{project}` | Manage projects |
| POST / PUT / DELETE | `/admin/skills` and `/admin/skills/{skill}` | Manage skills |
| POST / PUT / DELETE | `/admin/timeline` and `/admin/timeline/{timelineEntry}` | Manage experience and education |

Project `tech_stack` is entered as a comma-separated value in the admin and stored as a JSON array. URL fields are validated as URLs, proficiency is restricted to 0-100, and timeline type is restricted to `experience` or `education`.

## Quality checks

```powershell
Set-Location apps/web
npm run typecheck
npm run lint
npm run test
npm run build

Set-Location ../api
vendor/bin/pint --test
php artisan test
```

The frontend is statically prerendered and revalidates API content every five minutes. The fallback demo content keeps the public page usable while the API is unavailable during local frontend-only work; production deployments should configure `NEXT_PUBLIC_API_URL` to the Laravel API.

## Deployment

### Frontend on Vercel

1. Import the repository and set the project root to `apps/web`.
2. Set `NEXT_PUBLIC_API_URL` to the HTTPS Laravel API URL ending in `/api/v1`.
3. Set `NEXT_PUBLIC_SITE_URL` to the public site URL.
4. Build with `npm run build` and deploy. Configure the Laravel `FRONTEND_URL` to match the Vercel origin.

`NEXT_PUBLIC_SITE_URL` is required for production canonical URLs, social previews, robots, and the sitemap. On Vercel, the deployment URL is used as a fallback, but the custom production domain should always be set explicitly.

For each project, add a concise role summary, outcome, and one highlight per line in the admin. Add screenshots only when they can be publicly shared; the public portfolio deliberately labels projects without one instead of using a fabricated visual.

Project screenshots may be stored under `apps/web/public/images` and referenced with a local `/images/...` path, or hosted on HTTPS. For an external host, set `PROJECT_IMAGE_HOST` to that hostname during the frontend build so Next.js can safely optimize it.

### Laravel on PHP hosting

1. Upload `apps/api` or deploy it with a PHP 8.2+ container.
2. Run `composer install --no-dev --optimize-autoloader`.
3. Create the production `.env`, run `php artisan key:generate`, then `php artisan migrate --seed`.
4. Point the web server document root at `apps/api/public` and make `storage` and `bootstrap/cache` writable.
5. Set `APP_ENV=production`, `APP_DEBUG=false`, strong admin credentials, HTTPS `APP_URL`, and the deployed frontend origin.
6. Run `php artisan config:cache` and `php artisan route:cache` after environment configuration.

## License

Released under the [MIT License](LICENSE).
