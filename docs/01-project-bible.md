# Project Bible

## Product definition

PCBuilderAI is a public-beta premium SaaS and community for AI-assisted desktop, prebuilt, and server selection. It is labeled as an author's pet project. Verified users converse with Gemini, upload evidence, receive a versioned build, validate it, compare unlimited builds, collaborate, and publish results.

## Immutable beta decisions

| Area | Decision |
|---|---|
| Brand | PCBuilderAI |
| Regions | USA and Ukraine |
| Currency | USD, UAH |
| Locale | System/browser `uk` or `en`; otherwise English; manual override persisted |
| AI | Google Gemini only, selected model configurable server-side |
| Auth | Email/password, magic link, Google; verified email required for AI/community publishing |
| Free | 5 full generations in a rolling 24-hour window from activation; clarification turns do not consume quota |
| Pro | USD 20/month; one-day card-required trial once/account; automatic renewal; unconditional refund within 7 days; no payment grace period |
| Visibility | Profiles and builds public by default; user can make either private |
| Chat | Private by default; revocable share link and explicit publishing; recoverable for 24 hours after deletion |
| Community | Full forum, build showcase, likes, comments, bookmarks, reports, search, language sections |
| Messaging | No user-to-user direct messages |
| Admin | One super-admin |
| Hosting | Vercel + Supabase |

## System boundaries

Next.js is the web application and backend-for-frontend. It owns rendering, locale routing, session-aware orchestration, rate limiting, Gemini calls, Stripe integration, and response streaming. Supabase owns authentication, PostgreSQL, RLS authorization, Storage, Realtime, scheduled retention work, and durable audit state. Gemini owns language/vision/document interpretation and grounded web research, but not authorization, billing truth, quota truth, compatibility truth, or final monetary arithmetic. Stripe owns subscription/payment state; signed webhooks synchronize it.

## Application architecture

Use a modular monolith organized by feature. Next.js Server Components fetch and compose server-owned page data; Client Components are narrow interaction boundaries. Route Handlers form a typed backend-for-frontend and orchestrate sensitive operations. Domain modules contain compatibility, money, quota, moderation, and versioning rules independently of React, Supabase, Gemini, or Stripe. Infrastructure adapters implement persistence and external calls.

State has one owner: URL query parameters for shareable view/filter state; server-rendered/query data for durable remote state; local component state for transient interaction; persisted PostgreSQL state for business truth; Realtime events only as invalidation/presence signals. Do not introduce a global client store until a demonstrated cross-route client-only need exists. AI streaming state is scoped to its run and reconciles with persisted run/message state after reconnect.

Caching is explicit by data class: immutable versions/citations cache safely; public mutable pages use tagged revalidation; private, entitlement, quota, billing, admin, and chat data are `no-store`. Mutations invalidate affected tags. Neither browser nor CDN may share personalized payloads.

Errors use stable codes and correlation IDs. Expected domain failures become localized actionable states; unexpected failures are redacted, logged, monitored, and recoverable without duplicate writes. Structured logs contain identifiers/metrics, never prompt bodies, payment data, secrets, or private uploads. Analytics is consent-aware and content-free; monitoring covers user symptoms, dependencies, jobs, AI quality/cost, and security events.

## Core recommendation contract

A completed build must contain: normalized requirements; country/currency and condition policy; component lines with canonical role, maker/model, normalized specs, condition, source URL, merchant, observed price/time, and confidence; compatibility findings; subtotal; price additions; performance estimates; explanations; alternatives; upgrade path; limitations; and citation map.

The pipeline is `discover → extract evidence → normalize → validate → optimize → price → explain → render`. Any unknown safety-critical fact produces `needs_confirmation`, not a false pass. A build may be shown with warnings, but no known hard incompatibility is styled as recommended.

## Budget policy

The user's hardware budget applies to requested components unless the user explicitly includes OS/peripherals. Owned parts have zero purchase cost but participate in validation. AI iteratively substitutes parts to fit. If impossible, it presents the closest viable option, exact excess, changes attempted, and asks consent to increase budget. It never quietly raises the budget.

USA checkout estimate requests state/ZIP when required and itemizes estimated sales tax. Ukrainian offers display VAT-inclusive pricing when sourced that way. Delivery and store assembly appear outside component budget. For store-specific builds, assembly service is researched, sourced, dated, and shown separately.

## Product safety and trust

- Every price/spec/performance claim has a source and observation time.
- Merchant results pass automated reputation and listing-quality checks; suspicious sources are excluded.
- Results clearly say PCBuilderAI is not a retailer and price/stock may change.
- Used, open-box, refurbished, and discontinued items have persistent badges and condition-specific warnings.
- Performance values are estimates tied to resolution/settings/workload, source, and date.
- User-generated content is distinct from editorial/AI output.

## Moderation constitution

Pre-publication text screening keeps rejected text intact as a draft with actionable, localized feedback. English blocks configured slurs; Ukrainian blocks profanity and personal insults. Rules must be versioned and context-aware enough to minimize quoted/educational false positives, with admin override.

Reported or struck content is hidden pending admin review. Active strikes expire after 182.5 days. Strike 1/2/3 imposes posting timeout of 1/3/7 days; a fourth active strike permanently bans. Ban reason, duration, and optional admin note are visible. Appeals exist unless the admin explicitly marks a decision final/non-appealable. A permanent ban is reviewed only when the user submits an appeal.

## Data lifecycle

Account export and deletion are self-service. Deleting an account removes personal/private data according to retention policy while retained public forum contributions are anonymized as “Deleted account” / “Обліковий запис видалено”. Deleted chats enter a 24-hour recovery state, then their content and attachments are purged. Product-improvement use of chats requires separate opt-in.

## Quality gates before release

- RLS matrix and service-role isolation tested
- Compatibility rule fixtures include positive, negative, unknown, BIOS, connector, clearance, and power cases
- Stripe webhook replay/idempotency tested
- Ukrainian and English copy reviewed by fluent humans
- WCAG 2.2 AA audit on critical flows
- Load and streaming interruption tests pass
- Restore drill, privacy deletion drill, and moderation audit completed
- No unresolved P0/P1 defects or undocumented launch placeholders
