create table public.math_session_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null,
  status text not null default 'not-started',
  updated_at timestamptz not null default now(),
  constraint math_session_progress_pkey primary key (user_id, session_id),
  constraint math_session_progress_session_id_check
    check (session_id ~ '^(?:[1-9]|1[0-6])[AB]$'),
  constraint math_session_progress_status_check
    check (status in ('not-started', 'practising', 'mastered'))
);

create table public.math_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_part smallint not null default 0,
  open_unit smallint not null default 1,
  updated_at timestamptz not null default now(),
  constraint math_preferences_active_part_check
    check (active_part between 0 and 3),
  constraint math_preferences_open_unit_check
    check (open_unit between 1 and 16),
  constraint math_preferences_location_check
    check (open_unit between (active_part * 4 + 1) and (active_part * 4 + 4))
);

alter table public.math_session_progress enable row level security;
alter table public.math_preferences enable row level security;

create policy "Users can read their session progress"
on public.math_session_progress for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their session progress"
on public.math_session_progress for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their session progress"
on public.math_session_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their session progress"
on public.math_session_progress for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their preferences"
on public.math_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their preferences"
on public.math_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their preferences"
on public.math_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their preferences"
on public.math_preferences for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.math_session_progress from anon;
revoke all on table public.math_preferences from anon;
grant select, insert, update, delete on table public.math_session_progress to authenticated;
grant select, insert, update, delete on table public.math_preferences to authenticated;
