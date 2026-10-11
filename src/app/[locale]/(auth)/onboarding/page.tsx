import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import { OnboardingForm } from "@/modules/auth/components/onboarding-form";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireVerifiedUser(locale);
  const t = await getTranslations("Onboarding");
  return (
    <>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="auth-title">{t("title")}</h1>
      <p className="auth-copy">{t("copy")}</p>
      <OnboardingForm locale={locale} />
    </>
  );
}
