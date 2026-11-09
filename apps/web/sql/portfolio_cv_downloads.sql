-- Apply in the SQL editor of the portfolio Supabase project, after portfolio_analytics.sql.
-- Counts full-CV downloads separately from résumé downloads. Same access rules as resume_downloads:
-- only the server-side secret key may read or write it.
create table if not exists public.cv_downloads (
  id bigint generated always as identity primary key,
  downloaded_at timestamptz not null default now()
);
create index if not exists cv_downloads_downloaded_at_idx
  on public.cv_downloads (downloaded_at desc);

alter table public.cv_downloads enable row level security;
revoke all on public.cv_downloads from anon, authenticated;
revoke all on sequence public.cv_downloads_id_seq from anon, authenticated;
-- No public RLS policies. The secret key is used only in server-side routes.
grant select, insert on public.cv_downloads to service_role;
grant usage, select on sequence public.cv_downloads_id_seq to service_role;
