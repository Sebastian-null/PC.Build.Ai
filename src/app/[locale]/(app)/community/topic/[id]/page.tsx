import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import { deleteTopic } from "@/modules/community/actions";
import { ThreadedPosts } from "@/modules/community/threaded-posts";
import { StarRating } from "@/modules/builds/star-rating";
import { ConfirmSubmitButton } from "@/shared/ui/confirm-submit-button";
import type { AppLocale } from "@/shared/i18n/routing";
export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const { user, supabase } = await requireVerifiedUser(locale);
  const t = await getTranslations("Forum");
  const [{ data: topic }, { data: posts }, { data: build }] = await Promise.all([
    supabase
      .from("forum_topics")
      .select("id,title,author_id,created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("forum_posts")
      .select("id,author_id,parent_post_id,body,created_at")
      .eq("topic_id", id)
      .order("created_at"),
    supabase.from("builds").select("id").eq("published_topic_id", id).maybeSingle(),
  ]);
  if (!topic) notFound();
  const authorIds = [
    ...new Set((posts ?? []).flatMap((post) => (post.author_id ? [post.author_id] : []))),
  ];
  const [{ data: profiles }, { data: ratings }] = await Promise.all([
    authorIds.length
      ? supabase.from("profiles").select("id,username,display_name").in("id", authorIds)
      : Promise.resolve({ data: [] }),
    build
      ? supabase.from("build_ratings").select("user_id,rating").eq("build_id", build.id)
      : Promise.resolve({ data: [] }),
  ]);
  const average = ratings?.length
    ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
    : 0;
  const mine = ratings?.find((item) => item.user_id === user.id)?.rating ?? 0;
  return (
    <main className="app-page topic-page">
      <a className="back-link" href={`/${locale}/community`}>
        ← {t("back")}
      </a>
      <header className="topic-header">
        <div>
          <p className="eyebrow">{t("discussion")}</p>
          <h1>{topic.title}</h1>
          <span>{t("replies", { count: Math.max((posts?.length ?? 1) - 1, 0) })}</span>
        </div>
        <div className="topic-header-actions">
          {build && (
            <StarRating
              buildId={build.id}
              topicId={id}
              locale={locale}
              value={mine}
              average={average}
              count={ratings?.length ?? 0}
            />
          )}{" "}
          {topic.author_id === user.id && (
            <form action={deleteTopic}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="topicId" value={id} />
              <ConfirmSubmitButton className="danger-button" message={t("deleteTopicConfirm")}>
                {t("deleteTopic")}
              </ConfirmSubmitButton>
            </form>
          )}
        </div>
      </header>
      <section className="thread-list">
        <ThreadedPosts
          posts={posts ?? []}
          profiles={profiles ?? []}
          locale={locale}
          topicId={id}
          currentUserId={user.id}
        />
      </section>
    </main>
  );
}
