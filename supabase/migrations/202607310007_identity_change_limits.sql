begin;

create table public.identity_change_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('display_name','username')),
  change_count integer not null default 0 check (change_count >= 0),
  last_changed_at timestamptz,
  reset_at timestamptz,
  primary key (user_id,kind)
);

alter table public.identity_change_limits enable row level security;
create policy "users read own identity limits" on public.identity_change_limits for select to authenticated using (user_id=(select auth.uid()));
create policy "users create own identity limits" on public.identity_change_limits for insert to authenticated with check (user_id=(select auth.uid()));
create policy "users update own identity limits" on public.identity_change_limits for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
grant select,insert,update on public.identity_change_limits to authenticated;
grant all on public.identity_change_limits to service_role;

commit;
