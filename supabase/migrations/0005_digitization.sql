-- Real digitization workflow: Pending -> Scanning -> OCR -> Metadata -> Quality Control -> Published

create table public.digitization_jobs (
  id bigint generated always as identity primary key,
  book_id bigint not null references public.books (id) on delete cascade,
  status text not null default 'pending' check (
    status in ('pending', 'scanning', 'ocr', 'metadata', 'quality_control', 'published')
  ),
  operator text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  deadline date,
  notes text,
  created_at timestamptz not null default now()
);

create index digitization_jobs_book_id_idx on public.digitization_jobs (book_id);
create index digitization_jobs_status_idx on public.digitization_jobs (status);

alter table public.digitization_jobs enable row level security;

create or replace function private.can_manage_digitization()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
    and role in ('super_admin', 'library_admin', 'digitization_manager')
  );
$$;

revoke execute on function private.can_manage_digitization() from public, anon, authenticated;
grant execute on function private.can_manage_digitization() to authenticated;

create policy digitization_jobs_manage on public.digitization_jobs
  for all to authenticated
  using ((select private.can_manage_digitization()))
  with check ((select private.can_manage_digitization()));
