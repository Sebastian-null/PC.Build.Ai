begin;

create policy "authors delete topics"
on public.forum_topics for delete to authenticated
using (author_id = (select auth.uid()));

create policy "authors delete posts"
on public.forum_posts for delete to authenticated
using (author_id = (select auth.uid()));

grant delete on public.forum_topics, public.forum_posts to authenticated;

commit;
