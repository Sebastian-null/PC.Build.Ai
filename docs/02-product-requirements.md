# Product requirements

## Release objective

Ship a public beta in which a verified user can produce, understand, save, compare, collaborate on, and publish a sourced compatible build for the USA or Ukraine, while a super-admin can safely operate billing and community moderation.

## Functional requirements

### Identity and access

- Sign up/sign in with verified email+password, magic link, and Google OAuth.
- AI generation and community publishing require verified email; public browsing may be anonymous.
- Profile defaults public and supports avatar, unique username, bio, activity, statistics, builds, favorites, and future achievement placeholders.
- Account privacy, export, deletion, sessions, consent, locale, theme, notification preferences, and blocked status are manageable.

### AI consultation

- Multiple named chat sessions with history, favorites, search, rename, archive, soft-delete/24-hour restore, share, and publish.
- Stream Markdown plus typed cards for components, prices, comparisons, warnings, and build drafts.
- Inputs: text, images, screenshots, PDF, supported text documents, URLs, CSV, JSON.
- Actions: copy, share, stop, continue, regenerate, retry, cite source, convert to build, compare.
- The assistant extracts budget, country, workloads, owned parts, preferences, hard/soft constraints, aesthetic, noise, form factor, upgrade horizon, and condition consent.
- Only a schema-valid completed generation consumes free quota. Transport/system failures do not; regeneration consumes quota only after explicit confirmation.

### Builds and compatibility

- Build types: custom desktop, prebuilt, server.
- Save immutable versions; editing creates a new draft/version, never mutates historical evidence.
- Validate socket/chipset/BIOS, memory type/speed/capacity topology, cooler socket/TDP/clearance, GPU length/height/slot width, case support, PSU capacity/transient headroom/connectors/standards, storage interfaces/lanes, PCIe interoperability/bifurcation, headers/networking, and upgrade constraints.
- Findings have severity `blocker|warning|info|unknown`, rule version, evidence, explanation, and remediation.
- Compare an unlimited user-selected number of builds; AI summary is optional and off/on persists per user.

### Pricing

- Search broad market results without endorsing a retailer; display merchant, price, availability, URL, condition, timestamp, and verification status.
- Exclude suspicious/unverified merchants and deceptive listings.
- Show component subtotal, then tax/VAT, delivery, assembly, and final estimated total.
- USD/USA and UAH/Ukraine only in beta. Never silently convert a sourced listing; conversions, if shown, include rate source/time.
- No historical-price promise in beta; store snapshots for future trend support.

### Community

- Separate Ukrainian and English sections; any user may participate in both.
- On-demand automatic translation is labeled and never replaces source text.
- Forum categories, topics, posts/replies, component discussions, showcases, comments, likes/reactions, bookmarks, search, filters, reports, edits, and subscriptions.
- No private messages.
- Pre-publication moderation, strikes/timeouts/bans, appeals, and admin audit trail per Project Bible.

### Collaboration and notifications

- Build owner invites registered collaborators as viewer/editor; owner alone controls privacy, deletion, and publishing unless explicitly delegated later.
- Realtime presence/edit notifications use private channels; version conflicts do not overwrite silently.
- In-app and browser push notifications; email is opt-in by type. Include replies, mentions, likes (digestable), collaboration, reports/decisions, account security, billing, and system notices.

### Billing

- Free entitlement: five completed generations per rolling 24 hours beginning with first generation in a window.
- Pro: USD 20 recurring monthly; effectively unlimited normal interactive use under anti-abuse controls.
- Trial: one per account, one day, card required, auto-renew.
- Refund: unconditional within seven days of initial paid charge; cancellation stops future renewal and retains access through paid period unless refunded.
- Failed payment ends Pro when Stripe reports entitlement inactive; no custom grace period.

## Non-functional requirements

- WCAG 2.2 AA, keyboard complete, reduced motion, visible focus, semantic HTML.
- p75 targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 on representative mobile traffic.
- Public-page availability target 99.9%; AI dependency degradation must preserve saved content and explain retry.
- No secrets or service-role credentials in client bundles.
- All mutable endpoints idempotent where retry is plausible and protected against abuse.
- Localized dates/numbers/currencies; timestamps stored UTC.

## Acceptance definition for a generated build

A build is complete only if required roles are filled or explicitly omitted, subtotal arithmetic reconciles, every item has evidence or an unknown marker, blocker validation is zero, warnings are acknowledged, citations resolve, budget status is explicit, and the output schema/version is stored. Otherwise it remains a draft.

## Analytics funnel

`landing_view → signup_started → email_verified → consultation_started → generation_completed → build_validated → build_saved → comparison_used → build_published → pro_trial_started → subscription_active`. Each event is consent-aware, excludes prompt/content by default, and carries schema version.

