import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import { createTopic } from "@/modules/community/actions";
import type { AppLocale } from "@/shared/i18n/routing";
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const { supabase } = await requireVerifiedUser(locale);
  const t = await getTranslations("Forum");
  const [{ data: category }, { data: topics }] = await Promise.all([
    supabase
      .from("forum_categories")
      .select("id,title,description")
      .eq("id", id)
      .eq("language", locale)
      .maybeSingle(),
    supabase
      .from("forum_topics")
      .select("id,title,updated_at")
      .eq("category_id", id)
      .order("updated_at", { ascending: false }),
  ]);
  if (!category) notFound();
  return (
    <main className="app-page">
      <a className="back-link" href={`/${locale}/community`}>
        ← {t("back")}
      </a>
      <header className="app-page-header">
        <div>
          <p className="eyebrow">{t("category")}</p>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </div>
      </header>
      <div className="forum-layout">
        <section>
          <div className="topic-list">
            {topics?.length ? (
              topics.map((topic) => (
                <a key={topic.id} href={`/${locale}/community/topic/${topic.id}`}>
                  <h3>{topic.title}</h3>
                  <time>
                    {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                      new Date(topic.updated_at),
                    )}
                  </time>
                </a>
              ))
            ) : (
              <p className="forum-empty">{t("noTopics")}</p>
            )}
          </div>
        </section>
        <aside className="new-topic-card">
          <h2>{t("createTitle")}</h2>
          <form action={createTopic}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="categoryId" value={id} />
            <label>
              <span>{t("topicTitle")}</span>
              <input name="title" minLength={5} maxLength={140} required />
            </label>
            <label>
              <span>{t("message")}</span>
              <textarea name="body" minLength={2} maxLength={10000} rows={7} required />
            </label>
            <button className="button">{t("publish")}</button>
          </form>
        </aside>
      </div>
    </main>
  );
}
