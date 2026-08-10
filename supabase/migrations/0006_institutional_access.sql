-- Institutional users: institution-scoped access, request-access workflow,
-- and saved searches.

alter table public.profiles add column institution text;

alter table public.books add column access_level text not null default 'public'
  check (access_level in ('public', 'restricted'));

create table public.access_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  book_id bigint not null references public.books (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create index access_requests_user_id_idx on public.access_requests (user_id);
create index access_requests_book_id_idx on public.access_requests (book_id);

alter table public.access_requests enable row level security;

create policy access_requests_select on public.access_requests
  for select to authenticated
  using ((select auth.uid()) = user_id or (select private.is_admin_tier()));

create policy access_requests_insert_own on public.access_requests
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy access_requests_admin_update on public.access_requests
  for update to authenticated
  using ((select private.is_admin_tier()))
  with check ((select private.is_admin_tier()));

-- Allow a user to re-request access on their own denied/pending row
-- (but never to set it to 'approved' themselves).
create policy access_requests_user_reset on public.access_requests
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and status = 'pending');

create table public.saved_searches (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  query text,
  category_id bigint references public.categories (id) on delete set null,
  language text,
  created_at timestamptz not null default now()
);

create index saved_searches_user_id_idx on public.saved_searches (user_id);
alter table public.saved_searches enable row level security;

create policy saved_searches_own on public.saved_searches
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
