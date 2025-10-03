-- Field Service Time Tracking PWA Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type public.app_role as enum ('super_admin', 'admin', 'supervisor', 'worker');
create type public.job_status as enum ('active', 'completed', 'cancelled', 'on_hold');
create type public.check_type as enum ('check_in', 'check_out', 'break_start', 'break_end');

-- User roles table (separate from profiles for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'worker',
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- User profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  company_id uuid,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Companies table
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text check (industry in ('landscaping', 'construction', 'hvac', 'other')),
  address text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.companies enable row level security;

-- Job sites table
create table public.job_sites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade not null,
  name text not null,
  address text not null,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  qr_code text unique,
  nfc_tag_id text unique,
  status job_status default 'active',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.job_sites enable row level security;

-- Time entries table
create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_site_id uuid references public.job_sites(id) on delete cascade not null,
  check_type check_type not null,
  timestamp timestamp with time zone default now(),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  photo_url text,
  notes text,
  is_offline_sync boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.time_entries enable row level security;

-- Work sessions table (calculated from time entries)
create table public.work_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_site_id uuid references public.job_sites(id) on delete cascade not null,
  check_in_id uuid references public.time_entries(id),
  check_out_id uuid references public.time_entries(id),
  duration_minutes integer,
  date date not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.work_sessions enable row level security;

-- Photo proofs table
create table public.photo_proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_site_id uuid references public.job_sites(id) on delete cascade not null,
  time_entry_id uuid references public.time_entries(id) on delete cascade,
  photo_url text not null,
  description text,
  captured_at timestamp with time zone default now(),
  uploaded_at timestamp with time zone default now()
);

alter table public.photo_proofs enable row level security;

-- RLS Policies

-- User roles policies
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

create policy "Admins can insert roles"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Companies policies
create policy "Authenticated users can view companies"
  on public.companies for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage companies"
  on public.companies for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Job sites policies
create policy "Authenticated users can view job sites"
  on public.job_sites for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage job sites"
  on public.job_sites for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Time entries policies
create policy "Users can view their own time entries"
  on public.time_entries for select
  using (auth.uid() = user_id);

create policy "Users can create their own time entries"
  on public.time_entries for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all time entries"
  on public.time_entries for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Work sessions policies
create policy "Users can view their own work sessions"
  on public.work_sessions for select
  using (auth.uid() = user_id);

create policy "Admins can view all work sessions"
  on public.work_sessions for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Photo proofs policies
create policy "Users can view their own photo proofs"
  on public.photo_proofs for select
  using (auth.uid() = user_id);

create policy "Users can create their own photo proofs"
  on public.photo_proofs for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all photo proofs"
  on public.photo_proofs for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Functions

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  
  -- Assign default worker role
  insert into public.user_roles (user_id, role)
  values (new.id, 'worker');
  
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to calculate work session duration
create or replace function public.calculate_session_duration()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  check_in_time timestamp with time zone;
  check_out_time timestamp with time zone;
  calculated_duration integer;
begin
  if new.check_type = 'check_out' then
    -- Find the most recent check_in for this user and job site
    select timestamp into check_in_time
    from public.time_entries
    where user_id = new.user_id
      and job_site_id = new.job_site_id
      and check_type = 'check_in'
      and timestamp < new.timestamp
    order by timestamp desc
    limit 1;
    
    if check_in_time is not null then
      -- Calculate duration in minutes
      calculated_duration := extract(epoch from (new.timestamp - check_in_time)) / 60;
      
      -- Create or update work session
      insert into public.work_sessions (
        user_id, 
        job_site_id, 
        check_out_id, 
        duration_minutes,
        date
      )
      values (
        new.user_id,
        new.job_site_id,
        new.id,
        calculated_duration,
        new.timestamp::date
      )
      on conflict (id) do update
      set check_out_id = new.id,
          duration_minutes = calculated_duration,
          updated_at = now();
    end if;
  end if;
  
  return new;
end;
$$;

-- Trigger to calculate work duration
create trigger on_time_entry_created
  after insert on public.time_entries
  for each row execute procedure public.calculate_session_duration();

-- Storage bucket for photos
insert into storage.buckets (id, name, public)
values ('work-photos', 'work-photos', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload their own photos"
  on storage.objects for insert
  with check (
    bucket_id = 'work-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own photos"
  on storage.objects for select
  using (
    bucket_id = 'work-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Admins can view all photos"
  on storage.objects for select
  using (
    bucket_id = 'work-photos' and
    (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'))
  );
