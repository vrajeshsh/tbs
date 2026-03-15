-- Run this script in your Supabase SQL Editor
-- If you already have the tables but are getting "Could not find column 'name'", run this:
-- ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS name text;

-- 1. Create subscribers table
create table public.subscribers (
  email text primary key,
  name text,
  total_queries integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create marketing_queries table
create table public.marketing_queries (
  id uuid default gen_random_uuid() primary key,
  email text references public.subscribers(email),
  query_text text not null,
  ai_output jsonb not null,
  lead_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create marketing_blueprints table
create table public.marketing_blueprints (
  id text primary key,
  business_name text not null,
  input_data jsonb not null,
  ai_output jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
