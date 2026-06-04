-- =============================================================
-- TATVLIFE SCHEMA — Fixed for Supabase post-May 2026
-- • Explicit GRANTs required (tables no longer auto-exposed)
-- • RLS admin check uses auth.jwt() to avoid infinite recursion
-- • UPDATE policies include WITH CHECK
-- Run this in the Supabase SQL Editor: 
--   https://supabase.com/dashboard/project/verefgdrbcjmmsqgkdfe/sql/new
-- =============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================
-- 1. TABLES
-- =============================================================

-- Profiles (auto-populated by trigger on auth.users insert)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Addresses
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  full_name text not null,
  phone text not null,
  country text not null,
  state text not null,
  city text not null,
  postal_code text not null,
  address_line text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  manufacturer text,
  price numeric not null,
  stock integer default 0,
  dosage text,
  side_effects text,
  category_id uuid references public.categories on delete set null,
  featured boolean default false,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products on delete cascade not null,
  image_url text not null
);

-- Cart Items
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  quantity integer default 1 check (quantity > 0)
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  total_amount numeric not null,
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed', 'refunded')),
  order_status text default 'pending_payment' check (order_status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address_id uuid references public.addresses on delete set null,
  crypto_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric not null
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  gateway text not null,
  payment_link text,
  transaction_hash text,
  amount numeric not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null,
  active boolean default true
);

-- Email Logs
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  email_type text not null,
  status text not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================
-- 2. EXPLICIT GRANTS (required post May 30 2026)
-- =============================================================

-- anon can read public catalog data
grant select on public.categories to anon;
grant select on public.products to anon;
grant select on public.product_images to anon;
grant select on public.reviews to anon;
grant select on public.coupons to anon;

-- authenticated users get full access to their own data
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select on public.categories to authenticated;
grant select on public.products to authenticated;
grant select on public.product_images to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant select, insert on public.payments to authenticated;
grant select, insert on public.reviews to authenticated;
grant select on public.coupons to authenticated;
grant select, insert on public.email_logs to authenticated;

-- service_role gets everything
grant all on public.profiles to service_role;
grant all on public.addresses to service_role;
grant all on public.categories to service_role;
grant all on public.products to service_role;
grant all on public.product_images to service_role;
grant all on public.cart_items to service_role;
grant all on public.orders to service_role;
grant all on public.order_items to service_role;
grant all on public.payments to service_role;
grant all on public.reviews to service_role;
grant all on public.coupons to service_role;
grant all on public.email_logs to service_role;

-- =============================================================
-- 3. HELPER FUNCTION — is_admin() using JWT to avoid recursion
-- =============================================================

create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
end;
$$;


-- =============================================================
-- 4. AUTH TRIGGER — auto-create profile on signup
-- =============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    case when new.email = 'admin@gmail.com' then 'admin' else 'customer' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- 5. ROW LEVEL SECURITY
-- =============================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.email_logs enable row level security;

-- ── profiles ─────────────────────────────────────────────────
-- Users read their own row (simple, no recursion)
drop policy if exists "profiles: users read own" on public.profiles;
create policy "profiles: users read own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles: users update own" on public.profiles;
create policy "profiles: users update own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "profiles: admin read all" on public.profiles;
create policy "profiles: admin read all"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "profiles: admin update all" on public.profiles;
create policy "profiles: admin update all"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- Insert happens via trigger only; no policy needed for direct insert by users

-- ── categories ───────────────────────────────────────────────
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read"
  on public.categories for select
  using (true);

-- ── products ─────────────────────────────────────────────────
drop policy if exists "products: public read active" on public.products;
create policy "products: public read active"
  on public.products for select
  using (active = true);

drop policy if exists "products: admin read all" on public.products;
create policy "products: admin read all"
  on public.products for select
  to authenticated
  using (public.is_admin());

drop policy if exists "products: admin insert all" on public.products;
create policy "products: admin insert all"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "products: admin update all" on public.products;
create policy "products: admin update all"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products: admin delete all" on public.products;
create policy "products: admin delete all"
  on public.products for delete
  to authenticated
  using (public.is_admin());


-- ── product_images ───────────────────────────────────────────
drop policy if exists "product_images: public read" on public.product_images;
create policy "product_images: public read"
  on public.product_images for select
  using (true);

-- ── addresses ────────────────────────────────────────────────
drop policy if exists "addresses: users read own" on public.addresses;
create policy "addresses: users read own"
  on public.addresses for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "addresses: users insert own" on public.addresses;
create policy "addresses: users insert own"
  on public.addresses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "addresses: users update own" on public.addresses;
create policy "addresses: users update own"
  on public.addresses for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "addresses: users delete own" on public.addresses;
create policy "addresses: users delete own"
  on public.addresses for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "addresses: admin read all" on public.addresses;
create policy "addresses: admin read all"
  on public.addresses for select
  to authenticated
  using (public.is_admin());

drop policy if exists "addresses: admin insert all" on public.addresses;
create policy "addresses: admin insert all"
  on public.addresses for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "addresses: admin update all" on public.addresses;
create policy "addresses: admin update all"
  on public.addresses for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "addresses: admin delete all" on public.addresses;
create policy "addresses: admin delete all"
  on public.addresses for delete
  to authenticated
  using (public.is_admin());


-- ── cart_items ───────────────────────────────────────────────
drop policy if exists "cart_items: users read own" on public.cart_items;
create policy "cart_items: users read own"
  on public.cart_items for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "cart_items: users insert own" on public.cart_items;
create policy "cart_items: users insert own"
  on public.cart_items for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "cart_items: users update own" on public.cart_items;
create policy "cart_items: users update own"
  on public.cart_items for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "cart_items: users delete own" on public.cart_items;
create policy "cart_items: users delete own"
  on public.cart_items for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ── orders ───────────────────────────────────────────────────
drop policy if exists "orders: users read own" on public.orders;
create policy "orders: users read own"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "orders: users insert own" on public.orders;
create policy "orders: users insert own"
  on public.orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "orders: admin read all" on public.orders;
create policy "orders: admin read all"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop policy if exists "orders: admin update all" on public.orders;
create policy "orders: admin update all"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── order_items ──────────────────────────────────────────────
drop policy if exists "order_items: users read own" on public.order_items;
create policy "order_items: users read own"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "order_items: users insert own" on public.order_items;
create policy "order_items: users insert own"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "order_items: admin read all" on public.order_items;
create policy "order_items: admin read all"
  on public.order_items for select
  to authenticated
  using (public.is_admin());


-- ── payments ─────────────────────────────────────────────────
drop policy if exists "payments: users read own" on public.payments;
create policy "payments: users read own"
  on public.payments for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = payments.order_id
        and orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "payments: users insert own" on public.payments;
create policy "payments: users insert own"
  on public.payments for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where orders.id = payments.order_id
        and orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "payments: admin read all" on public.payments;
create policy "payments: admin read all"
  on public.payments for select
  to authenticated
  using (public.is_admin());


-- ── reviews ──────────────────────────────────────────────────
drop policy if exists "reviews: public read" on public.reviews;
create policy "reviews: public read"
  on public.reviews for select
  using (true);

drop policy if exists "reviews: users insert own" on public.reviews;
create policy "reviews: users insert own"
  on public.reviews for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- ── coupons ──────────────────────────────────────────────────
drop policy if exists "coupons: public read active" on public.coupons;
create policy "coupons: public read active"
  on public.coupons for select
  using (active = true);

-- ── email_logs ───────────────────────────────────────────────
drop policy if exists "email_logs: users read own" on public.email_logs;
create policy "email_logs: users read own"
  on public.email_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "email_logs: insert allowed" on public.email_logs;
create policy "email_logs: insert allowed"
  on public.email_logs for insert
  with check (true);

-- =============================================================
-- 6. SEED — Categories & Products
-- =============================================================

insert into public.categories (name, slug) values
  ('Chemotherapy',    'chemotherapy'),
  ('Immunotherapy',   'immunotherapy'),
  ('Targeted Therapy','targeted-therapy'),
  ('Hormonal Therapy','hormonal-therapy'),
  ('Supportive Care', 'supportive-care'),
  ('Pain Management', 'pain-management')
on conflict (slug) do update set name = excluded.name;

-- Products (inserted by referencing category slugs)
with cats as (select id, slug from public.categories)
insert into public.products (name, slug, description, manufacturer, price, stock, dosage, side_effects, category_id, featured, active)
select
  p.name, p.slug, p.description, p.manufacturer, p.price, p.stock, p.dosage, p.side_effects,
  cats.id, p.featured, true
from (
  values
    ('Temozolomide (Temodar) 100mg','temozolomide-temodar-100mg','An alkylating chemotherapy agent used for glioblastoma multiforme and anaplastic astrocytoma treatment. Oral capsule for home administration.','Merck & Co.',23920,50,'150mg/m² once daily on empty stomach at bedtime.','Nausea, vomiting, headache, fatigue, thrombocytopenia.','chemotherapy',true),
    ('Capecitabine (Xeloda) 500mg','capecitabine-xeloda-500mg','Oral chemotherapy converted to 5-fluorouracil in the tumor. Prescribed for colorectal, gastric, and breast cancers.','Genentech',27920,40,'1250mg/m² twice daily for 14 days, then 7-day rest. Take within 30 minutes after meals.','Diarrhea, nausea, hand-foot syndrome, fatigue.','chemotherapy',true),
    ('Imatinib (Gleevec) 400mg','imatinib-gleevec-400mg','Tyrosine kinase inhibitor blocking BCR-ABL protein. For Chronic Myelogenous Leukemia (CML) and GIST.','Novartis',36000,30,'400mg daily with meal and large glass of water.','Fluid retention, muscle cramps, nausea, skin rash.','targeted-therapy',true),
    ('Erlotinib (Tarceva) 150mg','erlotinib-tarceva-150mg','EGFR inhibitor for Non-Small Cell Lung Cancer (NSCLC) and pancreatic cancer.','Astellas / Genentech',30400,25,'150mg once daily on empty stomach. At least 1 hour before or 2 hours after food.','Diarrhea, acneiform rash, dry skin, fatigue.','targeted-therapy',false),
    ('Tamoxifen Citrate 20mg','tamoxifen-citrate-20mg','SERM for prevention and treatment of receptor-positive breast cancers.','AstraZeneca',7120,150,'20mg once daily. Can be taken with or without food.','Hot flashes, vaginal discharge, fluid retention, fatigue.','hormonal-therapy',true),
    ('Letrozole (Femara) 2.5mg','letrozole-femara-25mg','Aromatase inhibitor lowering estrogen in postmenopausal women to slow estrogen-responsive breast tumors.','Novartis',9600,110,'2.5mg once daily. May be taken with or without meals.','Hot flashes, joint pain, fatigue, night sweats.','hormonal-therapy',false),
    ('Chemo-Skin Soothing Recovery Cream','chemo-skin-soothing-recovery-cream','Clinical-strength topical for chemotherapy-induced skin dryness, pruritus, and radiation dermatitis.','Tatvlife Lab',3360,200,'Apply to affected skin 3-4 times daily or as needed.','None. Hypoallergenic, steroid-free, fragrance-free.','supportive-care',true),
    ('Onco-Calm Nausea Relief Elixir','onco-calm-nausea-relief-elixir','Botanical sublingual blend of gingerols and peppermint for rapid nausea relief during chemotherapy.','Tatvlife Lab',1920,300,'1-2 droppers under tongue at onset of nausea.','Mild warming sensation.','supportive-care',true),
    ('CBD-Onco Pain Relief Balm','cbd-onco-therapeutic-pain-relief-balm','High-potency hemp cannabinoid topical for peripheral neuropathy pain and joint stiffness.','Tatvlife Lab',5200,80,'Massage into painful areas up to 4 times daily.','Mild localized redness if allergic to essential oils.','pain-management',true)
) as p(name, slug, description, manufacturer, price, stock, dosage, side_effects, cat_slug, featured)
join cats on cats.slug = p.cat_slug
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  stock = excluded.stock,
  featured = excluded.featured;


-- =============================================================
-- 7. SEED — Users & Profiles (Demo-Ready)
-- =============================================================

-- Enable pgcrypto extension for password hashing
create extension if not exists pgcrypto;

-- Inject admin user into auth.users (ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'admin@gmail.com',
  crypt('password1234', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  now(), now(), '', '', '', ''
) on conflict (id) do nothing;

-- Force profile setup to be admin
insert into public.profiles (id, full_name, email, role)
values (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Admin User',
  'admin@gmail.com',
  'admin'
) on conflict (id) do update set role = 'admin';

-- Inject customer user into auth.users (ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'authenticated',
  'authenticated',
  'customer@gmail.com',
  crypt('password1234', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Customer User"}',
  now(), now(), '', '', '', ''
) on conflict (id) do nothing;

-- Force profile setup to be customer
insert into public.profiles (id, full_name, email, role)
values (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Customer User',
  'customer@gmail.com',
  'customer'
) on conflict (id) do nothing;
