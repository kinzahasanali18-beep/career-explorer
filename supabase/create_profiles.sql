-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  sparq_title text,
  avatar      text,
  world       text,
  discipline  text,
  work_style  text,
  created_at  timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );
