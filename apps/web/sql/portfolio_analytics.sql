-- Apply in the SQL editor of the dedicated portfolio Supabase project.
-- Only the server-side secret key may read or write analytics tables.
create table if not exists public.visitors (
  visitor_id uuid primary key,
  visited_at timestamptz not null default now()
);
create table if not exists public.resume_downloads (
  id bigint generated always as identity primary key,
  downloaded_at timestamptz not null default now()
);
create index if not exists resume_downloads_downloaded_at_idx
  on public.resume_downloads (downloaded_at desc);

alter table public.visitors enable row level security;
alter table public.resume_downloads enable row level security;
revoke all on public.visitors, public.resume_downloads from anon, authenticated;
revoke all on sequence public.resume_downloads_id_seq from anon, authenticated;
-- No public RLS policies. The secret key is used only in server-side routes.
grant select, insert on public.visitors, public.resume_downloads to service_role;
grant usage, select on sequence public.resume_downloads_id_seq to service_role;
