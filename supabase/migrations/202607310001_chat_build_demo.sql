begin;

create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New consultation' check (char_length(title) between 1 and 120),
  locale public.app_locale not null default 'en',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 20000),
  created_at timestamptz not null default now()
);

create table public.builds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_session_id uuid references public.chat_sessions(id) on delete set null,
  title text not null check (char_length(title) between 1 and 120),
  budget_minor bigint not null check (budget_minor >= 0),
  currency text not null check (currency in ('USD', 'UAH')),
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  status text not null default 'draft' check (status in ('draft', 'validated')),
  components jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chat_sessions_owner_updated_idx on public.chat_sessions(owner_id, updated_at desc);
create index chat_messages_session_created_idx on public.chat_messages(session_id, created_at);
create index builds_owner_created_idx on public.builds(owner_id, created_at desc);

create trigger chat_sessions_set_updated_at before update on public.chat_sessions
for each row execute function public.set_updated_at();
create trigger builds_set_updated_at before update on public.builds
for each row execute function public.set_updated_at();

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.builds enable row level security;

create policy "owners manage chat sessions" on public.chat_sessions
for all to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "owners read chat messages" on public.chat_messages
for select to authenticated using (exists (
  select 1 from public.chat_sessions s where s.id = session_id and s.owner_id = (select auth.uid())
));
create policy "owners create chat messages" on public.chat_messages
for insert to authenticated with check (
  author_id = (select auth.uid()) and role = 'user' and exists (
    select 1 from public.chat_sessions s where s.id = session_id and s.owner_id = (select auth.uid())
  )
);

create policy "public or owned builds are readable" on public.builds
for select using (visibility = 'public' or owner_id = (select auth.uid()));
create policy "owners create builds" on public.builds
for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "owners update builds" on public.builds
for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "owners delete builds" on public.builds
for delete to authenticated using (owner_id = (select auth.uid()));

grant select, insert, update, delete on public.chat_sessions to authenticated;
grant select, insert on public.chat_messages to authenticated;
grant select, insert, update, delete on public.builds to authenticated;

commit;
