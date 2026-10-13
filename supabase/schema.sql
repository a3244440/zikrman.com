-- ZIKRMAN: схема каталога для Supabase.
-- Выполните целиком в Supabase → SQL Editor → New query → Run.

-- 1. Администраторы --------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "admins: read own row" on public.admins;
create policy "admins: read own row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Товары ----------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  category    text not null,
  price       integer not null check (price >= 0),
  old_price   integer check (old_price is null or old_price >= 0),
  description text not null default '',
  details     text[] not null default '{}',
  sizes       text[] not null default '{}',
  colors      jsonb not null default '[]'::jsonb,
  images      text[] not null default '{}',
  is_new      boolean not null default false,
  is_featured boolean not null default false,
  in_stock    boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_order_idx on public.products (sort_order, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

drop policy if exists "products: public read" on public.products;
create policy "products: public read" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "products: admin insert" on public.products;
create policy "products: admin insert" on public.products
  for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "products: admin update" on public.products;
create policy "products: admin update" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "products: admin delete" on public.products;
create policy "products: admin delete" on public.products
  for delete to authenticated using ((select public.is_admin()));

-- 3. Хранилище фото --------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do update set public = true;

drop policy if exists "product images: admin insert" on storage.objects;
create policy "product images: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "product images: admin update" on storage.objects;
create policy "product images: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "product images: admin delete" on storage.objects;
create policy "product images: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'products' and (select public.is_admin()));

-- 4. Назначить администратора ------------------------------------------------
-- Сначала создайте пользователя: Authentication → Users → Add user (email + пароль).
-- Затем раскомментируйте и выполните, подставив его email:
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'admin@zikrman.com'
-- on conflict do nothing;
