import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/modules/auth/components/auth-form";
import { signInWithGoogle } from "@/modules/auth/actions";
import { Link } from "@/shared/i18n/navigation";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");
  const { status } = await searchParams;
  return (
    <>
      <p className="eyebrow">{t("welcomeBack")}</p>
      <h1 className="auth-title">{t("loginTitle")}</h1>
      <p className="auth-copy">{t("loginCopy")}</p>
      {status && <p className="form-message form-error">{t(`errors.${status}`)}</p>}
      <form action={signInWithGoogle}>
        <input type="hidden" name="locale" value={locale} />
        <button className="social-button" type="submit">
          G&nbsp;&nbsp;{t("continueGoogle")}
        </button>
      </form>
      <div className="separator">
        <span>{t("or")}</span>
      </div>
      <AuthForm mode="login" locale={locale} />
      <p className="auth-switch">
        <Link href="/login/magic">{t("useMagicLink")}</Link>
      </p>
      <p className="auth-switch">
        {t("noAccount")} <Link href="/register">{t("registerLink")}</Link>
      </p>
    </>
  );
}
