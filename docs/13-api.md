# API architecture

## Style and boundaries

Use Next.js Route Handlers as a typed backend-for-frontend. Server Actions are acceptable for tightly coupled form mutations, but public/stable operations, streaming, webhooks, uploads, and integrations use `/api/v1`. Supabase direct client reads are allowed only where RLS policy and payload shape are simple; sensitive writes go through server orchestration.

All contracts are TypeScript-derived and runtime-validated. JSON uses camelCase externally and database mapping internally. Errors follow a consistent envelope: `code`, localized-safe `messageKey`, `details` (non-sensitive), `requestId`, and optional `retryAfter`.

## Endpoint groups

| Group | Representative operations |
|---|---|
| `/api/v1/ai` | generation stream, cancel, regenerate, upload extraction status, quota |
| `/api/v1/chats` | list/create/read/update/archive/delete/restore, message search, share/publish/revoke |
| `/api/v1/builds` | CRUD metadata, versions, validate, refresh evidence, publish/privacy, collaborators |
| `/api/v1/comparisons` | create/items/snapshot/AI summary/share |
| `/api/v1/community` | categories, topics, posts, build comments, likes, bookmarks, reports, translations |
| `/api/v1/notifications` | list/read/read-all/preferences/push subscription |
| `/api/v1/profile` | profile/settings/consents/export/deletion |
| `/api/v1/billing` | checkout, portal, subscription summary, refund request |
| `/api/v1/admin` | queues, case actions, users/sanctions/appeals, category/settings/audit |
| `/api/webhooks/stripe` | signed raw-body webhook; not under user auth |

## AI stream protocol

Use SSE or fetch-readable streaming with events: `run.started`, `stage.changed`, `text.delta`, `citation.added`, `card.ready`, `usage.committed`, `run.completed`, `run.failed`. Every event contains run ID and monotonic sequence. Only `card.ready` payloads have passed schema and deterministic checks. Client reconnect sends last event ID where supported; otherwise fetch run state.

## Authentication and authorization

Resolve Supabase session on server. Mutations require CSRF-safe same-site strategy/origin validation as appropriate, verified email, ownership/permission, active sanction checks for publishing, and entitlement/quota for full generation. Admin endpoints recheck super-admin role and generate audit events.

## Idempotency and concurrency

Require `Idempotency-Key` for generation, checkout, refund, publish, invitations, and destructive retries. Store request hash/result; reuse with different payload is an error. Build-version writes include base version/ETag; conflict returns `409` with merge/fork metadata. Stripe events are unique by event ID and processed transactionally/outbox-driven.

## Pagination, filtering, and cache

Use cursor pagination (`createdAt,id` or domain sort key), never large offsets for feeds. Validate allowlisted sorts/filters. Public immutable build versions may use CDN revalidation; personalized/private/admin/billing/quota responses are `private, no-store`. Mutation responses invalidate cache tags for affected public entities.

## Rate and size limits

Layer limits by IP (hashed), account, route, subscription, and concurrency. Pro “unlimited” means ordinary interactive usage: bounded concurrent AI runs, burst rate, upload/day and context-size caps, plus automated-abuse suspension/review. Limits are disclosed in fair-use terms and return 429 with retry timing. Exact values remain configuration, not source constants.

Initial upload policy recommendation: images ≤15 MB each, PDF/docs ≤25 MB, structured text ≤5 MB, max 10 attachments/message and 50 MB aggregate; tune to Gemini/Vercel current limits before implementation.

## Webhook and background semantics

Verify Stripe signature against raw body, store event before processing, tolerate duplicates/out-of-order delivery, and derive entitlement from authoritative subscription state. Long work uses durable outbox/job execution rather than holding a request. Each job has attempts, exponential backoff, dead-letter state, correlation ID, and idempotent handler.

## API security

Allowlist outbound URL schemes/ports; resolve and recheck DNS to prevent SSRF; block private/link-local metadata networks. Sanitize Markdown/HTML. Signed share tokens are stored hashed. Do not accept user-provided database filters, model tool definitions, locale message keys, redirects, or Storage paths without validation.
