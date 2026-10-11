begin;
alter table public.forum_posts add column parent_post_id uuid references public.forum_posts(id) on delete set null;
alter table public.builds add column published_topic_id uuid references public.forum_topics(id) on delete set null;
create index forum_posts_parent_idx on public.forum_posts(parent_post_id) where parent_post_id is not null;
commit;
