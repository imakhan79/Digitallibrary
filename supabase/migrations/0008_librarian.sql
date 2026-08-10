-- Librarian: curate collections, review access requests, recommend resources,
-- and escalate content issues to the content team.

create or replace function private.can_manage_collections()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
    and role in ('super_admin', 'library_admin', 'content_manager', 'metadata_librarian', 'librarian')
  );
$$;

revoke execute on function private.can_manage_collections() from public, anon, authenticated;
grant execute on function private.can_manage_collections() to authenticated;

drop policy collections_content_write on public.collections;
create policy collections_curate_write on public.collections
  for all to authenticated
  using ((select private.can_manage_collections()))
  with check ((select private.can_manage_collections()));

drop policy collection_books_content_write on public.collection_books;
create policy collection_books_curate_write on public.collection_books
  for all to authenticated
  using ((select private.can_manage_collections()))
  with check ((select private.can_manage_collections()));

create or replace function private.can_review_requests()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
    and role in ('super_admin', 'library_admin', 'librarian')
  );
$$;

revoke execute on function private.can_review_requests() from public, anon, authenticated;
grant execute on function private.can_review_requests() to authenticated;

drop policy access_requests_select on public.access_requests;
create policy access_requests_select on public.access_requests
  for select to authenticated
  using ((select auth.uid()) = user_id or (select private.can_review_requests()));

drop policy access_requests_admin_update on public.access_requests;
create policy access_requests_reviewer_update on public.access_requests
  for update to authenticated
  using ((select private.can_review_requests()))
  with check ((select private.can_review_requests()));

create table public.recommendations (
  book_id bigint primary key references public.books (id) on delete cascade,
  recommended_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.recommendations enable row level security;
create policy recommendations_public_read on public.recommendations for select to anon, authenticated using (true);
create policy recommendations_write on public.recommendations for all to authenticated
  using ((select private.can_manage_collections()))
  with check ((select private.can_manage_collections()));

create table public.content_flags (
  id bigint generated always as identity primary key,
  book_id bigint not null references public.books (id) on delete cascade,
  reported_by uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);
create index content_flags_book_id_idx on public.content_flags (book_id);
alter table public.content_flags enable row level security;

create policy content_flags_insert_own on public.content_flags
  for insert to authenticated
  with check ((select auth.uid()) = reported_by);

create policy content_flags_select on public.content_flags
  for select to authenticated
  using (
    (select auth.uid()) = reported_by
    or (select private.can_manage_content())
    or (select private.can_manage_collections())
  );

create policy content_flags_resolve on public.content_flags
  for update to authenticated
  using ((select private.can_manage_content()) or (select private.can_manage_collections()))
  with check ((select private.can_manage_content()) or (select private.can_manage_collections()));
