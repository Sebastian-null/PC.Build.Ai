# Database design

## Conventions

PostgreSQL is authoritative. Tables use `uuid` primary keys (prefer UUIDv7 when supported), `timestamptz` UTC, `created_at`, and where mutable `updated_at`. Money is integer minor units plus ISO-4217 currency; never float. Measurements use normalized numeric value and unit. User text preserves source language. Soft deletion is used only where recovery/moderation requires it; purge jobs enforce retention.

Schemas: `public` for RLS-exposed domain data, `private` for server-only billing/AI/security internals, and Supabase-managed `auth`, `storage`, `realtime`. Every public table has RLS. Service-role access is server-only.

The requested logical `users` entity is Supabase's managed `auth.users`; application code never creates a duplicate password/identity table. `profiles` references its primary key. The requested logical `settings` entity is implemented as typed `user_settings` plus `notification_preferences` and `consents` so unrelated privacy and delivery concerns do not collapse into one JSON record.

## Identity, preferences, and consent

| Table | Essential columns and relationships |
|---|---|
| `profiles` | `id PK/FK auth.users`, unique case-insensitive `username`, `display_name`, `bio`, `avatar_path`, `locale`, `country_code`, `is_public`, `deleted_at` |
| `user_roles` | `user_id`, `role` (`user|super_admin`), unique pair; role mutation audited |
| `user_settings` | `user_id PK`, theme, comparison AI default, timezone, accessibility/preferences JSON with schema version |
| `notification_preferences` | `user_id`, `event_type`, in-app/push/email booleans; email false until consent |
| `consents` | user, purpose, policy version, granted/revoked timestamps, evidence metadata; append-only |
| `push_subscriptions` | user, endpoint hash/encrypted subscription payload, device label, last_used, revoked_at |
| `user_blocks` | reserved for safety/admin blocking; no DM semantics |
| `account_deletion_requests` | user, requested/execution timestamps, status, export reference |
| `data_exports` | user, status, private storage path, expires_at |

## AI chats and quota

| Table | Essential columns |
|---|---|
| `chat_sessions` | owner, title, locale, country, currency, favorite/archive flags, visibility (`private|unlisted|public`), deleted_at, purge_after |
| `chat_messages` | session, author type/user, role, source text, language, status, sequence, model metadata, parent/regeneration relation, created_at; content encrypted at application layer where adopted |
| `chat_message_parts` | message, ordered type (`text|file|image|citation|tool|card`), content JSON validated by type, storage asset FK |
| `chat_shares` | session, token hash, public/published mode, created_by, expires/revoked timestamps |
| `ai_runs` (private) | session/message, user, model, prompt/schema versions, status, idempotency key, token/cost metrics, started/completed, error class; no chain-of-thought |
| `ai_citations` | run, claim/path, URL, title/domain, observed_at, retrieved excerpt hash, source type |
| `generation_usage` (private) | user, run, window_id, consumed_at, entitlement; unique run |
| `usage_windows` (private) | user, starts_at, ends_at (= start + 24h), allowed, consumed; transactional counters |
| `assets` | owner, bucket/path, MIME, size, checksum, scan status, extraction status, deleted/purge time |

Clarification messages do not create `generation_usage`; only schema-valid completed full runs do. A database transaction locks the active window, checks entitlement, and records usage exactly once.

## Builds, evidence, and compatibility

| Table | Essential columns |
|---|---|
| `builds` | owner, type (`custom|prebuilt|server`), slug, title, source chat, visibility, current_version_id, language, status, published_at |
| `build_versions` | build, monotonically increasing version, based_on_version, creator, immutable requirements JSON, budget minor/currency, country, subtotal/final estimate, validation status, schema/rule versions, created_at |
| `build_collaborators` | build, user, permission (`viewer|editor`), invited_by, accepted_at; unique build/user |
| `build_components` | version, component snapshot, role, quantity, unit price, selected offer, owned flag, rationale, sort order |
| `component_types` | stable key (`cpu`, `motherboard`, etc.), localized display metadata, specification schema version |
| `manufacturers` | normalized name, aliases, official URL, verification state |
| `components` | normalized discovered identity: type, manufacturer, model, part number, lifecycle, canonical specs JSON, first/last seen, confidence; this is a discovery cache, not a curated complete catalog |
| `component_snapshots` | component nullable, source, observed_at, title, part number, raw/normalized specs, extraction confidence, content hash; immutable evidence |
| `compatibility_rules` | stable key, version, applies-to types, severity default, rule definition/check handler key, active dates |
| `compatibility_checks` | version, rule, involved build-component IDs, result (`pass|fail|warning|unknown`), facts/evidence, explanation keys, remediation; immutable per validation run |
| `build_metrics` | version, metric key, workload/game/settings/resolution, numeric/range/unit, estimate flag, source/date/confidence |
| `build_upgrade_paths` | version, horizon, target, prerequisites, suggested changes, rationale |
| `build_shares` | build/version, token hash, mode, revocation/expiry |
| `comparisons` | owner, title, visibility, AI-enabled, normalized context, snapshot time |
| `comparison_items` | comparison, build_version, position; unique pair |
| `comparison_summaries` | comparison, run, schema version, summary JSON, created_at |

`components` satisfies normalized reuse but never implies an authoritative complete catalog. A generated build references immutable snapshots so future discovery changes cannot rewrite history.

## Pricing and merchants

| Table | Essential columns |
|---|---|
| `stores` | normalized domain/name, country coverage, verification/risk status, reasons, first/last checked |
| `prices` | component snapshot, store, listing URL/canonical hash, condition, price minor/currency, availability, observed_at, expires_at, seller identity |
| `discounts` | price/listing, original/current minor, label, starts/ends, observed_at, verification confidence |
| `price_additions` | build version, type (`sales_tax|vat|shipping|assembly|other`), amount/currency, jurisdiction/store, source, estimated flag |
| `merchant_assessments` | store/domain/listing, check type, result, evidence, checked_at, rule version |
| `exchange_rate_snapshots` | base/quote, rate decimal, provider, observed_at; only for explicitly displayed conversions |

Index price lookup by `(component_snapshot_id, country, currency, condition, observed_at desc)` through store country join/materialized read model as needed. URLs are normalized and hashed to deduplicate tracking variants.

## Community and social

| Table | Essential columns |
|---|---|
| `forum_categories` | language, parent nullable, slug, localized title/description, order, locked, created_by |
| `forum_topics` | category, author nullable, slug, title, language, status, pinned/locked, last_activity, deleted/anonymized flags |
| `forum_posts` | topic, author nullable, parent_post nullable, body/source language, revision, moderation state, published/edited/deleted timestamps |
| `post_revisions` | post, editor, body, edit reason, created_at; admin-readable audit |
| `comments` | polymorphism is avoided: separate target type + constrained target ID or dedicated build comments; author, body, language, moderation state |
| `build_comments` | build/version nullable, author nullable, parent nullable, body, moderation state, timestamps |
| `likes` | user, target_type constrained, target_id, created_at; unique user/target |
| `bookmarks` | user, target_type, target_id, collection nullable, created_at; unique user/target |
| `favorites` | user, build, created_at; unique user/build |
| `content_translations` | target type/id/revision, source/target locale, translated text, model/version, created_at; labeled cache |
| `topic_subscriptions` | user/topic and notification level |
| `mentions` | source entity, mentioned user, created_at |

For referential integrity, implement typed association tables when a target becomes high-volume rather than unconstrained generic IDs. Search uses generated `tsvector` per language plus trigram indexes for titles/usernames/models.

## Moderation

| Table | Essential columns |
|---|---|
| `moderation_rules` | language, category, match strategy/hashed protected terms, version, active, severity; access admin-only |
| `moderation_scans` | content/draft reference, rule version, result, safe structured findings, created_at; avoid exposing banned-term catalog |
| `reports` | reporter, target, reason, details, status, priority, assigned admin, timestamps |
| `moderation_cases` | target, source (`report|automated|admin`), state, hidden_at, resolution, admin |
| `strikes` | user, case, ordinal-at-issue, reason, issued/expires (`+182.5 days`), timeout_until, revoked_at |
| `user_sanctions` | user, type (`posting_timeout|ban`), reason, starts/ends, appeal_allowed, admin_comment, active |
| `appeals` | sanction, user, statement, status, decision/admin note, timestamps |
| `audit_logs` (private) | actor, action, target, before/after redacted JSON, request/correlation ID, IP hash, created_at; append-only |

Strike count considers unexpired, non-revoked strikes transactionally. Content hidden for review is excluded from public queries but visible to author with state and admin.

## Notifications, subscriptions, and system

| Table | Essential columns |
|---|---|
| `notifications` | recipient, type, actor nullable, target, localized data (not rendered string), read_at, created_at, dedupe key |
| `notification_deliveries` | notification, channel, status, attempts, provider ID, last error, sent_at |
| `subscriptions` (private) | user, Stripe customer/subscription IDs unique, status, trial/period dates, cancel state, entitlement |
| `billing_events` (private) | Stripe event ID unique, type, payload reference/redacted data, processing status/time |
| `refunds` (private) | user/subscription/charge, Stripe refund ID, status, requested/completed timestamps |
| `feature_flags` (private) | key, value/rules, updated_by/time |
| `outbox_events` (private) | aggregate/type/payload, dedupe key, available/processed time, attempts |

## Index plan

- All foreign keys indexed; partial indexes for `deleted_at is null`, unread notifications, active sanctions, unresolved reports, active shares, and available outbox events.
- Unique: lower username, build owner+slug, category language+slug, topic category+slug, version build+number, collaborator build+user, likes/bookmarks/favorites keys, Stripe IDs, idempotency keys.
- Feed: topics `(category_id, pinned desc, last_activity_at desc)`; posts `(topic_id, created_at, id)`; public builds `(published_at desc, id)` using cursor pagination.
- Search: language-specific `GIN(tsvector)` and `gin_trgm_ops` where fuzzy lookup is required.
- BRIN may serve append-only audit/AI event timestamps at scale; partition `audit_logs`, `ai_runs`, price snapshots, and notifications only after measured thresholds.

## Integrity and deletion

Use check constraints for enums/ranges, database functions for quota/strike transitions, deferred constraints for `current_version_id`, and triggers only for essential invariants/timestamps/outbox. Public posts use nullable author plus immutable anonymized author label. Deletion worker revokes shares, removes Storage objects, purges private content, and retains minimum pseudonymous billing/security records according to Ukrainian law and processor obligations.
