-- DompetJujur — Row Level Security
-- Migration: 0002_rls

-- ============================================================
-- ENABLE RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.financial_profiles enable row level security;
alter table public.monthly_plans enable row level security;
alter table public.pause_sessions enable row level security;
alter table public.reflection_entries enable row level security;

-- ============================================================
-- PROFILES (id = auth.uid())
-- ============================================================
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_delete_own"
on public.profiles for delete
using (id = auth.uid());

-- ============================================================
-- FINANCIAL_PROFILES (user_id = auth.uid())
-- ============================================================
create policy "financial_profiles_select_own"
on public.financial_profiles for select
using (user_id = auth.uid());

create policy "financial_profiles_insert_own"
on public.financial_profiles for insert
with check (user_id = auth.uid());

create policy "financial_profiles_update_own"
on public.financial_profiles for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "financial_profiles_delete_own"
on public.financial_profiles for delete
using (user_id = auth.uid());

-- ============================================================
-- MONTHLY_PLANS (user_id = auth.uid())
-- ============================================================
create policy "monthly_plans_select_own"
on public.monthly_plans for select
using (user_id = auth.uid());

create policy "monthly_plans_insert_own"
on public.monthly_plans for insert
with check (user_id = auth.uid());

create policy "monthly_plans_update_own"
on public.monthly_plans for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "monthly_plans_delete_own"
on public.monthly_plans for delete
using (user_id = auth.uid());

-- ============================================================
-- PAUSE_SESSIONS (user_id = auth.uid())
-- ============================================================
create policy "pause_sessions_select_own"
on public.pause_sessions for select
using (user_id = auth.uid());

create policy "pause_sessions_insert_own"
on public.pause_sessions for insert
with check (user_id = auth.uid());

create policy "pause_sessions_update_own"
on public.pause_sessions for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "pause_sessions_delete_own"
on public.pause_sessions for delete
using (user_id = auth.uid());

-- ============================================================
-- REFLECTION_ENTRIES (user_id = auth.uid())
-- ============================================================
create policy "reflection_entries_select_own"
on public.reflection_entries for select
using (user_id = auth.uid());

create policy "reflection_entries_insert_own"
on public.reflection_entries for insert
with check (user_id = auth.uid());

create policy "reflection_entries_update_own"
on public.reflection_entries for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "reflection_entries_delete_own"
on public.reflection_entries for delete
using (user_id = auth.uid());
