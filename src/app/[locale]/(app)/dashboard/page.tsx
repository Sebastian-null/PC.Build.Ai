import type { Route } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import { BestBuilds, type BestBuild } from "@/modules/dashboard/best-builds";
import type { AppLocale } from "@/shared/i18n/routing";
type Part = { role: string; model: string };
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, supabase } = await requireVerifiedUser(locale);
  const t = await getTranslations("Home");
  const [{ data: profile }, { data: ratings }, { data: favorites }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name,username,onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("build_ratings").select("build_id,rating"),
    supabase.from("build_favorites").select("build_id").eq("user_id", user.id),
  ]);
  if (!profile?.onboarding_completed_at) redirect(`/${locale}/onboarding` as Route);
  const groups = new Map<string, number[]>();
  for (const item of ratings ?? []) {
    const list = groups.get(item.build_id) ?? [];
    list.push(item.rating);
    groups.set(item.build_id, list);
  }
  const topIds = [...groups]
    .filter(([, values]) => values.reduce((a, b) => a + b, 0) / values.length >= 3)
    .map(([id]) => id);
  const { data: buildRows } = topIds.length
    ? await supabase
        .from("builds")
        .select("id,owner_id,published_topic_id,title,purpose,components")
        .in("id", topIds)
        .not("published_topic_id", "is", null)
    : { data: [] };
  const ownerIds = [...new Set((buildRows ?? []).map((item) => item.owner_id))];
  const topicIds = (buildRows ?? []).flatMap((item) =>
    item.published_topic_id ? [item.published_topic_id] : [],
  );
  const [{ data: authors }, { data: posts }] = await Promise.all([
    ownerIds.length
      ? supabase.from("profiles").select("id,username,display_name,avatar_path").in("id", ownerIds)
      : Promise.resolve({ data: [] }),
    topicIds.length
      ? supabase
          .from("forum_posts")
          .select("topic_id,body,created_at")
          .in("topic_id", topicIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);
  const favoriteIds = new Set(favorites?.map((item) => item.build_id) ?? []);
  const builds: BestBuild[] = (buildRows ?? [])
    .map((build) => {
      const values = groups.get(build.id) ?? [];
      const author = authors?.find((item) => item.id === build.owner_id);
      return {
        id: build.id,
        topicId: build.published_topic_id!,
        title: build.title,
        purpose: build.purpose,
        components: build.components as Part[],
        author: author?.display_name || author?.username || t("deletedUser"),
        avatarUrl: author?.avatar_path
          ? supabase.storage.from("avatars").getPublicUrl(author.avatar_path).data.publicUrl
          : null,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        ratingCount: values.length,
        comments: (posts ?? [])
          .filter((item) => item.topic_id === build.published_topic_id)
          .slice(0, 2)
          .map((item) => item.body),
        favorite: favoriteIds.has(build.id),
      };
    })
    .sort((a, b) => b.average - a.average);
  const nav = [
    { href: "chat", icon: "✦", key: "assistant" },
    { href: "community", icon: "◎", key: "forum" },
    { href: "builds", icon: "▦", key: "myBuilds" },
    { href: "saved", icon: "☆", key: "saved" },
  ] as const;
  return (
    <main className="app-page home-dashboard">
      <header className="home-welcome">
        <h1>
          {t("welcome", { name: profile.display_name || profile.username || user.email || "" })}
        </h1>
        <p>{t("intro")}</p>
      </header>
      <section className="home-nav-grid">
        {nav.map((item) => (
          <a href={`/${locale}/${item.href}`} key={item.key}>
            <span>{item.icon}</span>
            <h2>{t(item.key)}</h2>
            {item.key === "assistant" && <strong>{t("generations", { count: 5 })}</strong>}
          </a>
        ))}
      </section>
      <BestBuilds builds={builds} locale={locale} />
    </main>
  );
}
