# Plan: Admin workspace redesign (`/analytics`)

## Primary goal
When you sign in to the admin workspace, you see at a glance whether the portfolio is working: visits, résumé downloads and what recruiters click, plus how that has trended over the last 30 days. You can edit any home-page content in a calm, uncluttered layout where nothing overlaps and Save is always within reach.

## Current state (verified)
- **Disciplines bug:** `.cms-group legend` is `float: left; width: 100%` (`src/components/dashboard.css`, CMS block).
  - `.cms-grid` has `clear: both`, but `.cms-services` does not.
  - So the three discipline slots are squeezed into the leftover space beside the floated legend. That leftover is a sliver on the right, where the labels print over each other and the inputs are about 40px wide. This matches the screenshot.
- **Stale project metric:** the Dashboard ranks projects by `project_open` ("Detail opens") at `src/app/analytics/page.tsx:71,74`.
  - The new home page has no project dialog. Tiles are `TrackedLink`s that record only `outbound_click` with `live_project` or `github_repository` (`src/components/portfolio-page.tsx:27`).
  - So "Detail opens" will never grow again.
- **No trend:** the Dashboard shows all-time totals only.
  - Timestamps already exist: `visitors.visited_at`, `resume_downloads.downloaded_at` (`sql/portfolio_analytics.sql`), `portfolio_events.occurred_at` (`sql/portfolio_engagement.sql`) and `portfolio_sessions.started_at` (`sql/portfolio_audience.sql`).
- **Oversized headers:** the page header `h1` is up to 5.2rem on every module (`.dashboard-page-header h1`). The first screen of each module is mostly title.
- **Save button out of reach:** on Content → Site copy, the four groups stack into one very long form, and Save sits at the bottom only.
- **Opaque list rows:** list sections (Projects, Publications, IP…) collapse each row to its title. There's no thumbnail, status or link, so you have to open each row to know what it is.
- **Services Request:** a "coming next" placeholder with no data behind it. No requests table exists.
- **Account Settings:** one password card. It doesn't show which email or sign-in methods the account uses.

## Phase 0: Documentation discovery (done during planning; re-check before coding)
> **How this serves the primary goal:** every later phase reuses what already exists, so the redesign changes the layout without inventing APIs or adding dependencies.

### Allowed APIs and patterns (with sources)
- **Next 16 docs** are bundled at `node_modules/next/dist/docs/01-app/03-api-reference/` (repo root `node_modules`). `apps/web/AGENTS.md` says to read these before writing code.
  - `02-components/form.md`, `link.md`, `image.md`
  - `04-functions/revalidatePath.md`, `unstable_cache.md`, `redirect.md`
- **Server actions, unchanged:** `saveSettings`, `saveRow` and `deleteRow` in `src/app/analytics/content/actions.ts`, and `setPassword` in `src/app/loginauthentication/actions.ts`. **Do not change their form field names.**
- **Form pieces:**
  - `ConfirmSubmit` (`src/components/cms-confirm.tsx`) uses `useFormStatus` from `react-dom` for the pending state.
  - `CmsField`, `CmsStatus` and `CmsTabs` are in `src/components/cms-fields.tsx`.
  - The section metadata and its `rowLabel` are in `src/lib/cms.ts`.
- **Icons:** `lucide-react@^0.468` (already used in `dashboard-navigation.tsx`).
- **No chart library is installed. Charts are inline SVG.** Follow the `dataviz` skill (one muted series, red only for highlight, labelled axes).
- **Data access:** `createAdminClient()` from `src/lib/supabase/admin` plus `requireAdmin()` on every page. Views must be `security_invoker = true` with no anon or authenticated grants, matching `sql/portfolio_audience.sql`.
- **Tokens:** the `--db-*` variables at the top of `dashboard.css`, kept the same as the home page palette.

### Anti-patterns to avoid
- No new npm dependencies: no chart, UI kit or form library.
- Don't rename form fields or the action signatures. The CMS saves depend on them.
- Don't query raw `visitors` or `portfolio_events` rows into the page. Add an aggregate view instead.
- Don't float `legend` again.

## Phase 1: Shell and shared layout
> **How this serves the primary goal:** a compact, consistent frame puts the content and data on the first screen of every module instead of a giant title.

1. **Page header:** reduce `.dashboard-page-header h1` to about `clamp(1.8rem, 3vw, 2.6rem)`, with the eyebrow and lede on one row and an optional right-side actions slot. Add a `PageHeader({ eyebrow, title, lede, actions })` component in `src/components/dashboard-page-header.tsx` and use it in all five pages.
2. **Width:** widen `.dashboard-content` to about 1200px, with a 12-column CSS grid utility (`.db-grid`, `.db-span-4/6/8/12`) for card layouts.
3. **Sidebar:** keep the black sidebar. Add a "View site ↗" link above Modules. Rename "Services Request" to "Requests", keeping the route.
4. **Shared card styles:** one `.db-card` header style (eyebrow, h2, optional right-side meta) to replace the mix of `analytics-card` h2 and `engagement-panel-heading`. Keep the old class names as aliases until Phase 5 removes them.

**Verify:**
- Every module's first screen shows real content above the fold at 1280×720.
- `npx tsc --noEmit` and `npx eslint src` pass.

**Guards:** no route changes; `requireAdmin()` stays the first call in every page.

## Phase 2: Content module (the bug, then the layout)
> **How this serves the primary goal:** editing becomes reliable (no overlapping fields) and fast (Save always in reach, rows readable at a glance).

1. **Fix the root cause:** replace the floated legend with a normal block.
   - `.cms-group legend { float: none; display: block; width: 100%; }`
   - Drop the `clear: both` hacks from `.cms-grid`.
   - This fixes every fieldset, not only Disciplines.
2. **Site copy layout:**
   - Two columns on wide screens: a sticky in-page section list on the left (Hero, Practice, Worked with and contact, Disciplines), with anchor links to the fieldsets, and the forms on the right.
   - A sticky bottom save bar inside the form, holding `ConfirmSubmit`, "Unsaved changes" text and the status. Detect "unsaved" with a small client `onInput` listener on the form; there's no state library.
3. **Disciplines:** three cards side by side (one per slot, stacked under 900px), each with:
   - a live icon preview using the same lucide icons as the home page
   - the title input and the one-line textarea
   - the icon select
   - Field names `service_{i}_title`, `service_{i}_text` and `service_{i}_icon` don't change.
4. **List sections (Projects, Publications, IP, Experience, Capabilities):**
   - **Row summary:** a small thumbnail (projects), the title, one line of meta (status, venue, or a "live" or "proof" badge when a URL is set) and the sort order.
   - **Edit:** keep `<details>` for editing, but open it to a two-column field grid with the image field full width.
   - **New item:** "Add new" becomes a dashed card at the top of the list.
   - **Meta source:** extend `Section` in `src/lib/cms.ts` with `rowMeta?: (row) => string` and `rowImage?: (row) => string | null`.
5. **Tabs:** turn `CmsTabs` into a segmented control that scrolls horizontally on phones, with no wrapping into three lines.

**Verify:**
- At 1280×720 and 375×812, the Disciplines inputs are each at least 200px wide (phone: full width), and no labels overlap. Check with DOM `getBoundingClientRect`.
- Save each section once on the preview deployment. The values persist and the home page shows them.
- `grep -n "float: left" src/components/dashboard.css` returns nothing.

**Guards:** server actions untouched; no client-side form library; the image upload input keeps `name="{field}__file"`.

## Phase 3: Dashboard module (trend and correct metrics)
> **How this serves the primary goal:** you see whether the portfolio is working and how it changes over time, using metrics the current site still produces.

1. **SQL view:** add `sql/portfolio_daily.sql` with a `security_invoker` view, `portfolio_daily_counts(day date, visits int, downloads int, outbound int)`, covering the last 90 days.
   - It is built from `visitors.visited_at`, `resume_downloads.downloaded_at` and `portfolio_events.occurred_at` where `event_type = 'outbound_click'`.
   - Grants: `revoke all from anon, authenticated` and `grant select to service_role`, like the existing views.
   - Apply it through the Supabase MCP `apply_migration`.
2. **KPI row (4 cards):**
   - unique visitors
   - résumé downloads
   - download rate (downloads ÷ visitors)
   - engaged visits

   Each card shows a 30-day delta against the previous 30 days.
3. **Trend card (8 of 12 columns):** an inline SVG line or area chart of visits per day for 30 days, with downloads as red dots on the days they happened, labelled axes and a plain-text summary for screen readers.
4. **"What recruiters click" (4 of 12 columns):** rank projects by `live_project` plus `github_repository` clicks, not `project_open`. Show historical opens as a small grey note only if non-zero, labelled "from the previous design".
5. **Keep:**
   - outbound totals (LinkedIn, GitHub, live, repos)
   - audience (countries, cities) and devices, as two compact cards
   - the session panel
6. **Empty and error states:** the existing `countsError`, `engagementError` and `audienceError` banners move into the cards they affect, with "Try again".

**Verify:**
- `select * from portfolio_daily_counts order by day desc limit 5` returns rows through the MCP.
- The dashboard renders on the preview with real data and no console errors.
- The anon key can't read the view: `select` as anon fails.

**Guards:** no raw-row fetches into the page; no chart dependency; visitor IPs and identifiers never reach the page.

## Phase 4: Requests and Account modules
> **How this serves the primary goal:** no module looks broken or unfinished to you, and account access is clear.

1. **Requests:** replace the placeholder with an honest empty-state layout. It explains that enquiries arrive by email today, links `mailto:` the profile email and links back to the Contact section. It reserves the space where a request list would go.
2. **Account Settings:** two cards side by side.
   - **"Your account":** the email, the sign-in methods (Google and/or email password, from `user.app_metadata.providers`) and the last sign-in time (`user.last_sign_in_at`).
   - **"Password":** the existing `setPassword` form, unchanged field names, with the rules listed (12+ characters, must match) and a show/hide toggle.
   - Read the user from the value `requireAdmin()` already returns (`src/app/analytics/layout.tsx:10`). Check its return type before relying on these fields.

**Verify:**
- Both pages render at 1280 and 375 widths.
- A wrong confirmation still shows the existing "invalid" message.

**Guards:** no new auth calls beyond what `requireAdmin` or `getUser` already provide; the 10-minute reauth rule is unchanged.

## Phase 5: Verification
> **How this serves the primary goal:** proves the workspace is reliable before it reaches main.

1. `npx tsc --noEmit`, `npx eslint src` and `npx next build` all pass.
2. Browser pass on the Vercel preview, signed in, at 1280×720, 1440×900 and 375×812, for every module:
   - no horizontal overflow (`scrollWidth <= innerWidth`)
   - no overlapping labels (the Disciplines check from Phase 2)
   - visible focus rings
   - the save bar never covers the last field
3. Run one real save in each CMS section and confirm it on the home page.
4. Grep the CSS for the removed legacy classes (`engagement-panel-heading`, `analytics-grid`). Delete any that are unused. Keep `analytics-*` classes still used by the sign-in page.
5. Commit to `new-design` only. Merge to main only on your explicit approval.

## Not now
- A service-request intake form and its table.
- Date-range pickers or CSV export.
- Dark mode for the admin workspace.
- Drag-and-drop row reordering (sort order stays a number field).
