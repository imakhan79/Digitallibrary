-- Expand profiles.role to the full role taxonomy and enforce admin-tier
-- write access at the database level via RLS.

alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles alter column role set default 'researcher';

update public.profiles set role = 'researcher' where role = 'member';
update public.profiles set role = 'super_admin' where role = 'admin';

alter table public.profiles add constraint profiles_role_check check (
  role in (
    'super_admin', 'library_admin', 'content_manager', 'digitization_manager',
    'metadata_librarian', 'researcher', 'librarian', 'reviewer_qc',
    'exhibition_curator', 'contributor', 'institutional_user'
  )
);

create schema if not exists private;

create or replace function private.is_admin_tier()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
    and role in ('super_admin', 'library_admin')
  );
$$;

revoke execute on function private.is_admin_tier() from public, anon, authenticated;
grant execute on function private.is_admin_tier() to authenticated;

create policy books_admin_write on public.books
  for all to authenticated
  using ((select private.is_admin_tier()))
  with check ((select private.is_admin_tier()));

create policy authors_admin_write on public.authors
  for all to authenticated
  using ((select private.is_admin_tier()))
  with check ((select private.is_admin_tier()));

create policy categories_admin_write on public.categories
  for all to authenticated
  using ((select private.is_admin_tier()))
  with check ((select private.is_admin_tier()));
