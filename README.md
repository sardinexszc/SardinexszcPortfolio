# Sardinexszc Portfolio

The portfolio is a static Next.js landing page deployed on Vercel. It contains the public portfolio presentation, selected work, experience, research, education, and contact links.

## Project structure

```text
apps/
  web/       Next.js landing page
```

## Vercel deployment

Set the Vercel project root to `apps/web`. No backend or environment variables are required.

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

The portfolio homepage is available at `/`.
