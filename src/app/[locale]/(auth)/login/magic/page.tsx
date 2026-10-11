import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/modules/auth/components/auth-form";
import { Link } from "@/shared/i18n/navigation";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function MagicLinkPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");
  return (
    <>
      <p className="eyebrow">{t("passwordless")}</p>
      <h1 className="auth-title">{t("magicTitle")}</h1>
      <p className="auth-copy">{t("magicCopy")}</p>
      <AuthForm mode="magic" locale={locale} />
      <p className="auth-switch">
        <Link href="/login">{t("backToPassword")}</Link>
      </p>
    </>
  );
}
