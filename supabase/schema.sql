create extension if not exists "uuid-ossp";

create table if not exists trades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  ticker text,
  entry float,
  exit float,
  direction text,
  setup text,
  notes text,
  tags text[],
  date date,
  ai_feedback text,
  created_at timestamp default now()
);

