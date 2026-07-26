-- DompetJujur — Initial Schema
-- Migration: 0001_initial_schema

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists pgcrypto;

-- ============================================================
-- ENUM TYPES
-- ============================================================
create type public.risk_window as enum (
  'after_work',
  'late_night',
  'after_payday',
  'after_loss',
  'paylater_available',
  'other'
);

create type public.trigger_type as enum (
  'stress',
  'payday',
  'chasing_loss',
  'boredom_escape',
  'paylater_limit',
  'other'
);

create type public.pause_outcome as enum (
  'delayed',
  'proceeded',
  'redirected'
);

create type public.pause_intent as enum (
  'continue',
  'unsure'
);

create type public.reflection_code as enum (
  'calmer',
  'same',
  'stronger',
  'urge_too_strong',
  'stress',
  'chasing_loss',
  'avoid_thinking',
  'skipped'
);

-- ============================================================
-- TABLES
-- ============================================================

-- profiles: 1-to-1 with auth.users
create table public.profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  nickname            text        check (char_length(nickname) <= 60),
  payday_day          smallint    check (payday_day between 1 and 31),
  primary_risk_window public.risk_window,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- financial_profiles: latest income/expense baseline
create table public.financial_profiles (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references auth.users(id) on delete cascade,
  monthly_income      bigint      not null check (monthly_income >= 0),
  mandatory_expenses  bigint      not null check (mandatory_expenses >= 0),
  debt_payments       bigint      not null check (debt_payments >= 0),
  income_variable     boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- monthly_plans: one plan per user per month
create table public.monthly_plans (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  month_key       date        not null,
  income          bigint      not null check (income >= 0),
  mandatory       bigint      not null check (mandatory >= 0),
  debt            bigint      not null check (debt >= 0),
  safety_buffer   bigint      not null default 0 check (safety_buffer >= 0),
  flexible_amount bigint      not null check (flexible_amount >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, month_key),
  check (month_key = date_trunc('month', month_key)::date)
);

-- pause_sessions: core intervention session
create table public.pause_sessions (
  id                  uuid              primary key default gen_random_uuid(),
  user_id             uuid              not null references auth.users(id) on delete cascade,
  amount              bigint            not null check (amount > 0),
  trigger_type        public.trigger_type not null,
  urge_before         smallint          check (urge_before between 1 and 5),
  urge_after          smallint          check (urge_after between 1 and 5),
  intent_during_pause public.pause_intent,
  outcome             public.pause_outcome,
  started_at          timestamptz       not null,
  pause_eligible_at   timestamptz       not null,
  completed_at        timestamptz,
  is_demo             boolean           not null default false,
  created_at          timestamptz       not null default now(),
  updated_at          timestamptz       not null default now(),
  check (pause_eligible_at > started_at),
  check (
    (outcome is null and completed_at is null)
    or
    (outcome is not null and completed_at is not null)
  )
);

-- reflection_entries: one reflection per session
create table public.reflection_entries (
  id              uuid                  primary key default gen_random_uuid(),
  session_id      uuid                  not null references public.pause_sessions(id) on delete cascade,
  user_id         uuid                  not null references auth.users(id) on delete cascade,
  reflection_code public.reflection_code not null,
  note            text                  check (char_length(note) <= 240),
  created_at      timestamptz           not null default now(),
  unique (session_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index financial_profiles_user_created_idx
  on public.financial_profiles (user_id, created_at desc);

create index monthly_plans_user_month_idx
  on public.monthly_plans (user_id, month_key desc);

create index pause_sessions_user_created_idx
  on public.pause_sessions (user_id, created_at desc);

create index pause_sessions_user_outcome_created_idx
  on public.pause_sessions (user_id, outcome, created_at desc);

create index pause_sessions_user_trigger_idx
  on public.pause_sessions (user_id, trigger_type);

create index pause_sessions_user_demo_idx
  on public.pause_sessions (user_id, is_demo, created_at desc);

create index reflection_entries_user_created_idx
  on public.reflection_entries (user_id, created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger financial_profiles_set_updated_at
before update on public.financial_profiles
for each row execute function public.set_updated_at();

create trigger monthly_plans_set_updated_at
before update on public.monthly_plans
for each row execute function public.set_updated_at();

create trigger pause_sessions_set_updated_at
before update on public.pause_sessions
for each row execute function public.set_updated_at();

-- ============================================================
-- REFLECTION OWNER INTEGRITY TRIGGER
-- ============================================================
create or replace function public.validate_reflection_owner()
returns trigger
language plpgsql
security invoker
as $$
declare
  session_owner uuid;
begin
  select user_id
  into session_owner
  from public.pause_sessions
  where id = new.session_id;

  if session_owner is null or session_owner <> new.user_id then
    raise exception 'Reflection owner does not match session owner';
  end if;

  return new;
end;
$$;

create trigger reflection_owner_guard
before insert or update on public.reflection_entries
for each row execute function public.validate_reflection_owner();
