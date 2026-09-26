-- Additional portfolio engagement metrics. Apply to the existing Supabase project.
-- The public API does not receive access; server routes write events with the secret key.
create table if not exists public.portfolio_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('project_open', 'outbound_click')),
  project_id integer,
  link_kind text check (link_kind in ('live_project', 'github_repository', 'github_profile', 'linkedin_profile')),
  site_host text not null check (length(site_host) between 1 and 253),
  occurred_at timestamptz not null default now(),
  constraint portfolio_event_fields_check check (
    (event_type = 'project_open' and project_id is not null and link_kind is null)
    or (event_type = 'outbound_click' and link_kind in ('live_project', 'github_repository') and project_id is not null)
    or (event_type = 'outbound_click' and link_kind in ('github_profile', 'linkedin_profile') and project_id is null)
  )
);
create index if not exists portfolio_events_host_occurred_idx
  on public.portfolio_events (site_host, occurred_at desc);
create index if not exists portfolio_events_host_kind_idx
  on public.portfolio_events (site_host, event_type, project_id, link_kind);

alter table public.portfolio_events enable row level security;
revoke all on public.portfolio_events from public, anon, authenticated;
revoke all on sequence public.portfolio_events_id_seq from public, anon, authenticated;
grant select, insert on public.portfolio_events to service_role;
grant usage, select on sequence public.portfolio_events_id_seq to service_role;

create or replace view public.portfolio_event_counts with (security_invoker = true) as
  select site_host, event_type, project_id, link_kind, count(*)::bigint as total
  from public.portfolio_events
  group by site_host, event_type, project_id, link_kind;
revoke all on public.portfolio_event_counts from public, anon, authenticated;
grant select on public.portfolio_event_counts to service_role;
