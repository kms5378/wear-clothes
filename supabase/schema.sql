create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  image_urls text[] not null default '{}',
  generated_image_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_sections (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('hero', 'collection', 'featured')),
  title text not null,
  subtitle text,
  image_url text,
  product_ids uuid[] not null default '{}',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, size, color)
);

create table if not exists public.mock_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  items_snapshot jsonb not null,
  shipping_info jsonb not null,
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'mock_paid' check (status = 'mock_paid'),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('product_image', 'try_on', 'agent_proposal')),
  user_id uuid references public.profiles(id) on delete set null,
  input_metadata jsonb not null default '{}'::jsonb,
  output_urls text[] not null default '{}',
  output_json jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'completed', 'error')),
  error text,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_proposals (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  prompt text not null,
  proposed_changes jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  applied_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.home_sections enable row level security;
alter table public.cart_items enable row level security;
alter table public.mock_orders enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.agent_proposals enable row level security;

drop policy if exists "customer_read_own_profile" on public.profiles;
create policy "customer_read_own_profile"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "admin_manage_profiles" on public.profiles;
create policy "admin_manage_profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "customer_read_published_products" on public.products;
create policy "customer_read_published_products"
  on public.products for select
  using (status = 'published');

drop policy if exists "admin_manage_products" on public.products;
create policy "admin_manage_products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "customer_read_active_home_sections" on public.home_sections;
create policy "customer_read_active_home_sections"
  on public.home_sections for select
  using (active = true);

drop policy if exists "admin_manage_home_sections" on public.home_sections;
create policy "admin_manage_home_sections"
  on public.home_sections for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "customer_manage_own_cart_items" on public.cart_items;
create policy "customer_manage_own_cart_items"
  on public.cart_items for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admin_read_cart_items" on public.cart_items;
create policy "admin_read_cart_items"
  on public.cart_items for select
  using (public.is_admin());

drop policy if exists "customer_read_own_mock_orders" on public.mock_orders;
create policy "customer_read_own_mock_orders"
  on public.mock_orders for select
  using (user_id = auth.uid());

drop policy if exists "customer_create_own_mock_orders" on public.mock_orders;
create policy "customer_create_own_mock_orders"
  on public.mock_orders for insert
  with check (user_id = auth.uid());

drop policy if exists "admin_read_mock_orders" on public.mock_orders;
create policy "admin_read_mock_orders"
  on public.mock_orders for select
  using (public.is_admin());

drop policy if exists "customer_read_own_ai_jobs" on public.ai_jobs;
create policy "customer_read_own_ai_jobs"
  on public.ai_jobs for select
  using (user_id = auth.uid());

drop policy if exists "customer_create_own_try_on_jobs" on public.ai_jobs;
create policy "customer_create_own_try_on_jobs"
  on public.ai_jobs for insert
  with check (user_id = auth.uid() and type = 'try_on');

drop policy if exists "admin_manage_ai_jobs" on public.ai_jobs;
create policy "admin_manage_ai_jobs"
  on public.ai_jobs for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_manage_agent_proposals" on public.agent_proposals;
create policy "admin_manage_agent_proposals"
  on public.agent_proposals for all
  using (public.is_admin())
  with check (public.is_admin());

-- Supabase Storage buckets for the implementation plan.
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('try-on-results', 'try-on-results', false),
  ('uploads', 'uploads', false)
on conflict (id) do nothing;

drop policy if exists "admin_manage_product_images" on storage.objects;
create policy "admin_manage_product_images"
  on storage.objects for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "customer_manage_own_try_on_results" on storage.objects;
create policy "customer_manage_own_try_on_results"
  on storage.objects for all
  using (bucket_id in ('try-on-results', 'uploads') and owner = auth.uid())
  with check (bucket_id in ('try-on-results', 'uploads') and owner = auth.uid());
