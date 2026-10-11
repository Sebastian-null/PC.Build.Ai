# Performance and scalability

## Targets

At p75 real-user mobile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. API non-AI reads target p95 <500ms in-region; normal writes <800ms. AI first meaningful progress target <2s and first text/card feedback <5s when provider permits. Targets are monitored by route, device, locale, and region.

## Rendering strategy

Use latest stable Next.js App Router with Server Components by default. Client Components are limited to interaction islands (composer, comparison controls, realtime state). Static/cached: marketing, FAQ, legal and category shells. Dynamic/no-store: dashboard, chats, quota, notifications, admin, billing. Public builds/topics use tagged revalidation and mutation invalidation.

Cache only data with an explicit freshness/privacy policy. Never cache personalized responses in shared CDN. Immutable build versions and citation snapshots are excellent cache keys; live price labels must show observed time and expiry.

## Frontend budget

Route-specific JS budgets are set in CI after baseline; initial goal ≤170 KB gzip first-party JS for marketing and ≤250 KB for core app shell, excluding lazily loaded editor/visualization code. Optimize fonts with Cyrillic subsets, responsive images, lazy below-fold media, virtualized long chats/comparisons, and incremental Markdown rendering. Avoid animation libraries for trivial effects.

## Database

Cursor pagination, selected columns, batched relation reads, foreign-key/feed/search indexes, and `EXPLAIN ANALYZE` for hot queries. Avoid N+1, unbounded Realtime subscriptions, and synchronous aggregate recomputation. Store counters only when transactional consistency/repair is defined. Add read models/materialized views after measurement.

Connection pooling must match Vercel serverless behavior. Jobs and route handlers have strict timeouts. Partition large append-only tables only when size/query evidence justifies operational cost.

## AI efficiency

Use structured rolling context, candidate pruning, parallel independent research within provider quotas, evidence reuse by freshness/region/condition, and smaller suitable Gemini configurations for extraction/translation if quality evaluation passes. Full compatibility/arithmetic is local deterministic work. Cap tool loops, sources, context, output, and retries. Track cost per completed validated build, not merely per token.

## Scalability path

1. Beta: Vercel + single Supabase project/region, PostgreSQL search, durable outbox.
2. Growth: tuned pooling/indexes, read models, dedicated queue workers, object CDN, region-aware retrieval.
3. Scale: dedicated search service, partitioned evidence/events, asynchronous research fan-out, regional data strategy where compliance requires.

No premature microservices. Extract a service only for independent scaling, security boundary, or runtime constraint.

## Degradation

Gemini down: saved content/community remain available; generation queues/retries safely. Realtime down: poll/refetch. Translation down: source content remains. price retrieval down: show dated snapshot with warning, never “current.” Push/email down: in-app delivery persists. Analytics down: product functions normally.

