-- Digital Library World: core schema (profiles, catalog, bookmarks)

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create table public.authors (
  id bigint generated always as identity primary key,
  name text not null
);

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  resource_type text not null check (
    resource_type in ('book', 'manuscript', 'journal', 'thesis', 'archive')
  )
);

create table public.books (
  id bigint generated always as identity primary key,
  title text not null,
  author_id bigint references public.authors (id) on delete set null,
  category_id bigint references public.categories (id) on delete set null,
  isbn text,
  description text,
  cover_url text,
  language text,
  published_year integer,
  resource_type text not null default 'book' check (
    resource_type in ('book', 'manuscript', 'journal', 'thesis', 'archive')
  ),
  created_at timestamptz not null default now()
);

create index books_author_id_idx on public.books (author_id);
create index books_category_id_idx on public.books (category_id);

create table public.bookmarks (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  book_id bigint not null references public.books (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create index bookmarks_user_id_idx on public.bookmarks (user_id);
create index bookmarks_book_id_idx on public.bookmarks (book_id);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.books enable row level security;
alter table public.bookmarks enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id);

create policy authors_public_read on public.authors
  for select to anon, authenticated
  using (true);

create policy categories_public_read on public.categories
  for select to anon, authenticated
  using (true);

create policy books_public_read on public.books
  for select to anon, authenticated
  using (true);

create policy bookmarks_select_own on public.bookmarks
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy bookmarks_insert_own on public.bookmarks
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy bookmarks_delete_own on public.bookmarks
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Seed data
insert into public.authors (name) values
  ('Mir Amman'), ('Mirza Ghalib'), ('Altaf Hussain Hali'), ('Unknown Scribe'),
  ('Various Authors'), ('Dr. Jameel Jalibi'), ('Punjab Archive Board'), ('Allama Iqbal');

insert into public.categories (name, resource_type) values
  ('Classical Fiction', 'book'), ('Poetry', 'book'), ('Literary Criticism', 'book'),
  ('Historical Manuscripts', 'manuscript'), ('Academic Journals', 'journal'),
  ('Research', 'thesis'), ('Archives', 'archive');

insert into public.books (title, author_id, category_id, description, cover_url, language, published_year, resource_type)
select
  v.title, a.id, c.id, v.description, v.cover_url, v.language, v.published_year, v.resource_type
from (
  values
    ('Bagh-o-Bahar', 'Mir Amman', 'Classical Fiction', 'One of the earliest and most celebrated works of Urdu prose fiction.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop', 'Urdu', 1804, 'book'),
    ('Diwan-e-Ghalib', 'Mirza Ghalib', 'Poetry', 'The definitive collection of ghazals by the master poet Mirza Ghalib.', 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?q=80&w=600&auto=format&fit=crop', 'Urdu', 1841, 'book'),
    ('Muqaddama-e-Sher-o-Shayari', 'Altaf Hussain Hali', 'Literary Criticism', 'A foundational text of modern Urdu literary criticism.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop', 'Urdu', 1893, 'book'),
    ('Firdaus-i-Tavarikh Manuscript', 'Unknown Scribe', 'Historical Manuscripts', 'A richly illuminated Persian chronicle preserved for centuries.', 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=600&auto=format&fit=crop', 'Persian', 1650, 'manuscript'),
    ('Journal of South Asian Literature', 'Various Authors', 'Academic Journals', 'Peer-reviewed research on South Asian literary traditions.', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop', 'English', 1998, 'journal'),
    ('Urdu Criticism 1950-2000', 'Dr. Jameel Jalibi', 'Research', 'A landmark doctoral thesis surveying five decades of Urdu criticism.', 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop', 'Urdu', 1985, 'thesis'),
    ('Colonial Punjab Land Records', 'Punjab Archive Board', 'Archives', 'Preserved administrative records from colonial-era Punjab.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop', 'English', 1912, 'archive'),
    ('Kulliyat-e-Iqbal', 'Allama Iqbal', 'Poetry', 'The complete poetic works of the philosopher-poet Allama Iqbal.', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=600&auto=format&fit=crop', 'Urdu', 1935, 'book')
) as v(title, author_name, category_name, description, cover_url, language, published_year, resource_type)
join public.authors a on a.name = v.author_name
join public.categories c on c.name = v.category_name;
