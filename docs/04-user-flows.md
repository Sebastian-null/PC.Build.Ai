# User flows

## Onboarding and first generation

1. Visitor lands in detected locale and can browse public content.
2. CTA opens sign-up; user chooses password, magic link, or Google.
3. Until email verification, AI composer and publishing explain the verification requirement and offer resend.
4. User accepts Terms/Privacy, age 13+ declaration, and separately chooses optional analytics, improvement, and email notification consents.
5. First consultation asks country, budget/currency, system type, use, existing parts, and new/used preference. Additional questions appear only when consequential.
6. First full generation activates a rolling 24-hour free window and uses one quota unit after successful completion.
7. Streaming response shows research progress without invented chain-of-thought, followed by sourced cards and validation state.
8. User saves, revises, compares, shares, publishes, or starts another variant.

## Build generation decision flow

`Intent extraction → hard/soft constraint confirmation → evidence search → candidate normalization → compatibility validation → budget optimization → performance estimation → final arithmetic → explanation`.

If a spec is unknown, the system searches alternate sources; if still unknown and safety-critical, it asks the user or marks the build unresolved. If over budget, it substitutes lowest-priority constraints first without violating hard constraints. If no valid candidate fits, it displays the minimum excess and requests approval; no implicit budget change occurs.

For USA final totals, request state/ZIP at the moment an accurate checkout estimate becomes useful, not at account creation. For a requested store assembly, retrieve and cite its service price. OS/peripherals appear only when requested; AI asks whether they share the hardware budget.

## Upload/import

User attaches files or URLs → client validates basic type/size → private Storage upload → server malware/content checks → Gemini extraction → preview of detected items/uncertainties → user corrects → validation/generation. Images never silently become authoritative model numbers when confidence is inadequate.

## Save, edit, collaborate

Saving creates build and version 1. Editing forks a draft from a specific version. Owner invites a verified account as viewer/editor. Collaborators receive notifications and operate through private Realtime channels. Save uses optimistic concurrency; a stale editor must merge or fork. Publishing pins a version; later edits do not change an already shared comparison without explicit republish.

## Compare

User selects any number of owned/saved/public builds → comparison normalizes currency/region context and warns when bases differ → sticky criteria and horizontal build columns show differences → filters hide equal rows → optional AI analysis produces winner-by-priority, not a universal winner → user can save/share a comparison snapshot.

## Community publishing and moderation

Author selects UK/EN section, writes, previews, and submits. Preflight moderation either publishes or returns localized highlighted issues while retaining the complete draft. Reports immediately create a case; policy-triggered struck content is hidden pending review. Admin dismisses, warns, removes, times out, or bans with reason and optional note. User sees status and may appeal when allowed.

## Billing

User chooses Pro → hosted Stripe Checkout captures card and starts one-day trial if eligible → signed webhook grants entitlement → UI reflects server-side subscription state. Cancellation uses billing portal and preserves access through period end. Refund request within seven days routes to supported self-service/admin flow and revokes/refines entitlement based on Stripe result. Webhook ordering never relies on browser redirect.

## Account deletion

User authenticates recently → reviews effects → exports optionally → confirms deletion → sessions revoked; private data scheduled for deletion; public retained contributions anonymized; shared chat links revoked; chats follow 24-hour recovery/purge rule where applicable; immutable security/billing audit records retain only legally necessary pseudonymous fields.

## Failure recovery

- Lost stream: reconnect/resume from persisted event cursor or show safe retry.
- Gemini unavailable: preserve prompt/draft; do not charge quota.
- Price source stale: display timestamp and refresh action.
- Stripe redirect without webhook: show “processing,” poll authoritative entitlement.
- Realtime unavailable: fall back to refresh/polling; never lose saved edits.

