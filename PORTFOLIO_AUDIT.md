# Portfolio audit — 2026-10-13

Branch: `portfolio-audit-2026-10-13` (from `main` @ `13e1b85`, the version live at https://ivansalinas.vercel.app).
Target: junior to mid-level web roles (full-stack, front-end, back-end) in the IT industry.

**Assumptions** (left as placeholders in the brief): the goal is getting interviews; constraints are to keep the stack, keep the brand colours and typography, and not do a full redesign.

> Note: the locally checked-out branch was `backend-development`, which is **44 commits behind `main`**. All work here is based on `main`.

---

## 1. Executive summary

| | Before | After (this branch) |
|---|---|---|
| Overall score | **5.4 / 10** | **7.8 / 10** |
| Recruiter verdict | **Maybe, leaning no.** Five seconds of a blank loader eats the 6-second scan. | **Maybe, leaning yes** for Laravel/PHP full-stack roles. **Maybe** for React/Next.js-first roles. |

**Top strengths**
- Real, deployed production systems for a real institution, plus 2 peer-reviewed publications with DOIs.
- A distinctive design with a consistent mono/grotesk system, a well-built dark mode, and restrained colour.
- A clean, small codebase: TypeScript, lint passes, security headers, rate-limited analytics.

**Top blockers (before)**
1. A **full-screen loader hid every pixel of content for 5.25 s** on every visit, which costs the whole recruiter scan and pushed mobile LCP to 6.2 s.
2. **No proof of impact.** No numbers, screenshots, or code links, and the project details were collapsed by default.
3. **Fragile resume download.** If Supabase rate limiting or logging failed, the resume returned 503.
4. One of three project links (**CLAARRDEC CMS**) is a **404**.
5. Accessibility gaps: contrast failures in dark mode, a focus ring that was invisible in light mode, 8–9 px labels, and a theme toggle floating over content.

**Still blocking after this branch** (needs your input, see §5): no measurable outcomes, no screenshots, a thin GitHub profile, and resume bullets that are vaguer than your own longer resume.

---

## 2. Audit scores (1–10)

| # | Area | Before | After | Evidence |
|---|---|---|---|---|
| 1 | First impression and hierarchy | 4 | 8 | Before: 5.25 s blank "Loading portfolio" screen (`landing-loader.tsx`). The h1 "Full-stack engineer for research and institutional systems" frames you narrowly for general web roles. After: content is instant, the h1 names the role, the support line names the stack and employer, and an "At a glance" panel gives focus, experience, stack, education, and location above the fold. |
| 2 | Navigation and IA | 6 | 8 | Before: nav had only Work, About, and Contact. Skills and Research had no anchors. The hero "selected projects" chips all pointed to `#work`. After: Skills anchor added, per-project anchors, Research anchor. |
| 3 | Typography, spacing, colour | 7 | 8 | Strong system. Before: meta labels at .53–.6 rem (8.5–9.6 px). After: about 11 px minimum. |
| 4 | Responsive / mobile | 7 | 8.5 | Before: the fixed theme button overlapped content at 375 px. After: the toggle sits in the header, there is 0 px horizontal overflow at 390 px, and the "Skills" link hides under 430 px to fit. |
| 5 | Accessibility (WCAG AA) | 6 | 9 | Lighthouse a11y 96 → **100 (light and dark)**. Fixed: `--muted` #777 (4.1:1) → #666 (5.3:1). The contact section's #999 text on the dark-theme light panel failed AA. The focus ring was lime #d9ff52 on the light page (invisible) and is now `currentColor`. Accessible names didn't match visible text (`label-content-name-mismatch`). `role="list"` sat on `<div>` with `<article role="listitem">` and is now a real `ul`/`li`. Heading levels are fixed (h2 → h3 → h4). "Opens in new tab" is announced. Reduced motion now also stops hover transforms. The JS smooth-scroll ignored `prefers-reduced-motion` and was removed (CSS handles it). |
| 6 | Performance | 5 | 8* | Live mobile: Perf 73, LCP 6.2 s, Speed Index 5.8 s. Local after: Speed Index 2.4 s and observed LCP 1.2 s. The whole page was a Client Component and is now server-rendered with two tiny client islands. *Local simulated LCP is not comparable, see §4. |
| 7 | SEO and metadata | 6 | 8.5 | Before: no OG or Twitter image (shares rendered as bare text cards), no structured data, and robots allowed `/analytics` and `/api`. After: generated 1200×630 share images, `Person` JSON-LD with `sameAs` GitHub/LinkedIn, robots disallows private routes, a description aimed at web roles, `theme-color`. |
| 8 | Code quality | 6 | 7.5 | Removed 6 unused modules, 7 unused helpers, and about 120 lines of dead CSS (old project grid, case-study page, loader). Still no tests. 3 unused npm dependencies remain (§6). |
| 9 | Trust and professionalism | 5 | 7 | The CLAARRDEC CMS link was a 404 and is now hidden with "Public link currently unavailable". The footer "Designed and built with care" is now a "View source" link to this repo. No custom 404 existed, now added. The resume lists `www.ivansalinas.vercel.app`, which doesn't resolve (your local copy, see §5). |
| 10 | Conversion / CTA | 5 | 8 | The resume download is now independent of analytics, and the CTAs are plain links that work without JS. Live-site links show on card faces, not hidden in `<details>`. LinkedIn is a primary contact link. The CRRDC card links its public source repo. |

---

## 3. HR / recruiter review

**6-second scan (non-technical recruiter)**
- *Before:* sees a black screen with "IS / PORTFOLIO, Loading portfolio". Content appears at about 5 s. Many recruiters have already left.
- *After:* reads "Full-stack web developer", then Laravel, Next.js, SQL, then Central Luzon State University, then "Nueva Ecija, Philippines, open to remote", with Download resume next to it. **Pass.**

**Hiring manager (web roles)**
- ✅ Real deployed systems, end-to-end ownership (requirements → DB design → deployment), team lead experience, and publications. These are above-average signals for a junior/mid candidate.
- ⚠️ **No outcomes.** "Deployed a shared platform…" says what exists, not what changed. One number per project (users, institutions, records, reports/month, hours saved) would change this a lot.
- ⚠️ **No visuals.** There are zero screenshots, so a reviewer has to leave the site to see your work.
- ⚠️ **Thin GitHub.** The profile has no bio, no pinned repos, and 6 repos. `crrdc` (now linked) still has the default create-next-app README, even though it contains a real ERD and `DATABASE_ARCHITECTURE.md`, which are strong evidence. The `SardinexszcPortfolio` repo description has a typo ("Porfolio").
- ⚠️ **Positioning.** The site and resume read as "institutional/research systems". For general IT companies, lead with the stack and the type of system (CRUD, auth, reporting, CMS, APIs). Research is a strength, but it shouldn't be the headline.
- ⚠️ The "Full-Stack Web Developer, Independent and collaborative work, 2026–Present" entry has no named project, so it looks like a gap filler.

**ATS scan: live resume (generated by `scripts/build_resume.py`)**
- ✅ Single column, real text, standard headings, one page, consistent with the site. This parses cleanly.
- ⚠️ **Keyword-thin bullets:** "Delivered research information, monitoring, and content systems…" Your longer resume (`Downloads/2026_ICLSalinas_Resume.pdf`) has much stronger, specific bullets: SDLC ownership, MySQL/PostgreSQL/Supabase schema design, secure REST APIs, n8n/LLM automation, mentoring interns. The tightening removed the keywords ATS filters look for.
- ⚠️ Before this branch it had no LinkedIn or GitHub. **Now added.**

**ATS scan: your local `Downloads` resume** (if you send that one anywhere)
- ❌ Two-column layout. `pdftotext` interleaves the Skills and Education/Publications columns, which is a parsing risk.
- ❌ `https://www.ivansalinas.vercel.app` doesn't resolve. The `www.` is invalid on vercel.app.
- ⚠️ "Laravel" is missing from Skills even though 2 of 3 projects are Laravel.
- ⚠️ The title "Instructor I | Information Systems Developer" differs from the site's "Researcher, Instructor, and Information Systems Developer". Pick one.
- ⚠️ "Expert" and "AI Automation Specialist" are not backed by any project on the site.

**Would I interview?**
- Laravel/PHP full-stack (junior–mid): **Yes, after** the 3 quick content fixes in §6 (outcomes, screenshots, resume bullets). Today: Maybe.
- React/Next.js front-end: **Maybe.** One Next.js project is visible, and there's no UI to look at without leaving the site.

---

## 4. What changed

| Commit | Change |
|---|---|
| `14031a7` | Removed the 5.25 s landing loader. The resume route serves the PDF even when the rate limiter or Supabase insert fails (rate-limited requests still download, they just aren't counted). Resume CTAs are plain `<a download>` links. Added `Person` JSON-LD. |
| `c767c12` | The portfolio page is a **Server Component**. `TrackedLink` / `TrackedDetails` client islands keep your engagement analytics. New hero copy (stack + employer, using only facts already on the site or resume). "At a glance" facts panel. Visible "Visit live site" links. CLAARRDEC CMS link hidden (404). Skills/Research/per-project anchors. Semantic lists and headings. Theme toggle moved into the header. Deleted `hero-scramble`, `smooth-scroll`, `contact`, `resume-data`, and `resume-download-link`. |
| `e68e1d4` | Contrast, focus ring, minimum label sizes, theme-aware contact section colours, inline pre-paint theme script (no light flash for dark-mode visitors), reduced-motion transforms, removed about 120 lines of dead CSS. |
| `f25448c` | `opengraph-image` / `twitter-image` (generated PNG), robots disallow for `/analytics`, `/loginauthentication`, `/auth/`, `/api/`, branded `not-found` page. |
| `de1eef9` | Removed unused helpers from `work-projects.ts`. |
| `52625bc` | Resume generator: clickable email, site, **LinkedIn, and GitHub** in the header. PDF regenerated (still 1 page). |
| `e926c4b` | `.gitattributes` marks PDFs and images as binary. Git was treating the resume PDF as text, so CRLF conversion could corrupt it. |
| `47bfd8c` | The CRRDC card links `github.com/sardinexszc/crrdc` (verified: the repo's homepage is crrdc.vercel.app). |

Not changed on purpose: brand colours, fonts, layout system, admin/analytics features, your about/experience copy.

---

## 5. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ pass |
| `npm run lint` | ✅ 0 errors, 1 warning that predates this branch (`auth-feedback.tsx`, admin code) |
| `npm run build` | ✅ pass. `/` is static. OG/Twitter images are static. |
| Tests | ⚠️ none exist in the repo |
| Resume route with Supabase unavailable | ✅ 200 `application/pdf` (`main` returns 503 here) |
| Keyboard walk (25 stops) | ✅ logical order, visible ring on every stop in both themes |
| Horizontal overflow at 390 px | ✅ 0 px, light and dark |
| Heading outline | ✅ one h1, then h2 → h3 → h4, no skipped levels |

**Lighthouse 13.5** (before = live site, after = local production build)

| | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| Mobile before | 73 | 96 | 100 | 100 |
| Mobile after | 75* | **100** | 96† | 100 |
| Desktop before | 100 | 96 | 100 | 100 |
| Desktop after | 100 | **100** | 96† | 100 |
| Mobile after, dark theme | — | **100** | — | — |

\* Local mobile performance is **not comparable** to Vercel. On this Windows machine, `next build` writes an empty `next-font-manifest.json` (pristine `main` does the same locally), so fonts aren't preloaded, and Lighthouse's simulated LCP waits for the font swap. Observed LCP locally is 1.2 s. The live Vercel build *does* emit font preloads. **Re-run PageSpeed after deploying.** You should see mobile LCP well under the previous 6.2 s.
† The only best-practice failure is a console 503 from `/api/track-visit` because Supabase isn't configured locally. It won't happen in production.

Live link check (2026-10-13): crrdc.vercel.app 200 · rtms.clsu.edu.ph 200 · claarrdec.clsu.edu.ph **404** · DOI 10.70059 200 · DOI 10.1145 403 (ACM blocks bots, fine in a browser) · LinkedIn 999 (blocks bots, fine) · GitHub 200.

---

## 6. `[NEEDS INFO]` — what only you can provide

1. **[NEEDS INFO: one measurable outcome per project]**: users or staff onboarded, member institutions on RTMS, records migrated, reports per month, time saved versus the old process. Goes in `projectDetails[*].outcome` in `apps/web/src/components/selected-work-section.tsx`.
2. **[NEEDS INFO: 1–2 screenshots per project]** (dashboard, list or detail view, admin screen; blur any sensitive data). Set `image_url` in `apps/web/src/lib/api.ts`. The card already renders it.
3. **[NEEDS INFO: CLAARRDEC CMS status]**: is claarrdec.clsu.edu.ph down temporarily, moved, or decommissioned? Restore `live_url` in `api.ts` when it's back.
4. **[NEEDS INFO: "Full-Stack Web Developer, 2026–Present" details]**: name at least one client or project, or remove the entry.
5. **[NEEDS INFO: canonical job title at CLSU]**: "Instructor I | Information Systems Developer" (Downloads resume) or "Researcher, Instructor & Information Systems Developer" (site and live resume). Use the same title everywhere.
6. **[NEEDS INFO: your actual role on RTMS and the CLAARRDEC CMS]**: sole developer, lead, or team member, and team size. "Built the monitoring and reporting workflows" is ambiguous.
7. **[NEEDS INFO: GitHub repos for RTMS / CLAARRDEC]**: if these can't be public, say "private institutional codebase" and instead pin one public project that shows Laravel.
8. **[NEEDS INFO: seniority / years framing you want shown]**: your Downloads resume says "7+ years". The site avoids a number. Decide which you'll defend in an interview. Developer work since August 2019 is about 7 years. 2017–2019 was project technical staff.

---

## 7. Next steps, in priority order

1. **Merge and deploy this branch**, then re-run PageSpeed Insights on mobile.
2. **Add outcomes and screenshots** (NEEDS INFO 1–2). This is the biggest remaining hiring signal.
3. **Restore the specific bullets in the live resume** (`scripts/build_resume.py`): SDLC ownership, MySQL/PostgreSQL/Supabase schema design, REST APIs, n8n/LLM automation, mentoring interns, and Laravel in Skills. Re-run `python scripts/build_resume.py`.
4. **GitHub profile:** add a bio ("Full-stack developer · Laravel · Next.js · PH · open to remote"), pin `crrdc` plus one Laravel project, replace the `crrdc` README boilerplate with a summary that links the ERD and architecture docs, and fix "Porfolio".
5. **Fix your Downloads resume** if you use it anywhere: single column, remove `www.`, add Laravel.
6. **Add a "Projects beyond work" entry**, e.g. `tcehub` (Toyota Camry Elite Community website, TypeScript) or `user-management-assessment`, once each has a README and a live link. That would show React/Next.js range.
7. **Tidy dependencies** (no runtime impact; do it when you can redeploy and verify):
   ```bash
   npm --prefix apps/web uninstall animejs framer-motion next-themes
   ```
   Also remove `animejs` from the root `package.json`. The root `package-lock.json` is stale relative to `apps/web/package-lock.json`. Decide which one Vercel should use.
8. **Housekeeping:** `apps/web/public/images/hero-photo.jpg` (6.2 MB) is unused but publicly downloadable. Either use a compressed version as a profile photo or delete it. `apps/web/assets/resume/2026_ICLSalinas_Resume.txt` is from the older resume and no longer matches the PDF.
9. **Add a smoke test** (Playwright or a `node:test` route test) for `/api/track-download` returning a PDF, so this regression can't recur.
