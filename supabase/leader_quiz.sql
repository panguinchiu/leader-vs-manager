-- 領導人 vs 經理人 測驗：Supabase 資料表（僅建立 leader_quiz_responses，不影響其他資料表）
create extension if not exists pgcrypto;

create table if not exists public.leader_quiz_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  grade text,
  answers jsonb,
  leader_score int,
  manager_score int,
  leader_pct int,
  dimensions jsonb,
  result_type text,
  result_title text
);

alter table public.leader_quiz_responses enable row level security;

drop policy if exists "leader_quiz anon insert" on public.leader_quiz_responses;
create policy "leader_quiz anon insert" on public.leader_quiz_responses
  for insert to anon with check (true);

drop policy if exists "leader_quiz auth select" on public.leader_quiz_responses;
create policy "leader_quiz auth select" on public.leader_quiz_responses
  for select to authenticated using (true);

drop policy if exists "leader_quiz auth delete" on public.leader_quiz_responses;
create policy "leader_quiz auth delete" on public.leader_quiz_responses
  for delete to authenticated using (true);

grant insert on public.leader_quiz_responses to anon;
grant select, delete on public.leader_quiz_responses to authenticated;
