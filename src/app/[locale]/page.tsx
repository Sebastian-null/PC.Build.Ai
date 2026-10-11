import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/shared/i18n/navigation";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function LandingPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [nav, hero, features, footer] = await Promise.all([
    getTranslations("Navigation"), getTranslations("Hero"), getTranslations("Features"), getTranslations("Footer")
  ]);

  return (
    <main>
      <header className="site-header shell">
        <Link href="/" className="wordmark" aria-label="PCBuilderAI home">PCBuilder<span>AI</span></Link>
        <nav aria-label="Primary navigation">
          <a href="#features">{nav("product")}</a><Link href="/community">{nav("community")}</Link>
        </nav>
        <div className="header-actions"><Link href="/login" className="quiet-link">{nav("signIn")}</Link><Link href="/register" className="button button-small">{nav("getStarted")}</Link></div>
      </header>

      <section className="hero shell">
        <div className="hero-glow" aria-hidden="true" />
        <p className="eyebrow">{hero("eyebrow")}</p>
        <h1>{hero("title")}</h1>
        <p className="hero-copy">{hero("description")}</p>
        <div className="hero-actions"><Link href="/register" className="button">{hero("primary")}</Link><Link href="/community" className="button button-secondary">{hero("secondary")}</Link></div>
        <p className="trust-line">{hero("trust")}</p>
      </section>

      <section id="features" className="feature-grid shell" aria-label={nav("product")}>
        {(["consultant", "compatibility", "pricing"] as const).map((key, index) => (
          <article className="feature-card" key={key}><span className="feature-index">0{index + 1}</span><h2>{features(`${key}Title`)}</h2><p>{features(`${key}Body`)}</p></article>
        ))}
      </section>

      <footer className="footer shell"><span className="wordmark wordmark-small">PCBuilder<span>AI</span></span><p>{footer("notice")}</p><div className="locale-links"><Link href="/" locale="uk">UK</Link><Link href="/" locale="en">EN</Link></div></footer>
    </main>
  );
}
