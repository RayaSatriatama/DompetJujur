-- DompetJujur — Demo Seed Data
-- Jalankan setelah migrations selesai
-- Ganti 'DEMO_USER_UUID' dengan UUID user demo aktual dari Supabase Auth

-- PENTING: File ini menggunakan placeholder UUID.
-- Untuk menggunakan seed ini:
-- 1. Buat user demo di Supabase Auth Dashboard
-- 2. Ganti semua instance 'DEMO_USER_UUID_HERE' dengan UUID tersebut
-- 3. Jalankan: psql $DATABASE_URL -f supabase/seed.sql

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001'; -- ganti dengan UUID aktual
begin
-- Insert mock user to auth.users
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  demo_user_id,
  'authenticated',
  'authenticated',
  'demo@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) on conflict do nothing;

insert into auth.identities (
    provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values (
    demo_user_id::text, demo_user_id, format('{"sub":"%s","email":"%s"}', demo_user_id::text, 'demo@example.com')::jsonb, 'email', now(), now(), now()
) on conflict do nothing;

-- Financial profile demo
insert into public.financial_profiles
  (user_id, monthly_income, mandatory_expenses, debt_payments, income_variable)
values
  (demo_user_id, 5500000, 2500000, 800000, false)
on conflict do nothing;

-- Monthly plan bulan berjalan
insert into public.monthly_plans
  (user_id, month_key, income, mandatory, debt, safety_buffer, flexible_amount)
values
  (
    demo_user_id,
    date_trunc('month', now())::date,
    5500000, 2500000, 800000, 200000,
    2000000
  )
on conflict (user_id, month_key) do nothing;

-- 5 historical pause sessions (is_demo = true)
insert into public.pause_sessions
  (user_id, amount, trigger_type, outcome, urge_before, urge_after,
   started_at, pause_eligible_at, completed_at, is_demo)
values
  (demo_user_id, 350000, 'chasing_loss', 'delayed', 5, 3,
   now() - interval '7 days',
   now() - interval '7 days' + interval '90 seconds',
   now() - interval '7 days' + interval '3 minutes', true),

  (demo_user_id, 200000, 'boredom_escape', 'delayed', 4, 2,
   now() - interval '5 days',
   now() - interval '5 days' + interval '90 seconds',
   now() - interval '5 days' + interval '4 minutes', true),

  (demo_user_id, 500000, 'payday', 'proceeded', 4, 4,
   now() - interval '4 days',
   now() - interval '4 days' + interval '90 seconds',
   now() - interval '4 days' + interval '2 minutes', true),

  (demo_user_id, 150000, 'stress', 'redirected', 3, 1,
   now() - interval '2 days',
   now() - interval '2 days' + interval '90 seconds',
   now() - interval '2 days' + interval '5 minutes', true),

  (demo_user_id, 350000, 'paylater_limit', 'delayed', 5, 3,
   now() - interval '1 day',
   now() - interval '1 day' + interval '90 seconds',
   now() - interval '1 day' + interval '3 minutes', true);

end $$;
