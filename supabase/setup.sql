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

create table if not exists public.client_cam_media (
  id text primary key,
  media_type text not null check (media_type in ('image', 'video')),
  media_url text not null,
  media_path text,
  display_order integer not null default 0 check (display_order >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_active_order_idx
on public.categories (active, display_order, name);

create index if not exists products_active_order_idx
on public.products (active, display_order, created_at desc);

create index if not exists products_category_order_idx
on public.products (category_slug, display_order, created_at desc);

create index if not exists client_cam_active_order_idx
on public.client_cam_media (active, display_order, created_at desc);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.client_cam_media enable row level security;

revoke all on public.categories from anon, authenticated;
revoke all on public.products from anon, authenticated;
revoke all on public.client_cam_media from anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.client_cam_media to anon, authenticated;
grant insert, update, delete on public.client_cam_media to authenticated;

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

drop policy if exists "Public reads visible Client Cam media" on public.client_cam_media;
create policy "Public reads visible Client Cam media"
on public.client_cam_media for select to anon
using (active = true);

drop policy if exists "Signed in users read permitted Client Cam media" on public.client_cam_media;
create policy "Signed in users read permitted Client Cam media"
on public.client_cam_media for select to authenticated
using (active = true or public.is_areli_admin());

drop policy if exists "Administrator creates Client Cam media" on public.client_cam_media;
create policy "Administrator creates Client Cam media"
on public.client_cam_media for insert to authenticated
with check (public.is_areli_admin());

drop policy if exists "Administrator updates Client Cam media" on public.client_cam_media;
create policy "Administrator updates Client Cam media"
on public.client_cam_media for update to authenticated
using (public.is_areli_admin())
with check (public.is_areli_admin());

drop policy if exists "Administrator removes Client Cam media" on public.client_cam_media;
create policy "Administrator removes Client Cam media"
on public.client_cam_media for delete to authenticated
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-cam-media',
  'client-cam-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads Client Cam files" on storage.objects;
create policy "Public reads Client Cam files"
on storage.objects for select to anon, authenticated
using (bucket_id = 'client-cam-media');

drop policy if exists "Administrator uploads Client Cam files" on storage.objects;
create policy "Administrator uploads Client Cam files"
on storage.objects for insert to authenticated
with check (bucket_id = 'client-cam-media' and public.is_areli_admin());

drop policy if exists "Administrator updates Client Cam files" on storage.objects;
create policy "Administrator updates Client Cam files"
on storage.objects for update to authenticated
using (bucket_id = 'client-cam-media' and public.is_areli_admin())
with check (bucket_id = 'client-cam-media' and public.is_areli_admin());

drop policy if exists "Administrator removes Client Cam files" on storage.objects;
create policy "Administrator removes Client Cam files"
on storage.objects for delete to authenticated
using (bucket_id = 'client-cam-media' and public.is_areli_admin());

delete from public.products where category_slug = 'crochet';
delete from public.categories where slug = 'crochet';

insert into public.categories (slug, name, display_order, active) values
  ('necklaces', 'Necklaces', 0, true),
  ('earrings-rings', 'Earrings', 1, true),
  ('bracelets-bangles', 'Bracelets', 2, true),
  ('perfume', 'Extras', 3, true),
  ('exclusive-men', 'Exclusive Men', 4, true)
on conflict (slug) do nothing;

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
on conflict (id) do nothing;

insert into public.client_cam_media
  (id, media_type, media_url, display_order, active)
values
  ('legacy-client-cam-01', 'image', '/videos/client-cam/4acd655b-6a40-4f62-be74-6acb78a8312f.JPG', 0, true),
  ('legacy-client-cam-02', 'image', '/videos/client-cam/1055d675-a433-4820-b6d6-52319b5cff08.JPG', 1, true),
  ('legacy-client-cam-03', 'image', '/videos/client-cam/2d23d457-4e4f-412b-bc6f-ff3009fea8f4.JPG', 2, true),
  ('legacy-client-cam-04', 'image', '/videos/client-cam/755978fc-ace7-458d-a97a-037aec90aabd.JPG', 3, true),
  ('legacy-client-cam-05', 'image', '/videos/client-cam/21b7a2a8-8342-4afe-b26f-164a60395da5.JPG', 4, true),
  ('legacy-client-cam-06', 'video', '/videos/client-cam/AF903226-5F7A-43C8-85BC-45BB91A6B7AA.MP4', 5, true),
  ('legacy-client-cam-07', 'image', '/videos/client-cam/d0c8db62-48c0-4d1f-9b5e-e7eae75c89eb.JPG', 6, true),
  ('legacy-client-cam-08', 'image', '/videos/client-cam/58804cb1-2b8d-4b5e-b340-8a29a4d0f3ed.JPG', 7, true),
  ('legacy-client-cam-09', 'video', '/videos/client-cam/f677ab3b-1880-4e7a-9861-603fb15cb1e1.MP4', 8, true),
  ('legacy-client-cam-10', 'image', '/videos/client-cam/04f50ef6-5610-4c2d-9c8b-e144f54b323b 2.jpg', 9, true)
on conflict (id) do nothing;

commit;
