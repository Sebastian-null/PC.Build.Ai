# Folder structure

Proposed modular monolith for the implementation phase:

```text
/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ (marketing)/
│  │  │  ├─ (auth)/
│  │  │  ├─ (app)/
│  │  │  ├─ (community)/
│  │  │  └─ admin/
│  │  ├─ api/v1/
│  │  ├─ api/webhooks/stripe/
│  │  ├─ global-error.tsx
│  │  ├─ not-found.tsx
│  │  └─ robots.ts, sitemap.ts
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ profiles/
│  │  ├─ ai-chat/
│  │  ├─ builds/
│  │  ├─ compatibility/
│  │  ├─ pricing/
│  │  ├─ comparisons/
│  │  ├─ collaboration/
│  │  ├─ community/
│  │  ├─ moderation/
│  │  ├─ notifications/
│  │  ├─ billing/
│  │  └─ admin/
│  ├─ shared/
│  │  ├─ ui/
│  │  ├─ i18n/
│  │  ├─ validation/
│  │  ├─ observability/
│  │  ├─ security/
│  │  └─ utils/
│  ├─ infrastructure/
│  │  ├─ supabase/
│  │  ├─ gemini/
│  │  ├─ stripe/
│  │  ├─ search/
│  │  ├─ mail/
│  │  └─ push/
│  └─ proxy.ts
├─ supabase/
│  ├─ migrations/
│  ├─ seed.sql
│  ├─ tests/
│  └─ config.toml
├─ messages/{uk,en}/
├─ public/
├─ tests/{e2e,fixtures,ai-evals,performance}/
├─ docs/
├─ scripts/
└─ configuration files
```

## Module anatomy

Each `modules/<feature>` may contain `domain/` (entities/rules), `application/` (use cases), `infrastructure/` (repositories/adapters), `ui/`, `schemas/`, and tests. Export through a deliberate public index; modules do not deep-import one another. Cross-module workflows depend on application ports/events, not database tables from UI.

## Dependency direction

`app/presentation → application → domain`; infrastructure implements domain/application ports. Domain imports no Next.js, Supabase, Gemini, Stripe, React, or localization runtime. Shared is small and genuinely cross-cutting; it must not become a miscellaneous business-logic folder.

## Route ownership

Route files compose module APIs and remain thin. Authentication/locale coarse redirects may occur in `proxy.ts`, but database authorization belongs in server logic/RLS. Loading/error/not-found boundaries live at the closest meaningful segment.

## Tests and generated content

Database-generated types live under infrastructure and are never hand-edited. Compatibility fixtures and AI schemas live with their owning module; end-to-end fixtures contain synthetic data. Translation catalogs are split by namespace to prevent monolithic loading while enforcing UK/EN key parity.

