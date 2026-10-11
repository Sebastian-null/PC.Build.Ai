"use client";
import{usePathname}from"@/shared/i18n/navigation";import{useTranslations}from"next-intl";import{Link}from"@/shared/i18n/navigation";
export function HomeBackLink(){const pathname=usePathname();const t=useTranslations("Navigation");if(pathname==="/dashboard")return null;return <Link href="/dashboard" className="global-home-back" aria-label={t("home")}><span>←</span>{t("home")}</Link>}
