/* eslint-disable @next/next/no-img-element */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import type { BuildPart } from "@/modules/builds/build-offer-card";
import type { AppLocale } from "@/shared/i18n/routing";
export default async function SavedPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, supabase } = await requireVerifiedUser(locale);
  const t = await getTranslations("Saved");
  const [{ data: buildRefs }, { data: componentRefs }] = await Promise.all([
    supabase
      .from("build_favorites")
      .select("build_id,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("component_favorites")
      .select("id,build_id,component_key,component_snapshot,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  const buildIds = buildRefs?.map((item) => item.build_id) ?? [];
  const { data: builds } = buildIds.length
    ? await supabase
        .from("builds")
        .select("id,title,budget_minor,currency,components")
        .in("id", buildIds)
    : { data: [] };
  const empty = !builds?.length && !componentRefs?.length;
  return (
    <main className="app-page">
      <header className="app-page-header">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("copy")}</p>
        </div>
      </header>
      {empty ? (
        <section className="empty-panel">
          <span>☆</span>
          <h2>{t("emptyTitle")}</h2>
          <p>{t("emptyCopy")}</p>
          <a className="button" href={`/${locale}/builds`}>
            {t("action")}
          </a>
        </section>
      ) : (
        <>
          <section className="saved-section">
            <h2>{t("savedBuilds")}</h2>
            <div className="saved-build-grid">
              {builds?.map((build) => (
                <a key={build.id} href={`/${locale}/builds/${build.id}`}>
                  <span>★</span>
                  <div>
                    <h3>{build.title}</h3>
                    <p>
                      {(build.components as BuildPart[]).length} {t("parts")}
                    </p>
                  </div>
                  <strong>
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: build.currency,
                      maximumFractionDigits: 0,
                    }).format(build.budget_minor / 100)}
                  </strong>
                </a>
              ))}
            </div>
          </section>
          <section className="saved-section">
            <h2>{t("savedComponents")}</h2>
            <div className="saved-component-grid">
              {componentRefs?.map((item) => {
                const part = item.component_snapshot as BuildPart;
                const offer = part.offers?.[0];
                return (
                  <article key={item.id}>
                    <img src={part.image} alt={part.model} />
                    <div>
                      <span>{part.role}</span>
                      <h3>{part.model}</h3>
                      <p>{part.specs?.join(" · ")}</p>
                      {offer && (
                        <a href={offer.url} target="_blank" rel="noopener noreferrer nofollow">
                          {offer.store} ·{" "}
                          {new Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: offer.currency,
                            maximumFractionDigits: 0,
                          }).format(offer.price)}{" "}
                          ↗
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
