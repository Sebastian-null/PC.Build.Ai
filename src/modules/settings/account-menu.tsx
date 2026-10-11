/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/shared/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "@/modules/auth/actions";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";
export function AccountMenu({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("AccountMenu");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <div className="account-menu" ref={ref}>
      <button
        className="account-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={t("open")}
      >
        <span className="menu-avatar">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : name.slice(0, 1).toUpperCase()}
        </span>
        <span className="menu-name">{name}</span>
        <b>☰</b>
      </button>
      {open && (
        <div className="account-menu-panel">
          <div className="menu-section">
            <span>{t("theme")}</span>
            <ThemeSwitcher />
          </div>
          <div className="menu-section">
            <span>{t("language")}</span>
            <div className="quick-languages">
              <button
                className={locale === "uk" ? "active" : ""}
                onClick={() => router.replace(pathname, { locale: "uk" })}
              >
                УКР
              </button>
              <button
                className={locale === "en" ? "active" : ""}
                onClick={() => router.replace(pathname, { locale: "en" })}
              >
                ENG
              </button>
            </div>
          </div>
          <Link href="/settings" className="menu-settings-link" onClick={() => setOpen(false)}>
            ⚙ {t("settings")}
          </Link>
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button className="menu-signout">↪ {t("signOut")}</button>
          </form>
        </div>
      )}
    </div>
  );
}
