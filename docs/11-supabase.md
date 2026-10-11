# Supabase architecture

## Services

- **Auth:** password, magic link, Google OAuth, email verification, JWT sessions.
- **PostgreSQL:** domain truth, RLS, full-text search, transactional quota/moderation logic.
- **Storage:** avatars, private chat uploads, public build/community media, temporary exports.
- **Realtime:** private channels for AI run state, notifications, collaboration presence/events, and admin queues where useful.
- **Scheduled/server work:** retention, strike expiry effects, notification dispatch, stale asset cleanup, outbox processing. Prefer Vercel functions/cron or Supabase-supported scheduled facilities based on duration and network needs.

## Authentication flow

Use Supabase SSR-compatible clients and secure cookie sessions. Browser initiates auth; callback exchanges code server-side, validates redirect allowlist, and routes to verification/onboarding. A profile provisioning transaction creates defaults after `auth.users` creation. Email verification gate is checked server-side for AI/community writes, not merely disabled in UI.

Never trust OAuth metadata for authorization. Super-admin role resides in protected `user_roles`; JWT claims may cache role for performance but sensitive actions recheck authoritative data. Require recent authentication for account deletion and sensitive security changes.

## RLS policy matrix

| Resource | Anonymous | Authenticated user | Owner/collaborator | Super-admin |
|---|---|---|---|---|
| Public profiles/builds/posts | Select non-hidden | Select | Owner update own permitted fields | Moderation access |
| Private chats/messages/assets | None | None | Owner only; share via server capability | Break-glass audited only |
| Private builds | None | None | Owner + accepted collaborator by permission | Audited admin only if required |
| Notifications/settings | None | Own only | Own only | No routine access |
| Reports/appeals | None | Insert own, select own state | Same | Full queue/action |
| Billing/AI internals/audit | None | No direct API access | No direct API access | Server/admin endpoints only |

Policies use `(select auth.uid())`, indexed ownership columns, and security-definer helpers only when narrowly scoped with fixed `search_path`. Views exposed through API use `security_invoker`. RLS is defense in depth; route handlers perform matching authorization.

## Storage buckets

- `avatars-public`: public reads, owner write, strict image transformations and size.
- `community-public`: published media only; draft staging remains private.
- `chat-private`: `{user_id}/{session_id}/{asset_id}`; owner/server access, signed short-lived URLs.
- `build-private`: private evidence/media; public copies or controlled delivery after publish.
- `exports-private`: owner signed download, short expiry and purge.

Upload lifecycle: create pending DB asset → signed upload → checksum/MIME validation and malware scan → mark ready → extract. Reject executable/polyglot/oversized content. Storage RLS must include required select policy for upload result while preventing bucket listing leakage.

## Realtime

Use private channels named `user:{id}:notifications`, `build:{id}:collaboration`, `chat:{id}:run`. Authorization is RLS-backed. Realtime transports ephemeral events; durable state is committed first to PostgreSQL/outbox. Clients unsubscribe on teardown, reconnect with backoff, and refetch authoritative state after gaps.

Do not stream raw Gemini tokens through public database change feeds. Use the Next.js response stream for the active request and persist completed/periodic safe checkpoints; Realtime supports cross-tab status/reconnect.

## Environments and migrations

Separate local, preview/staging, and production Supabase projects. Schema changes are migration-only, reviewed, reversible by forward fix, and tested from empty plus previous production snapshot. Generated TypeScript database types are updated in the same change. Seed data contains only synthetic users/content and versioned component/rule fixtures.

## Backups and recovery

Choose a Supabase plan providing required PITR/backups before public beta. Document RPO/RTO after plan selection; target RPO ≤24h initially and RTO ≤4h. Quarterly restore drills verify database plus Storage metadata/object recovery and record outcomes.

## Official references

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [User data and RLS](https://supabase.com/docs/guides/auth/managing-user-data)
- [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Realtime getting started](https://supabase.com/docs/guides/realtime/getting_started)

