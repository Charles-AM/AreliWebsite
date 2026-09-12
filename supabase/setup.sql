begin;

create or replace function public.is_areli_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'cjmedicare15@gmail.com';
$$;

revoke all on function public.is_areli_admin() from public;
grant execute on function public.is_areli_admin() to authenticated;

create table if not exists public.categories (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 50),
  display_order integer not null default 0 check (display_order >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category_slug text not null references public.categories(slug) on update cascade on delete restrict,
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 180),
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  image_path text,
  display_order integer not null default 0 check (display_order >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;

revoke all on public.categories from anon, authenticated;
revoke all on public.products from anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Public reads visible categories" on public.categories;
create policy "Public reads visible categories"
on public.categories for select to anon
using (active = true);

drop policy if exists "Signed in users read permitted categories" on public.categories;
create policy "Signed in users read permitted categories"
on public.categories for select to authenticated
using (active = true or public.is_areli_admin());

drop policy if exists "Administrator creates categories" on public.categories;
create policy "Administrator creates categories"
on public.categories for insert to authenticated
with check (public.is_areli_admin());

drop policy if exists "Administrator updates categories" on public.categories;
create policy "Administrator updates categories"
on public.categories for update to authenticated
using (public.is_areli_admin())
with check (public.is_areli_admin());

drop policy if exists "Administrator removes categories" on public.categories;
create policy "Administrator removes categories"
on public.categories for delete to authenticated
using (public.is_areli_admin());

drop policy if exists "Public reads visible products" on public.products;
create policy "Public reads visible products"
on public.products for select to anon
using (active = true);

drop policy if exists "Signed in users read permitted products" on public.products;
create policy "Signed in users read permitted products"
on public.products for select to authenticated
using (active = true or public.is_areli_admin());

drop policy if exists "Administrator creates products" on public.products;
create policy "Administrator creates products"
on public.products for insert to authenticated
with check (public.is_areli_admin());

drop policy if exists "Administrator updates products" on public.products;
create policy "Administrator updates products"
on public.products for update to authenticated
using (public.is_areli_admin())
with check (public.is_areli_admin());

drop policy if exists "Administrator removes products" on public.products;
create policy "Administrator removes products"
on public.products for delete to authenticated
using (public.is_areli_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads product images" on storage.objects;
create policy "Public reads product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Administrator uploads product images" on storage.objects;
create policy "Administrator uploads product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_areli_admin());

drop policy if exists "Administrator updates product images" on storage.objects;
create policy "Administrator updates product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_areli_admin())
with check (bucket_id = 'product-images' and public.is_areli_admin());

drop policy if exists "Administrator removes product images" on storage.objects;
create policy "Administrator removes product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_areli_admin());

delete from public.products where category_slug = 'crochet';
delete from public.categories where slug = 'crochet';

insert into public.categories (slug, name, display_order, active) values
  ('necklaces', 'Necklaces', 0, true),
  ('earrings-rings', 'Earrings', 1, true),
  ('bracelets-bangles', 'Bracelets', 2, true),
  ('perfume', 'Perfume', 3, true),
  ('exclusive-men', 'Exclusive Men', 4, true)
on conflict (slug) do update set
  name = excluded.name,
  display_order = excluded.display_order;

insert into public.products
  (id, category_slug, name, description, price, image_url, display_order, active)
values
  ('necklaces-16', 'necklaces', 'Pulse Necklace', '', 65, '/images/collections/necklaces/necklace-16.jpg', 0, true),
  ('necklaces-7', 'necklaces', 'Halo Set', '', 130, '/images/collections/necklaces/necklace-7.jpg', 1, true),
  ('necklaces-15', 'necklaces', 'Aurora Necklace', '', 65, '/images/collections/necklaces/necklace-15.jpg', 2, true),
  ('necklaces-6', 'necklaces', 'Sea Pearl Set', '', 125, '/images/collections/necklaces/necklace-6.jpg', 3, true),
  ('necklaces-14', 'necklaces', 'Isla Necklace', '', 65, '/images/collections/necklaces/necklace-14.jpg', 4, true),
  ('necklaces-4', 'necklaces', 'Linea Heart Necklace', '', 65, '/images/collections/necklaces/necklace-4.jpg', 5, true),
  ('necklaces-13', 'necklaces', 'Stella Necklace', '', 65, '/images/collections/necklaces/necklace-13.jpg', 6, true),
  ('necklaces-1', 'necklaces', 'Rosalia Necklace', '', 65, '/images/collections/necklaces/necklace-1.jpg', 7, true),
  ('necklaces-12', 'necklaces', 'Aria Necklace', '', 65, '/images/collections/necklaces/necklace-12.jpg', 8, true),
  ('necklaces-2', 'necklaces', 'Flutter Charm Necklace', '', 45, '/images/collections/necklaces/necklace-2.jpg', 9, true),
  ('necklaces-11', 'necklaces', 'Vienna Necklace', '', 65, '/images/collections/necklaces/necklace-11.jpg', 10, true),
  ('necklaces-3', 'necklaces', 'Roseraie Set', '', 125, '/images/collections/necklaces/necklace-3.jpg', 11, true),
  ('necklaces-10', 'necklaces', 'Nova Necklace', '', 65, '/images/collections/necklaces/necklace-10.jpg', 12, true),
  ('necklaces-5', 'necklaces', '316 L Necklace', '', 120, '/images/collections/necklaces/necklace-5.jpg', 13, true),
  ('necklaces-9', 'necklaces', 'Wisteria Necklace', '', 65, '/images/collections/necklaces/necklace-9.jpg', 14, true),
  ('necklaces-8', 'necklaces', 'Celeste Necklace', '', 70, '/images/collections/necklaces/necklace-8.jpg', 15, true),
  ('earrings-rings-1', 'earrings-rings', 'Spherina Earrings', '', 50, '/images/collections/earrings-rings/earrings-rings-1.jpg', 0, true),
  ('earrings-rings-2', 'earrings-rings', 'Black Petal', '', 45, '/images/collections/earrings-rings/earrings-rings-2.jpg', 1, true),
  ('earrings-rings-3', 'earrings-rings', 'Luna Earrings', '', 50, '/images/collections/earrings-rings/earrings-rings-3.jpg', 2, true),
  ('earrings-rings-4', 'earrings-rings', 'Octavia Earrings', '', 50, '/images/collections/earrings-rings/earrings-rings-4.jpg', 3, true),
  ('earrings-rings-5', 'earrings-rings', 'Dewfall Earring', '', 45, '/images/collections/earrings-rings/earrings-rings-5.jpg', 4, true),
  ('bracelets-bangles-1', 'bracelets-bangles', 'Butterfly Bangle', '', 65, '/images/collections/bracelets-bangles/bracelet-1.jpg', 0, true),
  ('bracelets-bangles-2', 'bracelets-bangles', 'Orbi Bangle', '', 60, '/images/collections/bracelets-bangles/bracelet-2.jpg', 1, true),
  ('bracelets-bangles-3', 'bracelets-bangles', 'Chana Bangle', '', 65, '/images/collections/bracelets-bangles/bracelet-3.jpg', 2, true),
  ('bracelets-bangles-4', 'bracelets-bangles', 'Bracelet / Bangle 4', '', 70, '/images/collections/bracelets-bangles/bracelet-4.jpg', 3, true),
  ('bracelets-bangles-5', 'bracelets-bangles', 'Bracelet / Bangle 5', '', 75, '/images/collections/bracelets-bangles/bracelet-5.jpg', 4, true),
  ('perfume-1', 'perfume', 'Amber Romance', '', 160, '/images/collections/perfume/perfume-1.jpg', 0, true),
  ('perfume-2', 'perfume', 'Vanilla Lace', '', 160, '/images/collections/perfume/perfume-2.jpg', 1, true),
  ('perfume-3', 'perfume', 'Pure Seduction Joy', '', 160, '/images/collections/perfume/perfume-3.jpg', 2, true),
  ('perfume-4a', 'perfume', 'Velvet Petals (Left)', '', 160, '/images/collections/perfume/perfume-4.jpg', 3, true),
  ('perfume-4b', 'perfume', 'Love Spell (Right)', '', 160, '/images/collections/perfume/perfume-4.jpg', 4, true),
  ('perfume-5', 'perfume', 'Camelia Sunset', '', 160, '/images/collections/perfume/perfume-5.jpg', 5, true)
on conflict (id) do update set
  category_slug = excluded.category_slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  display_order = excluded.display_order;

commit;
