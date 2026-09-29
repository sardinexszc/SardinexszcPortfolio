-- Approximate visit engagement and coarse audience attributes.
-- No IP address, full user agent, or precise coordinates are stored.
create table if not exists public.portfolio_sessions (
  session_id uuid primary key,
  visitor_id uuid not null references public.visitors(visitor_id),
  site_host text not null check (length(site_host) between 1 and 253),
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  active_seconds integer not null default 0 check (active_seconds between 0 and 86400),
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  city text check (length(city) <= 80),
  device_type text not null check (device_type in ('Desktop', 'Mobile', 'Tablet', 'Other')),
  browser text not null check (browser in ('Chrome', 'Safari', 'Firefox', 'Edge', 'Other'))
);
create index if not exists portfolio_sessions_host_started_idx
  on public.portfolio_sessions (site_host, started_at desc);
alter table public.portfolio_sessions enable row level security;
revoke all on public.portfolio_sessions from public, anon, authenticated;
grant select, insert, update on public.portfolio_sessions to service_role;

alter table public.portfolio_events add column if not exists session_id uuid;
create index if not exists portfolio_events_session_idx on public.portfolio_events (session_id);

create or replace view public.portfolio_location_counts with (security_invoker = true) as
  select site_host, coalesce(country_code, 'Unknown') as country_code,
    coalesce(city, 'Unknown') as city, count(*)::bigint as visits
  from public.portfolio_sessions
  group by site_host, country_code, city;
create or replace view public.portfolio_device_counts with (security_invoker = true) as
  select site_host, device_type, browser, count(*)::bigint as visits
  from public.portfolio_sessions
  group by site_host, device_type, browser;
create or replace view public.portfolio_session_summary with (security_invoker = true) as
  select site_host, count(*)::bigint as visits,
    coalesce(round(avg(active_seconds))::integer, 0) as average_active_seconds,
    count(*) filter (where active_seconds >= 10 or exists (
      select 1 from public.portfolio_events e where e.session_id = s.session_id
    ))::bigint as engaged_visits
  from public.portfolio_sessions s
  group by site_host;
revoke all on public.portfolio_location_counts, public.portfolio_device_counts,
  public.portfolio_session_summary from public, anon, authenticated;
grant select on public.portfolio_location_counts, public.portfolio_device_counts,
  public.portfolio_session_summary to service_role;
