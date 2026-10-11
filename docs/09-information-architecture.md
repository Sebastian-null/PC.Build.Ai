# Information architecture

## Route strategy

Use locale-prefixed public routes: `/{locale}/...`, where locale is `uk` or `en`. Locale detection redirects only on first undecided visit; stored preference wins. Canonical/hreflang metadata prevents duplicate indexing. Private app routes may remain locale-prefixed for consistent links.

## Route map

```text
/{locale}
├─ /login /register /verify /forgot-password /auth/callback
├─ /dashboard
├─ /chat /chat/[sessionId]
├─ /builds /builds/new /builds/[slug] /builds/[slug]/versions/[version]
├─ /compare /compare/[comparisonId]
├─ /saved
├─ /community
│  ├─ /[language]
│  ├─ /[language]/forum
│  ├─ /[language]/forum/[categorySlug]
│  ├─ /[language]/topic/[topicSlug]
│  ├─ /[language]/showcases
│  └─ /components/[componentSlug]
├─ /users/[username]
├─ /settings/{profile,account,privacy,notifications,billing,appearance,data}
├─ /notifications
├─ /admin/{overview,reports,moderation,users,appeals,forum,billing,audit,settings}
├─ /legal /privacy /terms /contact
└─ /share/{chat|build|comparison}/[token]
```

404 and error boundaries exist globally and per major app segment. Shared links use unguessable revocable tokens and locale-neutral entry that resolves viewer locale.

## Navigation

Public header: Product, Community, FAQ, Sign in, Get started. Authenticated app navigation: Dashboard, Chat, Builds, Compare, Community; utilities: Search, Notifications, Profile. Admin appears only after server-verified authorization.

## Page responsibilities

- Dashboard summarizes quota/subscription, active consultation, recent builds/chats, collaboration, and important notifications.
- Chat owns conversation only; completed builds link to durable Build Details.
- Build Details is the source of truth for a version, validation, sources, totals, and actions.
- Saved Builds aggregates own, bookmarked, favorite, and collaborated builds with filters.
- Community is discovery; Forum is discussion hierarchy; showcases are published build-centric content.
- User Profile never exposes private activity, private builds, email, subscription, strikes, or moderation history.

## Search architecture

One command palette federates authorized scopes: chats, own/shared builds, public builds, users, topics, and posts. Search results identify scope, language, visibility, and content type. PostgreSQL full-text/trigram serves beta; design an adapter boundary for a future dedicated engine.

## URL and identifier rules

Human pages use immutable IDs internally plus mutable unique slugs for presentation. Old slugs redirect. Sensitive entities never expose sequential IDs. Query parameters hold reversible view state (filters/sort/selected builds); durable shares store a snapshot and use a stable token.

## Sitemap and SEO

Index landing, legal, public profiles (unless opted out), public build versions, categories, topics, and showcases. Never index private/app pages, raw share links, search/filter explosion, or machine translations as separate originals. Structured data may describe articles/discussions, but must not misrepresent volatile Offer availability.
