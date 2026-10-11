<div align="center">

# PCBuilderAI

**A bilingual PC-building consultant — natural-language requirements in, a compatible and explainable desktop build out.**

[![CI](https://github.com/Sebastian-null/PC.Build.Ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Sebastian-null/PC.Build.Ai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-8ba4ff.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com)

</div>

![Landing page](./docs/screenshots/01-landing-en.png)

---

## Table of contents

- [What it is](#what-it-is)
- [Project status](#project-status)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Engineering highlights](#engineering-highlights)
- [Data model](#data-model)
- [Security model](#security-model)
- [Running it locally](#running-it-locally)
- [Quality gates](#quality-gates)
- [Roadmap](#roadmap)
- [Specification documents](#specification-documents)
- [Author](#author)

---

## What it is

Buying a desktop PC means joining up benchmarks, retailer listings, socket and clearance tables, regional tax rules, and years of forum advice. Novices cannot do it reliably; experts redo the same research every time. Store configurators are biased toward their own stock, and general-purpose chatbots happily invent prices and claim incompatible parts fit together.

PCBuilderAI is my attempt at the product in between: a consultant that holds a conversation, asks only the questions that actually change the answer, keeps the component subtotal inside the stated budget, and shows taxes, delivery, and assembly as separate lines instead of hiding them in one number.

Three rules shape the whole codebase:

1. **Compatibility before persuasion** — a lower price never overrides a safety rule.
2. **AI proposes, software verifies** — the model interprets and researches; deterministic code validates the normalized result.
3. **Localization is product design** — Ukrainian and English are authored independently, not machine-translated from one another.

## Project status

This is an actively developed personal project in public beta, not a finished commercial product. I would rather show you an accurate map than a marketing page:

| Area | Status | Notes |
| --- | --- | --- |
| Next.js App Router foundation, dark-first responsive UI | **Shipped** | 4 themes, route-intercepting modals, full keyboard/ARIA labelling |
| Ukrainian + English localization | **Shipped** | `next-intl`, locale-prefixed routes, browser detection, in-app switcher |
| Authentication | **Shipped** | Email/password, magic link, email verification, onboarding, Google OAuth callback wired |
| Postgres schema with Row Level Security | **Shipped** | 14 tables, 36 RLS policies, 9 migrations |
| Persistent chat sessions and messages | **Shipped** | History, rename, per-session message threads |
| Build generation and persistence | **Shipped — deterministic engine** | Requirement extraction + build persistence work end to end; the recommendation itself is a rule-based demo engine, **not** a live model yet |
| Component cards, specs, regional store offers | **Shipped — labelled demo data** | Multiple USA/UA retailers with deep search links; every price is explicitly marked `Demo offer` |
| Community forum, threaded replies, build publishing | **Shipped** | Bilingual categories, topics, nested posts, ratings, favourites |
| Account settings, avatars, identity-change limits | **Shipped** | Supabase Storage avatars, cooldown windows on username/display-name changes |
| Live Gemini consultant (streaming, grounded search, citations) | **Next milestone** | The chat route is structured for it; the model call is the missing piece |
| Deterministic compatibility engine (socket/clearance/wattage) | **Planned** | Specified in [`docs/12-ai-architecture.md`](./docs/12-ai-architecture.md) |
| Verified live pricing, tax/VAT, billing, moderation console | **Planned** | Specified; see [Roadmap](#roadmap) |

> **On the demo data:** store cards link to real retailer search pages but the prices are generated, and the UI says so on every card. Presenting generated numbers as live inventory would break the project's own first principle, so the labelling stays until the verified-pricing milestone lands.

## Screenshots

### The consultant collects requirements, then commits to a build

The engine extracts budget, purchase region, workload, storage, and case constraints from free-form text. Anything missing becomes one short clarification question instead of a guess.

| Requirements still missing | All requirements captured |
| --- | --- |
| ![Chat asking a clarifying question](./docs/screenshots/06-chat-clarification.png) | ![Chat returning a complete build](./docs/screenshots/07-chat-build-generated.png) |

### Every component is shown with specs, condition, and competing offers

![Build detail with component cards](./docs/screenshots/09-build-detail.png)

Each card carries a hand-drawn SVG illustration, key specifications, a condition label, and offers from several regional retailers — hardware subtotal kept separate from the final total, and every generated price labelled `Demo offer`.

### Builds can be published to the forum and rated by other members

| Publishing dialog | Published build with community rating |
| --- | --- |
| ![Publish dialog](./docs/screenshots/19-publish-dialog.png) | ![Published build topic](./docs/screenshots/20-community-topic.png) |

Replies are threaded, with the parent post quoted inline so a deep discussion stays readable:

![Threaded forum discussion](./docs/screenshots/21-community-thread.png)

| Saved builds | Community forum |
| --- | --- |
| ![Builds list](./docs/screenshots/08-builds-list.png) | ![Community](./docs/screenshots/10-community.png) |

### Fully bilingual, four themes, mobile-first

| English | Ukrainian |
| --- | --- |
| ![English landing](./docs/screenshots/01-landing-en.png) | ![Ukrainian landing](./docs/screenshots/02-landing-uk.png) |

| Light theme | Mobile |
| --- | --- |
| ![Light theme](./docs/screenshots/16-landing-light.png) | <img src="./docs/screenshots/18-mobile-landing.png" width="300" alt="Mobile landing" /> |

### Account and authentication

| Sign up | Settings |
| --- | --- |
| ![Register](./docs/screenshots/03-register.png) | ![Settings](./docs/screenshots/14-settings.png) |

<details>
<summary>More screenshots — dashboard, saved builds, category view, magic link, empty chat, 404</summary>

The dashboard surfaces community-rated builds with search and rating filters:

![Dashboard](./docs/screenshots/12-dashboard.png)

| Saved builds and favourites | Forum category |
| --- | --- |
| ![Saved builds](./docs/screenshots/13-saved.png) | ![Forum category](./docs/screenshots/11-community-category.png) |

| Magic-link sign-in | Empty chat with starter prompts |
| --- | --- |
| ![Magic link sign-in](./docs/screenshots/04-magic-link.png) | ![Empty chat](./docs/screenshots/05-chat-empty.png) |

| Settings in light theme | Localized 404 |
| --- | --- |
| ![Settings light](./docs/screenshots/15-settings-light.png) | ![Not found](./docs/screenshots/17-not-found.png) |

</details>

## Architecture

```mermaid
flowchart TB
    subgraph browser["Browser"]
        RSC["React Server Component payloads"]
        CC["Client components<br/>chat, dialogs, theme, uploads"]
    end

    subgraph edge["Next.js proxy (middleware)"]
        I18N["next-intl routing<br/>locale detect + prefix"]
        REFRESH["Supabase session refresh<br/>(cookie rotation)"]
    end

    subgraph server["Next.js server runtime"]
        PAGES["Server Components<br/>data loading per route"]
        ACTIONS["27 Server Actions<br/>auth · builds · community · settings"]
        API["Route handlers<br/>/api/v1/demo-chat · /api/v1/chats/:id"]
        GUARD["requireVerifiedUser()<br/>shared auth guard"]
    end

    subgraph supabase["Supabase"]
        AUTH["Auth<br/>password · magic link · OAuth"]
        PG[("Postgres<br/>14 tables · 36 RLS policies")]
        STORE["Storage<br/>avatars bucket"]
    end

    browser --> edge --> server
    PAGES --> GUARD
    ACTIONS --> GUARD
    API --> GUARD
    GUARD --> AUTH
    PAGES -->|"anon key + user JWT<br/>RLS enforced"| PG
    ACTIONS -->|"anon key + user JWT<br/>RLS enforced"| PG
    API -->|"service role<br/>server-only, never shipped"| PG
    ACTIONS --> STORE
```

Two deliberate boundaries are worth calling out:

- **The anon key path is the default.** Pages and Server Actions talk to Postgres with the user's own JWT, so RLS is the real authorization layer rather than a backstop. If a policy is missing, the query returns nothing — it does not silently leak another user's row.
- **The service-role key is quarantined.** It is read only inside route handlers that need to write on the user's behalf after verifying the session, and `src/infrastructure/supabase/server.ts` is marked `server-only` so an accidental client import fails at build time, not in production.

### Directory layout

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (app)/              # authenticated shell: dashboard, chat, builds, community, settings
│   │   │   └── @modal/(.)settings/   # intercepting route: settings as an overlay, deep-linkable
│   │   ├── (auth)/             # login, register, magic link, verify, onboarding
│   │   └── auth/callback/      # OAuth / email-link exchange
│   └── api/v1/                 # route handlers
├── infrastructure/supabase/    # browser, server, and config clients (zod-validated env)
├── modules/                    # feature slices: ai-chat, auth, builds, community, dashboard, settings
└── shared/                     # i18n routing + reusable UI primitives
supabase/migrations/            # 9 ordered, idempotent SQL migrations
docs/                           # 24 specification documents
messages/                       # en.json · uk.json
```

Feature code lives in `src/modules/*`, never in the route tree. Routes stay thin: resolve params, load data, render. That is what keeps a page like `dashboard/page.tsx` readable even though it joins builds, ratings, favourites, authors, and forum posts.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19 | Server Components keep Supabase queries on the server; Server Actions remove a hand-written mutation API |
| Language | TypeScript 6, `strict` | Zero `tsc` errors is a CI gate, not an aspiration |
| Backend | Supabase — Postgres, Auth, Storage | Row Level Security lets authorization live next to the data instead of in app middleware |
| i18n | `next-intl` 4 | Locale-prefixed routing, server-side message loading, no client-side flash of untranslated content |
| Validation | Zod 4 | One schema per boundary: environment variables, form payloads, API request bodies |
| Styling | Hand-written CSS with custom properties | ~3.5k lines, 4 themes from one token set; no UI framework to fight |
| Tooling | ESLint 9 (`--max-warnings=0`), Prettier 3, GitHub Actions | Format, types, lint, build, and `npm audit` all run on every push |

## Engineering highlights

The parts I would want to talk through in a code review:

**Row Level Security as the authorization layer.** 36 policies across 14 tables, written so that `select auth.uid()` is evaluated once per statement rather than once per row — the standard Supabase performance trap. Ownership, public/private visibility, soft deletion, and service-role escalation are each expressed as separate policies instead of one permissive catch-all.

**A shared, non-bypassable auth guard.** Every authenticated page and action funnels through `requireVerifiedUser()`, which checks both the session *and* `email_confirmed_at`, then returns a request-scoped Supabase client. There is no route that re-implements the check slightly differently.

**Session refresh in middleware.** The proxy rotates Supabase auth cookies on every navigation before rendering, so Server Components never receive a stale JWT — and it writes the cookies onto the i18n response rather than a second response object, which is the subtle bug most SSR-auth examples ship with.

**Intercepting routes for the settings overlay.** `@modal/(.)settings` renders settings as an overlay when navigated to in-app, and as a full page on direct load or refresh. One component tree, two presentations, both deep-linkable and both correct with the back button.

**Environment variables validated at the boundary.** `getPublicSupabaseConfig()` parses `process.env` through a Zod schema, so a missing or malformed key fails loudly at the first use with a precise message instead of surfacing as `undefined` inside a Supabase client three layers down.

**Abuse limits modelled in the database.** `identity_change_limits` tracks username and display-name changes per user and applies escalating cooldowns (3 → 7 → 30 days). The counter lives in Postgres under RLS, so it cannot be bypassed by calling the action directly.

**Honest data labelling as a hard constraint.** Generated prices carry an `isDemo` flag from the server through to the rendered card, and the UI is specified to never present unverified data as live inventory. It would have been easier to show clean numbers; the point of the project is that it doesn't.

**Bilingual from the schema up.** Locale is an `app_locale` enum column on profiles, forum categories are partitioned by language, and chat sessions store the locale they were conducted in — so localization survives a page reload, a device change, and a forum query, not just a React context.

## Data model

```mermaid
erDiagram
    auth_users ||--|| profiles : "trigger on signup"
    auth_users ||--|| user_settings : ""
    auth_users ||--o{ user_roles : ""
    auth_users ||--o{ consents : ""
    auth_users ||--o{ identity_change_limits : ""
    profiles ||--o{ chat_sessions : owns
    chat_sessions ||--o{ chat_messages : contains
    chat_sessions ||--o| builds : "generates"
    profiles ||--o{ builds : owns
    builds ||--o{ build_ratings : "rated 1-5"
    builds ||--o{ build_favorites : "saved by"
    builds ||--o| forum_topics : "published as"
    forum_categories ||--o{ forum_topics : groups
    forum_topics ||--o{ forum_posts : contains
    forum_posts ||--o{ forum_posts : "threaded replies"
    profiles ||--o{ component_favorites : ""
```

Nine ordered migrations build this up: identity foundation → chat/build demo → service-role grants → forum, favourites, themes → threaded forum and publication → owner deletion → avatar storage → identity-change limits → build ratings. Each one is wrapped in `begin … commit` and safe to replay on a fresh database.

## Security model

- **No service-role key reaches the browser.** `src/infrastructure/supabase/server.ts` is `server-only`; the service key is read exclusively in route handlers, after the session has been verified with the anon-key client.
- **RLS is the authorization layer**, not a second line of defence — see [Architecture](#architecture).
- **Email verification is enforced**, not merely requested: unverified sessions are rejected by the shared guard and by the chat API.
- **Avatar uploads are constrained at the bucket level** — MIME allow-list and file-size limit in SQL, plus per-user path policies, so the storage rules hold even if the client is bypassed.
- **Local Supabase secrets are not in version control.** `supabase/.temp/` and `.branches/` are git-ignored; `.env.example` documents every key by name with no values.
- **Dependency audit runs in CI** at `--audit-level=high`.

Full threat model and hardening plan: [`docs/14-security.md`](./docs/14-security.md).

## Running it locally

**Prerequisites:** Node.js 22+, Docker Desktop, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
git clone https://github.com/Sebastian-null/PC.Build.Ai.git
cd PC.Build.Ai
npm install

# 1. Start Postgres, Auth, Storage, and Studio locally, applying all migrations
supabase start

# 2. Point the app at the local stack
cp .env.example .env.local
#    Paste the API URL, anon/publishable key, and service-role key
#    printed by `supabase start` (or re-print them with `supabase status`).

# 3. Run it
npm run dev          # http://localhost:3000
```

Sign up with any email address — local Supabase captures outgoing mail in [Mailpit](http://127.0.0.1:54324), so the verification link is waiting there rather than in a real inbox.

To point the app at a hosted Supabase project instead, apply `supabase/migrations/*.sql` in order, then set the site URL and callback URLs under Auth → URL Configuration, and enable the Google provider if you want OAuth.

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` to the browser; only `NEXT_PUBLIC_*` variables are safe to ship.

## Quality gates

```bash
npm run verify        # format:check + typecheck + lint + build — what CI runs
npm run format        # Prettier write
npm run typecheck     # tsc --noEmit, strict
npm run lint          # eslint . --max-warnings=0
npm run build         # production build
```

`main` is protected by the [CI workflow](./.github/workflows/ci.yml): formatting, types, lint, production build, and `npm audit`. Automated tests are the honest gap here — the testing strategy is written up in [`docs/16-testing.md`](./docs/16-testing.md) and is next after the live-model milestone.

## Roadmap

1. **Live Gemini consultant** — streaming responses, multimodal input, grounded Search/URL tools, inline citations, regenerate/continue.
2. **Market truth** — normalized component, merchant, and evidence tables; verified product URLs; USD/UAH; US sales tax by ZIP; Ukrainian VAT; shipping and assembly lines.
3. **Deterministic compatibility engine** — socket/chipset/BIOS, RAM generation and speed, cooler and GPU clearance, PSU wattage and connectors, PCIe topology, each resolving to blocker / warning / unknown.
4. **Build workspace** — immutable versions, alternatives, upgrade paths, sourced performance estimates, unlimited comparison columns.
5. **Community depth** — showcases, bookmarks, search and filtering, automatic translation, public profiles.
6. **Moderation** — pre-publication checks, reports, strikes with expiry, appeals, super-admin console.
7. **Billing** — free quota of five generations per rolling 24 hours, Stripe subscription, trial, unconditional refund window.
8. **Production hardening** — test suite, accessibility audit, analytics and monitoring, deployment pipeline.

Tracked in detail in [`docs/17-roadmap.md`](./docs/17-roadmap.md) and [`docs/23-implementation-status.md`](./docs/23-implementation-status.md).

## Specification documents

The product was specified before it was built; `docs/` holds 24 documents covering vision, requirements, personas, flows, design system, information architecture, database design, AI architecture, API, security, performance, testing, coding standards, and deployment. Start with [`docs/README.md`](./docs/README.md) or the [Project Bible](./docs/01-project-bible.md).

## Author

**Sebastian Horhula-Kovalenko** — [@Sebastian-null](https://github.com/Sebastian-null)

An independent project, built to work through the full path from product specification to shipped, localized, access-controlled software. Released under the [MIT License](./LICENSE). PCBuilderAI is not a retailer and does not sell hardware.
