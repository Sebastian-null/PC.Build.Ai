/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toggleBuildFavorite } from "@/modules/builds/favorite-actions";
export type BestBuild = {
  id: string;
  topicId: string;
  title: string;
  purpose: string;
  components: Array<{ role: string; model: string }>;
  author: string;
  avatarUrl: string | null;
  average: number;
  ratingCount: number;
  comments: string[];
  favorite: boolean;
};
export function BestBuilds({ builds, locale }: { builds: BestBuild[]; locale: "uk" | "en" }) {
  const t = useTranslations("Home");
  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("all");
  const [rating, setRating] = useState(3);
  const visible = useMemo(
    () =>
      builds.filter(
        (build) =>
          (purpose === "all" || build.purpose === purpose) &&
          build.average >= rating &&
          `${build.title} ${build.author} ${build.components.map((item) => item.model).join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [builds, purpose, rating, search],
  );
  return (
    <section className="best-builds">
      <div className="best-builds-heading">
        <div>
          <p className="eyebrow">{t("communityChoice")}</p>
          <h2>{t("bestBuilds")}</h2>
        </div>
        <div className="build-filters">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("search")}
          />
          <select value={purpose} onChange={(event) => setPurpose(event.target.value)}>
            <option value="all">{t("allPurposes")}</option>
            {["gaming", "work", "3d", "streaming", "server", "general"].map((value) => (
              <option value={value} key={value}>
                {t(`purposes.${value}`)}
              </option>
            ))}
          </select>
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            {[3, 4, 5].map((value) => (
              <option value={value} key={value}>
                {value}+ ★
              </option>
            ))}
          </select>
        </div>
      </div>
      {visible.length ? (
        <div className="best-build-grid">
          {visible.map((build) => (
            <article className="best-build-card" key={build.id}>
              <header>
                <div className="build-author">
                  <span>
                    {build.avatarUrl ? (
                      <img src={build.avatarUrl} alt="" />
                    ) : (
                      build.author.slice(0, 1).toUpperCase()
                    )}
                  </span>
                  <div>
                    <strong>{build.author}</strong>
                    <small>{t(`purposes.${build.purpose}`)}</small>
                  </div>
                </div>
                <div className="best-rating">
                  <strong>{build.average.toFixed(1)} ★</strong>
                  <small>{build.ratingCount}</small>
                </div>
              </header>
              <h3>{build.title}</h3>
              <ul>
                {build.components.map((part) => (
                  <li key={part.role}>
                    <span>{part.role}</span>
                    <b>{part.model}</b>
                  </li>
                ))}
              </ul>
              {build.comments.length > 0 && (
                <div className="build-comments">
                  {build.comments.map((comment, index) => (
                    <p key={index}>“{comment.slice(0, 150)}”</p>
                  ))}
                </div>
              )}
              <footer>
                <form action={toggleBuildFavorite}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="buildId" value={build.id} />
                  <button className={build.favorite ? "active" : ""}>
                    {build.favorite ? "★" : "☆"} {t("favorite")}
                  </button>
                </form>
                <a href={`/${locale}/community/topic/${build.topicId}`}>{t("discussion")} →</a>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="best-builds-empty">{t("noBestBuilds")}</div>
      )}
    </section>
  );
}
