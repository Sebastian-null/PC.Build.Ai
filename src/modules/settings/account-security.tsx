import { getTranslations } from "next-intl/server";
import { requestPasswordReset, updateEmail, updatePassword } from "./actions";
export async function AccountSecurity({
  locale,
  email,
  passwordReset,
}: {
  locale: "uk" | "en";
  email: string;
  passwordReset: boolean;
}) {
  const t = await getTranslations("AccountSecurity");
  return (
    <section id="account" className="settings-card">
      <div>
        <h2>{t("account")}</h2>
        <p>{t("accountCopy")}</p>
      </div>
      <div className="credential-row">
        <div>
          <span>{t("email")}</span>
          <strong>{email}</strong>
        </div>
        <details>
          <summary>{t("edit")}</summary>
          <form action={updateEmail} className="credential-edit">
            <input type="hidden" name="locale" value={locale} />
            <label className="settings-field">
              <span>{t("newEmail")}</span>
              <input type="email" name="email" required autoFocus />
            </label>
            <small>{t("emailDoubleConfirm")}</small>
            <button>{t("sendConfirmations")}</button>
          </form>
        </details>
      </div>
      <div className="credential-row">
        <div>
          <span>{t("password")}</span>
          <strong className="masked-password">••••••••••••</strong>
        </div>
        <form action={requestPasswordReset}>
          <input type="hidden" name="locale" value={locale} />
          <button>{t("edit")}</button>
        </form>
      </div>
      <p className="security-hint">{t("passwordEmailHint")}</p>
      {passwordReset && (
        <form action={updatePassword} className="password-reset-panel">
          <h3>{t("setNewPassword")}</h3>
          <input type="hidden" name="locale" value={locale} />
          <div className="settings-form">
            <label className="settings-field">
              <span>{t("newPassword")}</span>
              <input
                type="password"
                name="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </label>
            <label className="settings-field">
              <span>{t("confirmPassword")}</span>
              <input
                type="password"
                name="passwordConfirmation"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </label>
            <button className="button">{t("changePassword")}</button>
          </div>
        </form>
      )}
    </section>
  );
}
