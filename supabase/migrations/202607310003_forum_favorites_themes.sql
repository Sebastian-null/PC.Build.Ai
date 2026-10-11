begin;

alter type public.app_theme add value if not exists 'black';
alter type public.app_theme add value if not exists 'gray';

create table public.build_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  build_id uuid not null references public.builds(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, build_id)
);

create table public.component_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  build_id uuid not null references public.builds(id) on delete cascade,
  component_key text not null,
  component_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, build_id, component_key)
);

create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  language public.app_locale not null,
  slug text not null,
  title text not null,
  description text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique(language, slug)
);

create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories(id) on delete restrict,
  author_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 5 and 140),
  language public.app_locale not null,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null check (char_length(body) between 2 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index forum_topics_category_updated_idx on public.forum_topics(category_id, updated_at desc);
create index forum_posts_topic_created_idx on public.forum_posts(topic_id, created_at);
create trigger forum_topics_set_updated_at before update on public.forum_topics for each row execute function public.set_updated_at();
create trigger forum_posts_set_updated_at before update on public.forum_posts for each row execute function public.set_updated_at();

alter table public.build_favorites enable row level security;
alter table public.component_favorites enable row level security;
alter table public.forum_categories enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;

create policy "users manage build favorites" on public.build_favorites for all to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "users manage component favorites" on public.component_favorites for all to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "categories are public" on public.forum_categories for select using (true);
create policy "topics are public" on public.forum_topics for select using (true);
create policy "verified users create topics" on public.forum_topics for insert to authenticated with check (author_id=(select auth.uid()));
create policy "authors update topics" on public.forum_topics for update to authenticated using (author_id=(select auth.uid())) with check (author_id=(select auth.uid()));
create policy "posts are public" on public.forum_posts for select using (true);
create policy "verified users create posts" on public.forum_posts for insert to authenticated with check (author_id=(select auth.uid()));
create policy "authors update posts" on public.forum_posts for update to authenticated using (author_id=(select auth.uid())) with check (author_id=(select auth.uid()));

grant select, insert, delete on public.build_favorites, public.component_favorites to authenticated;
grant select on public.forum_categories to anon, authenticated;
grant select, insert, update on public.forum_topics, public.forum_posts to authenticated;
grant all on public.build_favorites, public.component_favorites, public.forum_categories, public.forum_topics, public.forum_posts to service_role;

insert into public.forum_categories(language,slug,title,description,position) values
('en','general','General PC discussion','Questions, news, and general hardware discussion.',1),
('en','build-help','Build help','Get feedback and troubleshooting help for your build.',2),
('en','showcases','Build showcases','Share completed systems, photos, and benchmarks.',3),
('uk','general','Загальне обговорення ПК','Питання, новини та обговорення комп’ютерного заліза.',1),
('uk','build-help','Допомога зі збіркою','Отримайте поради й допомогу з вашою конфігурацією.',2),
('uk','showcases','Вітрина збірок','Публікуйте готові системи, фотографії та тести.',3);

commit;
