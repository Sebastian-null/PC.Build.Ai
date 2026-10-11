"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { completeOnboarding } from "../actions";

export function OnboardingForm({ locale }: { locale: "uk" | "en" }) {
  const t = useTranslations("Onboarding");
  const [state, action, pending] = useActionState(completeOnboarding, {});
  return (
    <form action={action} className="auth-form">
      <input type="hidden" name="locale" value={locale} />
      <label className="field">
        <span>{t("username")}</span>
        <input
          name="username"
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z0-9_]+"
          required
          autoComplete="username"
        />
        <small>{t("usernameHint")}</small>
      </label>
      <label className="check-row">
        <input type="checkbox" name="ageConfirmed" required />
        <span>{t("ageConfirmation")}</span>
      </label>
      <label className="check-row">
        <input type="checkbox" name="legalAccepted" required />
        <span>{t("legalAcceptance")}</span>
      </label>
      {state.error && (
        <p className="form-message form-error" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      )}
      <button className="button auth-submit" disabled={pending}>
        {pending ? t("working") : t("continue")}
      </button>
    </form>
  );
}
