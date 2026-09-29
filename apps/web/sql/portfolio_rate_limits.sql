-- Shared, atomic counters for public tracking routes. Only server-side service_role may call the function.
-- Bucket IDs are keyed hashes of host, route and network address; raw addresses are never stored.
create table if not exists public.portfolio_rate_limits (
  bucket text primary key check (bucket ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default now(),
  hits integer not null default 1 check (hits > 0)
);
alter table public.portfolio_rate_limits enable row level security;
revoke all on public.portfolio_rate_limits from public, anon, authenticated;
grant select, insert, update on public.portfolio_rate_limits to service_role;

create or replace function public.consume_portfolio_limit(
  p_bucket text, p_limit integer, p_window_seconds integer
) returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  allowed boolean;
begin
  if p_bucket !~ '^[0-9a-f]{64}$' or p_limit not between 1 and 1000 or
      p_window_seconds not between 1 and 3600 then
    raise exception 'Invalid tracking limit parameters';
  end if;

  insert into public.portfolio_rate_limits as current_bucket (bucket, window_started_at, hits)
  values (p_bucket, now(), 1)
  on conflict (bucket) do update
    set window_started_at = case when current_bucket.window_started_at <= now() -
      make_interval(secs => p_window_seconds) then now() else current_bucket.window_started_at end,
        hits = case when current_bucket.window_started_at <= now() -
      make_interval(secs => p_window_seconds) then 1 else current_bucket.hits + 1 end
  where current_bucket.window_started_at <= now() - make_interval(secs => p_window_seconds)
     or current_bucket.hits < p_limit
  returning true into allowed;
  return coalesce(allowed, false);
end;
$$;
revoke all on function public.consume_portfolio_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_portfolio_limit(text, integer, integer) to service_role;
