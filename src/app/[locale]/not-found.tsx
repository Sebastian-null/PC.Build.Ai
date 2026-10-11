import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <main className="centered">
      <p className="eyebrow">404</p>
      <h1>{t("title")}</h1>
      <p>{t("copy")}</p>
    </main>
  );
}
