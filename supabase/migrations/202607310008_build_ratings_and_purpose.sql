begin;
alter table public.builds add column purpose text not null default 'gaming' check (purpose in ('gaming','work','3d','streaming','server','general'));
create table public.build_ratings(
  build_id uuid not null references public.builds(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check(rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(build_id,user_id)
);
create index build_ratings_build_idx on public.build_ratings(build_id,rating);
create trigger build_ratings_set_updated_at before update on public.build_ratings for each row execute function public.set_updated_at();
alter table public.build_ratings enable row level security;
create policy "ratings are public" on public.build_ratings for select using(true);
create policy "users create ratings" on public.build_ratings for insert to authenticated with check(user_id=(select auth.uid()));
create policy "users update own ratings" on public.build_ratings for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "users delete own ratings" on public.build_ratings for delete to authenticated using(user_id=(select auth.uid()));
grant select,insert,update,delete on public.build_ratings to authenticated;
grant all on public.build_ratings to service_role;
commit;
