-- ZIKR: полная настройка базы Supabase одним файлом.
-- Supabase → SQL Editor → New query → вставьте весь файл → Run.
-- Создаёт таблицы и права, хранилище фото, загружает каталог (34 товара) и администратора.
-- Файл можно выполнять повторно: ничего не задвоится.

-- ZIKR: схема каталога для Supabase.
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
  size_chart  text not null default '',
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
-- Для баз, созданных до появления таблицы размеров
alter table public.products add column if not exists size_chart text not null default '';

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

-- Чтение списка файлов нужно админу, чтобы удалять и заменять фото (сами фото и так публичны)
drop policy if exists "product images: admin read" on storage.objects;
create policy "product images: admin read" on storage.objects
  for select to authenticated using (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "product images: admin insert" on storage.objects;
create policy "product images: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "product images: admin update" on storage.objects;
create policy "product images: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "product images: admin delete" on storage.objects;
create policy "product images: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'products' and (select public.is_admin()));

-- 3½. Каталог ----------------------------------------------------------------
-- Каталог ZIKR, перенесённый с Tilda. Выполните после schema.sql, чтобы заполнить базу.
-- Фото лежат в public/images/products. Товары можно менять и удалять в админке.
insert into public.products
  (slug, name, category, price, old_price, description, details, size_chart, sizes, colors, images, is_new, is_featured, in_stock, sort_order)
values
  ('futbolka-s-kalligrafiey-temnyy-purpurno-siniy', 'Футболка с каллиграфией Темный пурпурно-синий', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмный пурпурно-синий","hex":"#2E3561"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/01.webp', '/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/02.webp', '/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/03.webp']::text[],
   false, true, true, 0),
  ('futbolka-s-kalligrafiey-akvamarinovyy', 'Футболка с каллиграфией аквамариновый', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Аквамариновый","hex":"#A9C8E6"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-akvamarinovyy/01.webp', '/images/products/futbolka-s-kalligrafiey-akvamarinovyy/02.webp', '/images/products/futbolka-s-kalligrafiey-akvamarinovyy/03.webp', '/images/products/futbolka-s-kalligrafiey-akvamarinovyy/04.webp']::text[],
   false, false, true, 1),
  ('futbolka-s-kalligrafiey-seryy', 'Футболка с каллиграфией серый', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Серый","hex":"#55575B"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-seryy/01.webp', '/images/products/futbolka-s-kalligrafiey-seryy/02.webp', '/images/products/futbolka-s-kalligrafiey-seryy/03.webp', '/images/products/futbolka-s-kalligrafiey-seryy/04.webp']::text[],
   false, false, true, 2),
  ('futbolka-s-kalligrafiey-chernyy', 'Футболка с каллиграфией черный', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-chernyy/01.webp', '/images/products/futbolka-s-kalligrafiey-chernyy/02.webp', '/images/products/futbolka-s-kalligrafiey-chernyy/03.webp']::text[],
   false, false, true, 3),
  ('futbolka-s-kalligrafiey-belyy', 'Футболка с каллиграфией белый', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Белый","hex":"#F4F3EF"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-belyy/01.webp', '/images/products/futbolka-s-kalligrafiey-belyy/02.webp', '/images/products/futbolka-s-kalligrafiey-belyy/03.webp']::text[],
   false, false, true, 4),
  ('futbolka-s-kalligrafiey-chernyy-s-belym-tekstom', 'Футболка с каллиграфией черный с белым текстом', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-chernyy-s-belym-tekstom/01.webp', '/images/products/futbolka-s-kalligrafiey-chernyy-s-belym-tekstom/02.webp', '/images/products/futbolka-s-kalligrafiey-chernyy-s-belym-tekstom/03.webp']::text[],
   false, false, true, 5),
  ('futbolka-s-kalligrafiey-belyy-s-chernym-tekstom', 'Футболка с каллиграфией белый с черным текстом', 'tshirts', 30, null, 'Футболка ZIKR с арабской каллиграфией на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Белый","hex":"#F4F3EF"}]'::jsonb, array['/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/01.webp', '/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/02.webp', '/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/03.webp', '/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/04.webp']::text[],
   false, false, true, 6),
  ('futbolka-zikr-chernyy', 'Футболка ZIKR черный', 'tshirts', 35, null, 'Футболка с логотипом ZIKR на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/futbolka-zikr-chernyy/01.webp', '/images/products/futbolka-zikr-chernyy/02.webp', '/images/products/futbolka-zikr-chernyy/03.webp']::text[],
   false, false, true, 7),
  ('futbolka-zikr-belyy', 'Футболка ZIKR белый', 'tshirts', 35, null, 'Футболка с логотипом ZIKR на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Белый","hex":"#F4F3EF"}]'::jsonb, array['/images/products/futbolka-zikr-belyy/01.webp', '/images/products/futbolka-zikr-belyy/02.webp', '/images/products/futbolka-zikr-belyy/03.webp']::text[],
   false, false, true, 8),
  ('futbolka-zikr-temnyy-purpurno-siniy', 'Футболка ZIKR Темный пурпурно-синий', 'tshirts', 35, null, 'Футболка с логотипом ZIKR на груди.',
   array[]::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмный пурпурно-синий","hex":"#2E3561"}]'::jsonb, array['/images/products/futbolka-zikr-temnyy-purpurno-siniy/01.webp', '/images/products/futbolka-zikr-temnyy-purpurno-siniy/02.webp', '/images/products/futbolka-zikr-temnyy-purpurno-siniy/03.webp']::text[],
   false, false, true, 9),
  ('kostyum-new-chernyy', 'Костюм New черный', 'casual', 70, null, 'Костюм ZIKR: куртка на молнии с воротником и брюки.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/kostyum-new-chernyy/01.webp', '/images/products/kostyum-new-chernyy/02.webp', '/images/products/kostyum-new-chernyy/03.webp', '/images/products/kostyum-new-chernyy/04.webp', '/images/products/kostyum-new-chernyy/05.webp', '/images/products/kostyum-new-chernyy/06.webp']::text[],
   true, true, true, 10),
  ('kostyum-new-belyy-verh-chernyy-niz', 'Костюм New белый верх, черный низ', 'casual', 70, null, 'Костюм ZIKR: куртка на молнии с воротником и брюки.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Белый / чёрный","hex":"#F4F3EF"}]'::jsonb, array['/images/products/kostyum-new-belyy-verh-chernyy-niz/01.webp', '/images/products/kostyum-new-belyy-verh-chernyy-niz/02.webp', '/images/products/kostyum-new-belyy-verh-chernyy-niz/03.webp', '/images/products/kostyum-new-belyy-verh-chernyy-niz/04.webp', '/images/products/kostyum-new-belyy-verh-chernyy-niz/05.webp']::text[],
   true, false, true, 11),
  ('kostyum-new-temno-siniy', 'Костюм New темно-синий', 'casual', 70, null, 'Костюм ZIKR: куртка на молнии с воротником и брюки.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмно-синий","hex":"#1F2A44"}]'::jsonb, array['/images/products/kostyum-new-temno-siniy/01.webp', '/images/products/kostyum-new-temno-siniy/02.webp', '/images/products/kostyum-new-temno-siniy/03.webp', '/images/products/kostyum-new-temno-siniy/04.webp', '/images/products/kostyum-new-temno-siniy/05.webp']::text[],
   true, false, true, 12),
  ('kostyum-bez-vorotnika-new-korichnevyy', 'Костюм без воротника New коричневый', 'casual', 70, null, 'Костюм ZIKR: куртка на молнии без воротника и брюки.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Коричневый","hex":"#5C4631"}]'::jsonb, array['/images/products/kostyum-bez-vorotnika-new-korichnevyy/01.webp', '/images/products/kostyum-bez-vorotnika-new-korichnevyy/02.webp', '/images/products/kostyum-bez-vorotnika-new-korichnevyy/03.webp', '/images/products/kostyum-bez-vorotnika-new-korichnevyy/04.webp', '/images/products/kostyum-bez-vorotnika-new-korichnevyy/05.webp', '/images/products/kostyum-bez-vorotnika-new-korichnevyy/06.webp']::text[],
   true, false, true, 13),
  ('kostyum-bez-vorotnika-new-seryy', 'Костюм без воротника New серый', 'casual', 70, null, 'Костюм ZIKR: куртка на молнии без воротника и брюки.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Серый","hex":"#55575B"}]'::jsonb, array['/images/products/kostyum-bez-vorotnika-new-seryy/01.webp', '/images/products/kostyum-bez-vorotnika-new-seryy/02.webp', '/images/products/kostyum-bez-vorotnika-new-seryy/03.webp', '/images/products/kostyum-bez-vorotnika-new-seryy/04.webp', '/images/products/kostyum-bez-vorotnika-new-seryy/05.webp', '/images/products/kostyum-bez-vorotnika-new-seryy/06.webp']::text[],
   true, false, true, 14),
  ('kostyum-bez-vorotnika-new-chernyy', 'Костюм без воротника New черный', 'casual', 70, null, 'Костюм ZIKR: куртка на молнии без воротника и брюки.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/kostyum-bez-vorotnika-new-chernyy/01.webp', '/images/products/kostyum-bez-vorotnika-new-chernyy/02.webp', '/images/products/kostyum-bez-vorotnika-new-chernyy/03.webp', '/images/products/kostyum-bez-vorotnika-new-chernyy/04.webp', '/images/products/kostyum-bez-vorotnika-new-chernyy/05.webp', '/images/products/kostyum-bez-vorotnika-new-chernyy/06.webp']::text[],
   true, false, true, 15),
  ('shtany-holodok-chernyy', 'Штаны холодок черный', 'pants', 35, null, 'Лёгкие летние штаны ZIKR из ткани «холодок».',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/shtany-holodok-chernyy/01.webp', '/images/products/shtany-holodok-chernyy/02.webp', '/images/products/shtany-holodok-chernyy/03.webp', '/images/products/shtany-holodok-chernyy/04.webp', '/images/products/shtany-holodok-chernyy/05.webp']::text[],
   false, true, true, 16),
  ('shtany-holodok-temno-siniy', 'Штаны холодок темно-синий', 'pants', 35, null, 'Лёгкие летние штаны ZIKR из ткани «холодок».',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмно-синий","hex":"#1F2A44"}]'::jsonb, array['/images/products/shtany-holodok-temno-siniy/01.webp', '/images/products/shtany-holodok-temno-siniy/02.webp', '/images/products/shtany-holodok-temno-siniy/03.webp', '/images/products/shtany-holodok-temno-siniy/04.webp', '/images/products/shtany-holodok-temno-siniy/05.webp']::text[],
   false, false, true, 17),
  ('shtany-chernyy-holodok-s-karmanami', 'Штаны черный холодок с карманами', 'pants', 35, null, 'Лёгкие летние штаны ZIKR из ткани «холодок» с накладными карманами.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/shtany-chernyy-holodok-s-karmanami/01.webp', '/images/products/shtany-chernyy-holodok-s-karmanami/02.webp', '/images/products/shtany-chernyy-holodok-s-karmanami/03.webp']::text[],
   false, false, true, 18),
  ('shtany-korichnevyy-holodok-s-karmanami', 'Штаны коричневый холодок с карманами', 'pants', 35, null, 'Лёгкие летние штаны ZIKR из ткани «холодок» с накладными карманами.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Коричневый","hex":"#5C4631"}]'::jsonb, array['/images/products/shtany-korichnevyy-holodok-s-karmanami/01.webp', '/images/products/shtany-korichnevyy-holodok-s-karmanami/02.webp', '/images/products/shtany-korichnevyy-holodok-s-karmanami/03.webp']::text[],
   false, false, true, 19),
  ('premium-casual', 'Премиум Casual', 'casual', 70, null, 'Костюм ZIKR из коллекции Casual: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».',
   array['Цвет: темно-синий и серый', 'Сделано в Турции', 'Размеры: М(48) - 4XL(58)', 'Сезон: весна–осень']::text[], 'М - 48 - Премиум Casual
Обхват груди: 114 см
Обхват талии: 114 см
Обхват бедер - 100 см
Длина куртки по спинке - 75 см
Длина брюк от пояса - 95 см

L - 50 - Премиум Casual
Обхват груди: 118 см
Обхват талии: 118 см
Обхват бедер - 120 см
Длина куртки по спинке - 75 см
Длина брюк от пояса - 95 см

XL - 52 - Премиум Casual
Обхват груди: 120 см
Обхват талии: 120 см
Обхват бедер - 120 см
Длина куртки по спинке - 78 см
Длина брюк от пояса - 97 см

XXL - 54 - Премиум Casual
Обхват груди: 124 см
Обхват талии: 124 см
Обхват бедер - 120 см
Длина куртки по спинке - 78 см
Длина брюк от пояса - 98 см

XXXL - 56 - Премиум Casual
Обхват груди: 128 см
Обхват талии: 128 см
Обхват бедер - 132 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 99 см

XXXXL - 58 - Премиум Casual
Обхват груди: 136 см
Обхват талии: 136 см
Обхват бедер - 132 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 101 см', array['M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмно-синий","hex":"#1F2A44"}]'::jsonb, array['/images/products/premium-casual/01.webp', '/images/products/premium-casual/02.webp', '/images/products/premium-casual/03.webp', '/images/products/premium-casual/04.webp', '/images/products/premium-casual/05.webp', '/images/products/premium-casual/06.webp']::text[],
   false, true, true, 20),
  ('casual-grey', 'Casual Grey', 'casual', 70, null, 'Костюм ZIKR из коллекции Casual: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».',
   array['Цвет: темно-синий и серый', 'Сделано в Турции', 'Размеры: М(48) - 4XL(58)', 'Сезон: весна–осень']::text[], 'М - 48 - Премиум Casual
Обхват груди: 114 см
Обхват талии: 114 см
Обхват бедер - 100 см
Длина куртки по спинке - 75 см
Длина брюк от пояса - 95 см

L - 50 - Премиум Casual
Обхват груди: 118 см
Обхват талии: 118 см
Обхват бедер - 120 см
Длина куртки по спинке - 75 см
Длина брюк от пояса - 95 см

XL - 52 - Премиум Casual
Обхват груди: 120 см
Обхват талии: 120 см
Обхват бедер - 120 см
Длина куртки по спинке - 78 см
Длина брюк от пояса - 97 см

XXL - 54 - Премиум Casual
Обхват груди: 124 см
Обхват талии: 124 см
Обхват бедер - 120 см
Длина куртки по спинке - 78 см
Длина брюк от пояса - 98 см

XXXL - 56 - Премиум Casual
Обхват груди: 128 см
Обхват талии: 128 см
Обхват бедер - 132 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 99 см

XXXXL - 58 - Премиум Casual
Обхват груди: 136 см
Обхват талии: 136 см
Обхват бедер - 132 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 101 см', array['M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмно-синий / серый","hex":"#5B5F6B"}]'::jsonb, array['/images/products/casual-grey/01.webp', '/images/products/casual-grey/02.webp', '/images/products/casual-grey/03.webp', '/images/products/casual-grey/04.webp', '/images/products/casual-grey/05.webp', '/images/products/casual-grey/06.webp', '/images/products/casual-grey/07.webp', '/images/products/casual-grey/08.webp', '/images/products/casual-grey/09.webp', '/images/products/casual-grey/10.webp', '/images/products/casual-grey/11.webp']::text[],
   false, false, true, 21),
  ('premium-sport', 'Премиум Sport', 'sport', 70, null, 'Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».',
   array['Сезон: весна–осень']::text[], 'М - 48 - Премиум Sport
Обхват груди: 108 см
Длина руки: 68
Обхват талии: 108 см
Обхват бедер - 98 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 100 см

L - 50 - Премиум Sport
Обхват груди: 110 см
Длина руки: 70
Обхват талии: 110 см
Обхват бедер - 118 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 102 см

XL - 52 - Премиум Sport
Обхват груди: 116 см
Длина руки: 70
Обхват талии: 116 см
Обхват бедер - 120 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 103 см

XXL - 54 - Премиум Sport
Обхват груди: 120 см
Длина руки: 72
Обхват талии: 120 см
Обхват бедер - 124 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 108 см

XXXL - 56 - Премиум Sport
Обхват груди: 122 см
Длина руки: 71
Обхват талии: 122 см
Обхват бедер - 120 см
Длина куртки по спинке - 78 см
Длина брюк от пояса - 109 см

XXXXL - 58 - Премиум Sport
Обхват груди: 124 см
Длина руки: 69
Обхват талии: 124 см
Обхват бедер - 126 см
Длина куртки по спинке - 76 см
Длина брюк от пояса - 106 см', array['M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/premium-sport/01.webp', '/images/products/premium-sport/02.webp', '/images/products/premium-sport/03.webp', '/images/products/premium-sport/04.webp', '/images/products/premium-sport/05.webp', '/images/products/premium-sport/06.webp', '/images/products/premium-sport/07.webp', '/images/products/premium-sport/08.webp', '/images/products/premium-sport/09.webp', '/images/products/premium-sport/10.webp', '/images/products/premium-sport/11.webp', '/images/products/premium-sport/12.webp']::text[],
   false, true, true, 22),
  ('elite-sport', 'Elite Sport', 'sport', 70, null, 'Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».',
   array['Сезон: весна–осень']::text[], 'М - 48 - Elite Sport
Обхват груди: 108 см
Обхват талии: 108 см
Обхват бедер - 106 см
Длина куртки по спинке - 76 см
Длина брюк от пояса - 95 см

L - 50 - Elite Sport
Обхват груди: 114 см
Обхват талии: 114 см
Обхват бедер - 124 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 95 см

XL - 52 - Elite Sport
Обхват груди: 118 см
Обхват талии: 118 см
Обхват бедер - 118 см
Длина куртки по спинке - 75 см
Длина брюк от пояса - 95 см

XXL - 54 - Elite Sport
Обхват груди: 118 см
Обхват талии: 118 см
Обхват бедер - 124 см
Длина куртки по спинке - 78 см
Длина брюк от пояса - 99 см

XXXL - 56 - Elite Sport
Обхват груди: 126 см
Обхват талии: 126 см
Обхват бедер - 124 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 98 см

XXXXL - 58 - Elite Sport
Обхват груди: 132 см
Обхват талии: 132 см
Обхват бедер - 132 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 96 см', array['M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Тёмно-синий","hex":"#1F2A44"}]'::jsonb, array['/images/products/elite-sport/01.webp', '/images/products/elite-sport/02.webp', '/images/products/elite-sport/03.webp', '/images/products/elite-sport/04.webp', '/images/products/elite-sport/05.webp', '/images/products/elite-sport/06.webp', '/images/products/elite-sport/07.webp', '/images/products/elite-sport/08.webp', '/images/products/elite-sport/09.webp', '/images/products/elite-sport/10.webp', '/images/products/elite-sport/11.webp', '/images/products/elite-sport/12.webp']::text[],
   false, true, true, 23),
  ('prime-sport', 'Prime Sport', 'sport', 70, null, 'Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».',
   array['Сезон: весна–осень']::text[], 'М - 48 - Prime Sport
Обхват груди: 115 см
Обхват талии: 115 см
Обхват бедер - 102 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 100 см

L - 50 - Prime Sport
Обхват груди: 116 см
Обхват талии: 116 см
Обхват бедер - 122 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 102 см

XL - 52 - Prime Sport
Обхват груди: 120 см
Обхват талии: 120 см
Обхват бедер - 120 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 103 см

XXL - 54 - Prime Sport
Обхват груди: 120 см
Обхват талии: 120 см
Обхват бедер - 120 см
Длина куртки по спинке - 81 см
Длина брюк от пояса - 103 см

XXXL - 56 - Prime Sport
Обхват груди: 126 см
Обхват талии: 126 см
Обхват бедер - 124 см
Длина куртки по спинке - 81 см
Длина брюк от пояса - 108 см

XXXXL - 58 - Prime Sport
Обхват груди: 132 см
Обхват талии: 132 см
Обхват бедер - 132 см
Длина куртки по спинке - 82 см
Длина брюк от пояса - 105 см', array['M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Бежево-серый","hex":"#9C948A"}]'::jsonb, array['/images/products/prime-sport/01.webp', '/images/products/prime-sport/02.webp', '/images/products/prime-sport/03.webp', '/images/products/prime-sport/04.webp', '/images/products/prime-sport/05.webp', '/images/products/prime-sport/06.webp', '/images/products/prime-sport/07.webp', '/images/products/prime-sport/08.webp', '/images/products/prime-sport/09.webp']::text[],
   false, false, true, 24),
  ('prime-sport-grey', 'Prime Sport Grey', 'sport', 70, null, 'Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».',
   array['Сезон: весна–осень']::text[], 'М - 48 - Prime Sport
Обхват груди: 115 см
Обхват талии: 115 см
Обхват бедер - 102 см
Длина куртки по спинке - 77 см
Длина брюк от пояса - 100 см

L - 50 - Prime Sport
Обхват груди: 116 см
Обхват талии: 116 см
Обхват бедер - 122 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 102 см

XL - 52 - Prime Sport
Обхват груди: 120 см
Обхват талии: 120 см
Обхват бедер - 120 см
Длина куртки по спинке - 79 см
Длина брюк от пояса - 103 см

XXL - 54 - Prime Sport
Обхват груди: 120 см
Обхват талии: 120 см
Обхват бедер - 120 см
Длина куртки по спинке - 81 см
Длина брюк от пояса - 103 см

XXXL - 56 - Prime Sport
Обхват груди: 126 см
Обхват талии: 126 см
Обхват бедер - 124 см
Длина куртки по спинке - 81 см
Длина брюк от пояса - 108 см

XXXXL - 58 - Prime Sport
Обхват груди: 132 см
Обхват талии: 132 см
Обхват бедер - 132 см
Длина куртки по спинке - 82 см
Длина брюк от пояса - 105 см', array['M', 'L', 'XL', '2XL', '3XL', '4XL']::text[], '[{"name":"Серый","hex":"#8C8C8C"}]'::jsonb, array['/images/products/prime-sport-grey/01.webp', '/images/products/prime-sport-grey/02.webp', '/images/products/prime-sport-grey/03.webp', '/images/products/prime-sport-grey/04.webp', '/images/products/prime-sport-grey/05.webp', '/images/products/prime-sport-grey/06.webp', '/images/products/prime-sport-grey/07.webp', '/images/products/prime-sport-grey/08.webp', '/images/products/prime-sport-grey/09.webp', '/images/products/prime-sport-grey/10.webp', '/images/products/prime-sport-grey/11.webp', '/images/products/prime-sport-grey/12.webp', '/images/products/prime-sport-grey/13.webp']::text[],
   false, false, true, 25),
  ('futbolka-zikr-belaya', 'Футболка zikr белая', 'tshirts', 25, null, 'Базовая футболка ZIKR свободного кроя.',
   array[]::text[], '', array['M', 'L', 'XL']::text[], '[{"name":"Белый","hex":"#F4F3EF"}]'::jsonb, array['/images/products/futbolka-zikr-belaya/01.webp', '/images/products/futbolka-zikr-belaya/02.webp', '/images/products/futbolka-zikr-belaya/03.webp', '/images/products/futbolka-zikr-belaya/04.webp', '/images/products/futbolka-zikr-belaya/05.webp', '/images/products/futbolka-zikr-belaya/06.webp', '/images/products/futbolka-zikr-belaya/07.webp', '/images/products/futbolka-zikr-belaya/08.webp']::text[],
   false, false, true, 26),
  ('futbolka-zikr-chernaya', 'Футболка zikr черная', 'tshirts', 25, null, 'Базовая футболка ZIKR свободного кроя.',
   array[]::text[], '', array['M', 'L', 'XL']::text[], '[{"name":"Чёрный","hex":"#111111"}]'::jsonb, array['/images/products/futbolka-zikr-chernaya/01.webp', '/images/products/futbolka-zikr-chernaya/02.webp', '/images/products/futbolka-zikr-chernaya/03.webp', '/images/products/futbolka-zikr-chernaya/04.webp', '/images/products/futbolka-zikr-chernaya/05.webp', '/images/products/futbolka-zikr-chernaya/06.webp']::text[],
   false, false, true, 27),
  ('futbolka-zikr-bezhevaya', 'Футболка zikr бежевая', 'tshirts', 25, null, 'Базовая футболка ZIKR свободного кроя.',
   array[]::text[], '', array['M', 'L', 'XL']::text[], '[{"name":"Бежевый","hex":"#D3C6B1"}]'::jsonb, array['/images/products/futbolka-zikr-bezhevaya/01.webp', '/images/products/futbolka-zikr-bezhevaya/02.webp', '/images/products/futbolka-zikr-bezhevaya/03.webp', '/images/products/futbolka-zikr-bezhevaya/04.webp', '/images/products/futbolka-zikr-bezhevaya/05.webp', '/images/products/futbolka-zikr-bezhevaya/06.webp', '/images/products/futbolka-zikr-bezhevaya/07.webp']::text[],
   false, false, true, 28),
  ('futbolka-zikr-korichnevaya', 'Футболка zikr коричневая', 'tshirts', 25, null, 'Базовая футболка ZIKR свободного кроя.',
   array[]::text[], '', array['M', 'L', 'XL']::text[], '[{"name":"Коричневый","hex":"#5C4631"}]'::jsonb, array['/images/products/futbolka-zikr-korichnevaya/01.webp', '/images/products/futbolka-zikr-korichnevaya/02.webp', '/images/products/futbolka-zikr-korichnevaya/03.webp', '/images/products/futbolka-zikr-korichnevaya/04.webp', '/images/products/futbolka-zikr-korichnevaya/05.webp', '/images/products/futbolka-zikr-korichnevaya/06.webp', '/images/products/futbolka-zikr-korichnevaya/07.webp']::text[],
   false, false, true, 29),
  ('futbolka-zikr-zelenaya', 'Футболка zikr зеленая', 'tshirts', 25, null, 'Базовая футболка ZIKR свободного кроя.',
   array[]::text[], '', array['M', 'L', 'XL']::text[], '[{"name":"Зелёный","hex":"#1F3836"}]'::jsonb, array['/images/products/futbolka-zikr-zelenaya/01.webp', '/images/products/futbolka-zikr-zelenaya/02.webp', '/images/products/futbolka-zikr-zelenaya/03.webp', '/images/products/futbolka-zikr-zelenaya/04.webp', '/images/products/futbolka-zikr-zelenaya/05.webp', '/images/products/futbolka-zikr-zelenaya/06.webp', '/images/products/futbolka-zikr-zelenaya/07.webp']::text[],
   false, false, true, 30),
  ('kamis', 'Камис', 'umrah', 50, null, 'Камис ZIKR — для лета, Умры и Хаджа.',
   array['Сезон: лето']::text[], '', array['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']::text[], '[{"name":"Бежевый","hex":"#D3C6B1"}]'::jsonb, array['/images/products/kamis/01.webp', '/images/products/kamis/02.webp', '/images/products/kamis/03.webp', '/images/products/kamis/04.webp', '/images/products/kamis/05.webp', '/images/products/kamis/06.webp', '/images/products/kamis/07.webp', '/images/products/kamis/08.webp', '/images/products/kamis/09.webp', '/images/products/kamis/10.webp', '/images/products/kamis/11.webp', '/images/products/kamis/12.webp', '/images/products/kamis/13.webp']::text[],
   true, true, true, 31),
  ('dvoyka-len-white', 'Двойка лен White', 'casual', 60, null, 'Льняная двойка ZIKR: рубашка и брюки.',
   array[]::text[], '', array['M', 'L', 'XL', '2XL', '3XL']::text[], '[{"name":"Белый","hex":"#F4F3EF"}]'::jsonb, array['/images/products/dvoyka-len-white/01.webp', '/images/products/dvoyka-len-white/02.webp', '/images/products/dvoyka-len-white/03.webp', '/images/products/dvoyka-len-white/04.webp', '/images/products/dvoyka-len-white/05.webp']::text[],
   true, true, true, 32),
  ('muslinovyy-ihram-zikr', 'Муслиновый Ихрам ZIKR', 'umrah', 55, null, 'Муслиновый ихрам ZIKR — лёгкий и комфортный комплект для совершения Умры и Хаджа. Изготовлен из муслиновой ткани, которая отличается мягкостью и лёгкостью, обеспечивая комфорт во время длительного использования. Благодаря стандартному размеру ткань удобно располагается на теле и позволяет комфортно совершать необходимые движения во время поклонения. ZIKR — подготовлен с заботой о вашем комфорте во время поклонения.',
   array['Материал: муслин', 'Размер: стандартный — 110 × 220 см', 'Производство: Турция', 'Назначение: для Умры и Хаджа', 'Комплектация: ихрам', 'Ткань: лёгкая, мягкая и приятная к телу']::text[], '', array[]::text[], '[{"name":"Белый","hex":"#F4F3EF"}]'::jsonb, array['/images/products/muslinovyy-ihram-zikr/01.webp', '/images/products/muslinovyy-ihram-zikr/02.webp', '/images/products/muslinovyy-ihram-zikr/03.webp']::text[],
   true, false, true, 33)
on conflict (slug) do nothing;

-- 4. Администратор -----------------------------------------------------------
-- На сайте вход только по паролю: служебный email подставляется сам (supabaseConfig.adminEmail),
-- а к паролю добавляется приставка 'zikr:' (так Supabase принимает даже короткий пароль).
-- Чтобы сменить пароль, поменяйте admin_password и выполните этот блок ещё раз
-- (или смените пароль в админке: «Сменить пароль»).
do $$
declare
  admin_email    text := 'admin@zikrman.com';
  admin_password text := '007';  -- ← пароль для входа в админку
  uid uuid;
begin
  select id into uid from auth.users where email = admin_email;
  if uid is null then
    uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', admin_email,
      extensions.crypt('zikr:' || admin_password, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now(),
      '', '', '', ''
    );
    insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (uid::text, uid, jsonb_build_object('sub', uid::text, 'email', admin_email, 'email_verified', true),
            'email', now(), now(), now());
  else
    update auth.users
       set encrypted_password = extensions.crypt('zikr:' || admin_password, extensions.gen_salt('bf')),
           updated_at = now()
     where id = uid;
  end if;
  insert into public.admins (user_id) values (uid) on conflict do nothing;
end $$;
