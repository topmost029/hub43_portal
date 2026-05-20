-- ─── Hub43 Workspace — Initial Schema ────────────────────────────────────────
-- Run via: supabase db push
-- Or paste into Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────

create type user_role as enum ('admin', 'frontdesk', 'member');
create type service_type as enum ('hot_desk', 'private_office', 'meeting_room', 'virtual_office');
create type booking_status as enum ('pending', 'pending_transfer', 'approved', 'rejected', 'completed');
create type subscription_status as enum ('active', 'expired', 'cancelled');
create type invoice_status as enum ('paid', 'unpaid', 'pending');

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields.

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        user_role not null default 'member',
  phone       text default '',
  joined      date not null default current_date,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile; admins can read all
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_admin" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles_select_frontdesk" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'frontdesk'
    )
  );

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Offices ──────────────────────────────────────────────────────────────────

create table public.offices (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  floor       text not null default '',
  capacity    integer not null default 1,
  status      text not null default 'available' check (status in ('available', 'occupied')),
  assigned_to uuid references public.profiles(id) on delete set null,
  type        text not null default 'private',
  pricing     jsonb not null default '{"daily":0,"monthly":0,"quarterly":0,"yearly":0}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.offices enable row level security;

create policy "offices_read_authenticated" on public.offices
  for select using (auth.role() = 'authenticated');

create policy "offices_write_admin" on public.offices
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── Meeting Rooms ────────────────────────────────────────────────────────────

create table public.meeting_rooms (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  capacity    integer not null default 1,
  floor       text not null default '',
  pricing     jsonb not null default '{"hourly":0,"halfDay":0,"fullDay":0}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.meeting_rooms enable row level security;

create policy "meeting_rooms_read_authenticated" on public.meeting_rooms
  for select using (auth.role() = 'authenticated');

create policy "meeting_rooms_write_admin" on public.meeting_rooms
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── Bookings ─────────────────────────────────────────────────────────────────

create table public.bookings (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  service            service_type not null,
  room_id            uuid references public.meeting_rooms(id) on delete set null,
  office_id          uuid references public.offices(id) on delete set null,
  date               date not null,
  check_in           time,
  check_out          time,
  start_time         time,
  end_time           time,
  hours              numeric,
  amount             numeric not null default 0,
  status             booking_status not null default 'pending',
  invoice_id         uuid,  -- set after invoice creation
  payment_method     text check (payment_method in ('paystack', 'bank_transfer')),
  payment_reference  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "bookings_read_own" on public.bookings
  for select using (auth.uid() = user_id);

create policy "bookings_read_admin_frontdesk" on public.bookings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'frontdesk')
    )
  );

create policy "bookings_insert_authenticated" on public.bookings
  for insert with check (auth.uid() = user_id);

create policy "bookings_update_admin" on public.bookings
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── Subscriptions ────────────────────────────────────────────────────────────

create table public.subscriptions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  service     service_type not null,
  plan        text not null,
  start_date  date not null,
  end_date    date not null,
  status      subscription_status not null default 'active',
  office_id   uuid references public.offices(id) on delete set null,
  amount      numeric not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_read_own" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "subscriptions_read_admin" on public.subscriptions
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "subscriptions_write_admin" on public.subscriptions
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "subscriptions_insert_member" on public.subscriptions
  for insert with check (auth.uid() = user_id);

-- ─── Invoices ─────────────────────────────────────────────────────────────────

create table public.invoices (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  booking_id       uuid references public.bookings(id) on delete set null,
  subscription_id  uuid references public.subscriptions(id) on delete set null,
  amount           numeric not null default 0,
  date             date not null default current_date,
  status           invoice_status not null default 'unpaid',
  service          text not null default '',
  description      text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "invoices_read_own" on public.invoices
  for select using (auth.uid() = user_id);

create policy "invoices_read_admin" on public.invoices
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "invoices_write_admin" on public.invoices
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── Notifications ────────────────────────────────────────────────────────────

create table public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null default 'info' check (type in ('reminder', 'info', 'warning', 'success')),
  message     text not null,
  read        boolean not null default false,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_read_own" on public.notifications
  for select using (auth.uid() = user_id);

create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

create policy "notifications_write_admin" on public.notifications
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── Expenses ─────────────────────────────────────────────────────────────────

create table public.expenses (
  id              uuid primary key default uuid_generate_v4(),
  date            date not null,
  category        text not null,
  description     text not null default '',
  amount          numeric not null default 0,
  payment_method  text not null default 'card',
  recorded_by     uuid references public.profiles(id) on delete set null,
  entered_at      timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "expenses_read_admin_frontdesk" on public.expenses
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'frontdesk')
    )
  );

create policy "expenses_insert_admin_frontdesk" on public.expenses
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'frontdesk')
    )
  );

create policy "expenses_delete_admin" on public.expenses
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── App Settings (key-value store for wifi, emailjs, payment, pricing) ───────

create table public.app_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy "app_settings_read_admin" on public.app_settings
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "app_settings_read_wifi_approved" on public.app_settings
  for select using (
    key = 'wifi'
    and auth.role() = 'authenticated'
  );

create policy "app_settings_write_admin" on public.app_settings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── updated_at triggers ──────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at    before update on public.profiles    for each row execute function public.set_updated_at();
create trigger trg_offices_updated_at     before update on public.offices     for each row execute function public.set_updated_at();
create trigger trg_meeting_rooms_updated_at before update on public.meeting_rooms for each row execute function public.set_updated_at();
create trigger trg_bookings_updated_at    before update on public.bookings    for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger trg_invoices_updated_at    before update on public.invoices    for each row execute function public.set_updated_at();
create trigger trg_app_settings_updated_at before update on public.app_settings for each row execute function public.set_updated_at();
