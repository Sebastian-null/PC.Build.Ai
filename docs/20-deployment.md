# Deployment and operations

## Topology

- Vercel hosts the latest stable Next.js application, Route Handlers, streaming endpoints, preview deployments, cron triggers where suitable, Web Analytics/Speed Insights if consent/compliance permits.
- Supabase hosts Auth, PostgreSQL, Storage, and Realtime in a selected region.
- Google Gemini API provides multimodal generation and grounded tools.
- Stripe provides Checkout, Billing Portal, subscriptions, refunds, and webhooks.
- Email and web-push providers are selected before notification implementation.

Region selection must balance USA/Ukraine latency and data obligations; document the actual Supabase region before production data.

## Environments

Local, preview/staging, and production use distinct Supabase, Stripe mode/data, OAuth credentials, Storage, Gemini keys/quotas, webhook secrets, and analytics projects. Vercel preview deployments point only to non-production services. Production secrets are inaccessible to previews.

## Environment variables

Names are finalized during implementation, grouped as:

- Public: site URL, Supabase URL and publishable key, safe analytics identifiers, default locale/version.
- Server: Supabase service role, Gemini API key/model/config, Stripe secret/webhook/price IDs, encryption/signing keys, email/push credentials, monitoring DSN, cron secret.
- Configuration: feature flags should move to protected database/config service where runtime changes are needed.

Provide `.env.example` with placeholders and descriptions, never values. Startup validation fails fast for missing/incompatible variables.

## CI/CD

PR: lint/type/test, migration/RLS verification, production build, dependency/secret scan, preview deployment. Main deploys staging, runs smoke/E2E/AI evaluation, then production promotion with approval while beta risk is high. Apply database migrations before code only when backward-compatible; use expand/migrate/contract for breaking data changes.

## Release and rollback

Use Vercel immutable deployments for application rollback. Database migrations use forward fixes and backups, never casual down migrations on production data. Feature flags disable risky AI/upload/community/billing paths. Every release records app commit, migration set, prompt/schema/rule versions, and known risks.

## Monitoring and alerting

Capture structured logs with request/run/job IDs and redaction. Monitor Web Vitals, route error/latency, Supabase connections/query latency/RLS failures, Realtime disconnects, Storage errors, Gemini latency/429/schema/citation/cost, Stripe webhook lag/failure, job backlog/dead letters, push/email failures, moderation queue age, and compatibility blocker escapes.

Alert on user-impacting symptoms with actionable runbooks; avoid noisy per-error paging. Dashboards separate availability, product funnel, AI quality/cost, billing, moderation, and privacy jobs.

## Analytics

Use consent-aware, data-minimized events from the PRD funnel. No raw prompt, chat, forum body, email, full URL query, ZIP, or uploaded filename in analytics. Stable pseudonymous user IDs only after permitted consent/legal basis. Define event owner, schema, retention, and purpose.

## Operational jobs

Jobs include 24-hour chat purge, export expiry, account deletion/anonymization, strike expiry state, notification delivery, outbox retries, evidence staleness, orphan asset cleanup, and search/read-model refresh. Each has idempotency, lock/concurrency policy, monitoring, manual replay, and dead-letter handling.

## Launch runbook

Verify DNS/TLS/canonical URLs, OAuth/magic-link redirects, Stripe live products/webhook/refund flow, Gemini quota/billing, Supabase backup/PITR and SMTP, admin MFA, legal placeholders, consent, robots/sitemap, rate limits, upload scan, incident contacts, dashboards/alerts, restore/deletion drills, and emergency flags.

## Official references

- [Next.js App Router](https://nextjs.org/docs/app)
- [Vercel Next.js documentation](https://vercel.com/docs/frameworks/nextjs)
- [Supabase documentation](https://supabase.com/docs)
- [Stripe subscriptions](https://docs.stripe.com/billing/subscriptions/overview)

