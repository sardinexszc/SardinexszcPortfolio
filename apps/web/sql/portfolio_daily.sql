-- Daily totals for the dashboard trend: the last 90 days in Philippine time, one row per day (zeros included).
-- Aggregates only, so no visitor identifiers reach the page. Readable by service_role only, like the other views.
create or replace view public.portfolio_daily_counts with (security_invoker = true) as
  with days as (
    select ((now() at time zone 'Asia/Manila')::date - n) as day from generate_series(0, 89) as n
  ),
  visits as (
    select (visited_at at time zone 'Asia/Manila')::date as day, count(*) as total
    from public.visitors where visited_at >= now() - interval '91 days' group by 1
  ),
  downloads as (
    select (downloaded_at at time zone 'Asia/Manila')::date as day, count(*) as total
    from public.resume_downloads where downloaded_at >= now() - interval '91 days' group by 1
  ),
  outbound as (
    select (occurred_at at time zone 'Asia/Manila')::date as day, count(*) as total
    from public.portfolio_events
    where event_type = 'outbound_click' and occurred_at >= now() - interval '91 days' group by 1
  ),
  sessions as (
    select (started_at at time zone 'Asia/Manila')::date as day, count(*) as total,
      count(*) filter (where active_seconds >= 10 or exists (
        select 1 from public.portfolio_events e where e.session_id = s.session_id
      )) as engaged
    from public.portfolio_sessions s where started_at >= now() - interval '91 days' group by 1
  )
  select days.day,
    coalesce(visits.total, 0)::integer as visits,
    coalesce(downloads.total, 0)::integer as downloads,
    coalesce(outbound.total, 0)::integer as outbound,
    coalesce(sessions.total, 0)::integer as sessions,
    coalesce(sessions.engaged, 0)::integer as engaged
  from days
  left join visits using (day)
  left join downloads using (day)
  left join outbound using (day)
  left join sessions using (day);
revoke all on public.portfolio_daily_counts from public, anon, authenticated;
grant select on public.portfolio_daily_counts to service_role;
