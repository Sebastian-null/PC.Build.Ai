"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { sendMagicLink, signInWithPassword, signUp } from "../actions";
import type { AuthActionState } from "../schemas";

const initialState: AuthActionState = {};

export function AuthForm({
  mode,
  locale,
}: {
  mode: "login" | "register" | "magic";
  locale: "uk" | "en";
}) {
  const t = useTranslations("Auth");
  const action =
    mode === "register" ? signUp : mode === "magic" ? sendMagicLink : signInWithPassword;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="auth-form">
      <input type="hidden" name="locale" value={locale} />
      {mode === "register" && (
        <Field label={t("displayName")} name="displayName" autoComplete="name" />
      )}
      <Field label={t("email")} name="email" type="email" autoComplete="email" />
      {mode !== "magic" && (
        <Field
          label={t("password")}
          name="password"
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          hint={mode === "register" ? t("passwordHint") : undefined}
        />
      )}
      {state.error && (
        <p className="form-message form-error" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      )}
      {state.success && (
        <p className="form-message form-success" role="status">
          {t(`success.${state.success}`)}
        </p>
      )}
      <button className="button auth-submit" disabled={pending}>
        {pending
          ? t("working")
          : t(
              mode === "register" ? "createAccount" : mode === "magic" ? "sendMagicLink" : "signIn",
            )}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  ...props
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}
