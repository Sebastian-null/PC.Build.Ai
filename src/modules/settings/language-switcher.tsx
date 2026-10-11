"use client";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { updateInterfaceLocale } from "./actions";
export function LanguageSwitcher({ locale }: { locale: "uk" | "en" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  function change(next: "uk" | "en") {
    if (next === locale) return;
    startTransition(async () => {
      await updateInterfaceLocale(next);
      router.replace(pathname, { locale: next });
    });
  }
  return (
    <div className={`settings-language-switcher ${pending ? "pending" : ""}`}>
      <button
        type="button"
        className={locale === "uk" ? "active" : ""}
        onClick={() => change("uk")}
        disabled={pending}
      >
        Українська
      </button>
      <button
        type="button"
        className={locale === "en" ? "active" : ""}
        onClick={() => change("en")}
        disabled={pending}
      >
        English
      </button>
    </div>
  );
}
