import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/modules/auth/components/auth-form";
import { signInWithGoogle } from "@/modules/auth/actions";
import { Link } from "@/shared/i18n/navigation";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function RegisterPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");
  return (
    <>
      <p className="eyebrow">{t("publicBeta")}</p>
      <h1 className="auth-title">{t("registerTitle")}</h1>
      <p className="auth-copy">{t("registerCopy")}</p>
      <form action={signInWithGoogle}>
        <input type="hidden" name="locale" value={locale} />
        <button className="social-button" type="submit">
          G&nbsp;&nbsp;{t("continueGoogle")}
        </button>
      </form>
      <div className="separator">
        <span>{t("or")}</span>
      </div>
      <AuthForm mode="register" locale={locale} />
      <p className="auth-switch">
        {t("hasAccount")} <Link href="/login">{t("loginLink")}</Link>
      </p>
    </>
  );
}
