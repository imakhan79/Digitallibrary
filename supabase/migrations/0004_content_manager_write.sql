-- Content Managers (in addition to admin-tier roles) can manage book content.

create or replace function private.can_manage_content()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
    and role in ('super_admin', 'library_admin', 'content_manager')
  );
$$;

revoke execute on function private.can_manage_content() from public, anon, authenticated;
grant execute on function private.can_manage_content() to authenticated;

drop policy books_admin_write on public.books;
create policy books_content_write on public.books
  for all to authenticated
  using ((select private.can_manage_content()))
  with check ((select private.can_manage_content()));

drop policy authors_admin_write on public.authors;
create policy authors_content_write on public.authors
  for all to authenticated
  using ((select private.can_manage_content()))
  with check ((select private.can_manage_content()));

drop policy categories_admin_write on public.categories;
create policy categories_content_write on public.categories
  for all to authenticated
  using ((select private.can_manage_content()))
  with check ((select private.can_manage_content()));
