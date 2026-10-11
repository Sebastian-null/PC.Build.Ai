/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toggleComponentFavorite } from "./favorite-actions";
export type StoreOffer = {
  store: string;
  price: number;
  currency: string;
  url: string;
  availability: string;
  observedAt: string;
  isDemo: boolean;
};
export type BuildPart = {
  role: string;
  model: string;
  image: string;
  condition: string;
  specs: string[];
  offers: StoreOffer[];
};
export function BuildOfferCard({
  part,
  locale,
  buildId,
  isFavorite,
}: {
  part: BuildPart;
  locale: string;
  buildId: string;
  isFavorite: boolean;
}) {
  const t = useTranslations("BuildDetails");
  const [selected, setSelected] = useState(0);
  const offer = part.offers[selected];
  return (
    <article className="component-offer-card">
      <div className="component-visual">
        <img src={part.image} alt={part.model} />
        <span>{part.role}</span>
      </div>
      <div className="component-info">
        <div className="component-heading">
          <div>
            <span className="condition-pill">{part.condition}</span>
            <h2>{part.model}</h2>
          </div>
          <div className="component-price-actions">
            <strong>
              {new Intl.NumberFormat(locale, {
                style: "currency",
                currency: offer?.currency ?? "USD",
                maximumFractionDigits: 0,
              }).format(offer?.price ?? 0)}
            </strong>
            <form action={toggleComponentFavorite}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="buildId" value={buildId} />
              <input type="hidden" name="componentKey" value={part.role} />
              <input type="hidden" name="snapshot" value={JSON.stringify(part)} />
              <button
                className={`favorite-button ${isFavorite ? "active" : ""}`}
                title={t(isFavorite ? "removeFavorite" : "addFavorite")}
              >
                {isFavorite ? "★" : "☆"}
              </button>
            </form>
          </div>
        </div>
        <ul className="spec-chips">
          {part.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
        <div className="offer-label">
          <span>{t("availableAt")}</span>
          <small>{t("demoWarning")}</small>
        </div>
        <div className="offer-options">
          {part.offers.map((item, index) => (
            <button
              key={item.store}
              className={selected === index ? "selected" : ""}
              onClick={() => setSelected(index)}
            >
              <span>{item.store}</span>
              <b>
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: item.currency,
                  maximumFractionDigits: 0,
                }).format(item.price)}
              </b>
              <small>{item.availability}</small>
            </button>
          ))}
        </div>
        {offer && (
          <div className="selected-offer">
            <div>
              <span>{t("selectedStore")}</span>
              <strong>{offer.store}</strong>
              <small>
                {t("checked", {
                  date: new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(offer.observedAt)),
                })}
              </small>
            </div>
            <a href={offer.url} target="_blank" rel="noopener noreferrer nofollow">
              {t("openStore")} ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
