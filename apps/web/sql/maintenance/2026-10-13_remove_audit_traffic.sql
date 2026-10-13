-- One-off cleanup: remove analytics rows created by the portfolio audit on 2026-10-13
-- (two resume test downloads, two Lighthouse runs, and in-app browser checks).
-- All audit traffic against the live site happened between 10:12 and 10:21 UTC
-- (18:12–18:21 Philippine time). Bot filtering in /api/track-visit prevents this going forward.
--
-- HOW TO USE (Supabase SQL editor):
--   1. Run the PREVIEW block. Expect about 2 resume downloads and 2–4 sessions/visitors.
--      If you or a real visitor also used the site in this window, those rows appear too.
--      Narrow the window or skip the cleanup if anything looks like real traffic.
--   2. Run the CLEANUP block as-is. It ends in ROLLBACK, so nothing is deleted; check the counts.
--   3. Change ROLLBACK to COMMIT and run it again to apply.

-- PREVIEW ----------------------------------------------------------------
select 'resume_downloads' as source, count(*) from public.resume_downloads
  where downloaded_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00'
union all
select 'portfolio_sessions', count(*) from public.portfolio_sessions
  where started_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00'
union all
select 'visitors (first seen)', count(*) from public.visitors
  where visited_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00'
union all
select 'portfolio_events', count(*) from public.portfolio_events
  where occurred_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00';

select session_id, started_at, active_seconds, country_code, city, device_type, browser
  from public.portfolio_sessions
  where started_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00'
  order by started_at;

-- CLEANUP ----------------------------------------------------------------
begin;

delete from public.portfolio_events
  where occurred_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00';

delete from public.portfolio_sessions
  where started_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00';

-- Only visitors first seen in the window and with no remaining sessions.
delete from public.visitors v
  where v.visited_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00'
    and not exists (select 1 from public.portfolio_sessions s where s.visitor_id = v.visitor_id);

delete from public.resume_downloads
  where downloaded_at between '2026-10-13 10:12:00+00' and '2026-10-13 10:21:00+00';

rollback; -- change to COMMIT after reviewing the preview
