import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/shared/i18n/navigation";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function VerifyPage({ params, searchParams }: { params: Promise<{ locale: AppLocale }>; searchParams: Promise<{ status?: string }> }) {
  const { locale } = await params; setRequestLocale(locale); const t = await getTranslations("Verify"); const { status } = await searchParams;
  return <div className="auth-center"><div className="mail-icon" aria-hidden="true">✉</div><h1 className="auth-title">{t("title")}</h1><p className="auth-copy">{t(status === "verificationRequired" ? "required" : "copy")}</p><Link href="/login" className="button">{t("back")}</Link></div>;
}
