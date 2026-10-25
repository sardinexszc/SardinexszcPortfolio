# Security audit — 2026-10-25

Scope: the public site, API routes, admin sign-in and dashboard, Supabase database, dependencies, response headers, and git history. Branch: `security-audit-2026-10-25`.

## Summary

| Area | Result |
|---|---|
| Secrets in git history (all branches) | None found. Only `apps/web/.env.example` is tracked, with empty values. |
| Dependencies | **Fixed.** 5 vulnerable production packages, 1 critical. 0 remain in both lockfiles. |
| Response headers / CSP | **Tightened.** |
| Auth cookies | **Fixed.** Now `HttpOnly`. |
| Image optimizer | **Fixed.** Unused remote host removed. |
| Private routes | **Hardened.** `noindex` added. |
| Supabase advisors | No actionable issues. One dashboard setting is recommended. |
| Exposed files | None. `.env`, `.git`, source maps, SQL, and the private resume path all return 404/403. |
| API input handling and auth checks | No issues. Reviewed in the 2026-10-13 backend audit and unchanged since. |

## Fixed

1. **Next.js 16.2.11 → 16.4.3** (`next`, `eslint-config-next`). Advisories that applied to this site:
   - GHSA-vcvr-r3jv-pc5j: RCE in `next/og` ImageResponse. The share images use it.
   - GHSA-2464-fhr4-w9xw, GHSA-2xp9-vwfh-vxw4, GHSA-cjq9-62q9-8jv4: RCE and SSRF in the Image Optimization API. Project covers use `next/image`.
   - GHSA-p3m5-59mp-jv5r: DoS through Server Actions. Admin sign-in uses Server Actions.
   - Transitive fixes: `sharp` 0.35.5 (libvips/libheif/librsvg CVEs), `postcss` (file read via `sourceMappingURL`), `nanoid`, `source-map-js`.
   - Both `package-lock.json` (workspace root) and `apps/web/package-lock.json` were updated, so the fix ships whichever one Vercel installs from.
2. **Supabase auth cookies are `HttpOnly`** (`src/lib/supabase/cookie-options.ts`). `@supabase/ssr` defaults to `httpOnly: false` so browser clients can read the session. This app only uses Supabase on the server. Combined with `'unsafe-inline'` scripts, the default meant any injected script could read the admin session. Verified locally: the cookies are sent as `Secure; HttpOnly; SameSite=lax`.
3. **Image optimizer limited to local files.** `images.unsplash.com` was still allowed, although nothing used it. That let anyone use `/_next/image` as a resizing proxy for that host. A remote URL now returns 400.
4. **CSP tightened.** Every resource is now same-origin. Removed: `https:` from `connect-src` and `img-src`, `wss:`, `blob:`, and the Google Fonts hosts (`next/font` self-hosts fonts). Added: `frame-src 'none'` and `manifest-src 'self'`. A headless browser pass over the homepage (scroll, project dialog, theme toggle), the login page, and the 404 page logged no CSP violations, no broken images, and all fonts loaded.
5. **New headers.** `Cross-Origin-Opener-Policy: same-origin`, and a broader `Permissions-Policy` (`payment`, `usb`, `browsing-topics`).
6. **`noindex, nofollow`** on `/loginauthentication` and `/analytics/*`. This backs up `robots.txt` for crawlers that ignore it.

## Accepted risk

- **`script-src 'unsafe-inline'`.** Next's inline bootstrap needs either this or a per-request nonce, and nonces would make the static homepage render on every request. Mitigations: no user content is rendered as HTML, the only `dangerouslySetInnerHTML` uses are a constant theme script and `<`-escaped JSON-LD, and session cookies are now `HttpOnly`.
- **Supabase "RLS enabled, no policy" (INFO) on all 5 tables.** This is intentional. With no policies, the publishable key gets nothing. Only the server-side secret key reads or writes.

## Needs the owner (dashboard settings or decisions)

1. **Supabase → Authentication → Attack Protection → Leaked password protection.** Turn it on (Supabase advisor WARN). It rejects passwords found in known breaches. Availability depends on the Supabase plan.
2. **`apps/web/public/images/hero-photo.jpg` (6.2 MB)** is unused but publicly downloadable. Repeated downloads use Vercel bandwidth. Delete it, or move it out of `public/` if you want to keep it.
3. **The downloadable resume includes a phone number and city.** This is a deliberate trade-off for recruiters, noted here only for awareness.

## Re-run

```bash
npm audit --omit=dev
```

```bash
curl -sI https://ivansalinas.vercel.app/
```

For Supabase, use the dashboard → Advisors → Security.
