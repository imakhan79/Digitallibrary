-- Metadata Librarian: subjects, identifiers, metadata status, and real collections.

create or replace function private.can_manage_content()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
    and role in ('super_admin', 'library_admin', 'content_manager', 'metadata_librarian')
  );
$$;

alter table public.books add column metadata_status text not null default 'draft'
  check (metadata_status in ('draft', 'needs_review', 'validated'));

create table public.subjects (
  id bigint generated always as identity primary key,
  name text not null unique
);
alter table public.subjects enable row level security;
create policy subjects_public_read on public.subjects for select to anon, authenticated using (true);
create policy subjects_content_write on public.subjects for all to authenticated
  using ((select private.can_manage_content())) with check ((select private.can_manage_content()));

create table public.book_subjects (
  book_id bigint not null references public.books (id) on delete cascade,
  subject_id bigint not null references public.subjects (id) on delete cascade,
  primary key (book_id, subject_id)
);
alter table public.book_subjects enable row level security;
create policy book_subjects_public_read on public.book_subjects for select to anon, authenticated using (true);
create policy book_subjects_content_write on public.book_subjects for all to authenticated
  using ((select private.can_manage_content())) with check ((select private.can_manage_content()));

create table public.identifiers (
  id bigint generated always as identity primary key,
  book_id bigint not null references public.books (id) on delete cascade,
  type text not null check (type in ('isbn', 'issn', 'doi', 'oclc', 'other')),
  value text not null
);
create index identifiers_book_id_idx on public.identifiers (book_id);
alter table public.identifiers enable row level security;
create policy identifiers_public_read on public.identifiers for select to anon, authenticated using (true);
create policy identifiers_content_write on public.identifiers for all to authenticated
  using ((select private.can_manage_content())) with check ((select private.can_manage_content()));

create table public.collections (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  language text,
  cover_url text,
  created_at timestamptz not null default now()
);
alter table public.collections enable row level security;
create policy collections_public_read on public.collections for select to anon, authenticated using (true);
create policy collections_content_write on public.collections for all to authenticated
  using ((select private.can_manage_content())) with check ((select private.can_manage_content()));

create table public.collection_books (
  collection_id bigint not null references public.collections (id) on delete cascade,
  book_id bigint not null references public.books (id) on delete cascade,
  primary key (collection_id, book_id)
);
alter table public.collection_books enable row level security;
create policy collection_books_public_read on public.collection_books for select to anon, authenticated using (true);
create policy collection_books_content_write on public.collection_books for all to authenticated
  using ((select private.can_manage_content())) with check ((select private.can_manage_content()));

insert into public.collections (title, description, language, cover_url) values
  ('Urdu Literary Heritage', 'Foundational works of Urdu prose and poetry.', 'Urdu', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop'),
  ('Rare Urdu Books', 'First editions and out-of-print treasures.', 'Urdu', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'),
  ('Historical Manuscripts', 'Hand-copied works spanning four centuries.', 'Persian / Arabic', 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=800&auto=format&fit=crop'),
  ('Research Collections', 'Theses and journals from leading scholars.', 'English / Urdu', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop');
