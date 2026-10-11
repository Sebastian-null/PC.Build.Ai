# Testing strategy

## Pyramid and ownership

- **Static:** strict TypeScript, lint, formatting, dependency/secret checks.
- **Unit:** domain arithmetic, normalization, rule engine, quotas, strikes, locale formatting, reducers.
- **Database:** migrations, constraints, functions, triggers, indexes, and RLS matrix against real PostgreSQL/Supabase local environment.
- **Contract/integration:** Route Handlers, Gemini schema/tool fixtures, Storage policies, Stripe webhook ordering, Realtime authorization.
- **E2E:** Playwright critical journeys in UK/EN, dark/light, desktop/mobile, keyboard.
- **Manual/exploratory:** AI quality, visual polish, screen reader, merchant evidence, moderation nuance.

## Critical test suites

### Compatibility

Golden fixtures cover each socket/chipset/RAM/cooler/GPU/case/PSU/storage/PCIe/BIOS/server topology rule with pass/fail/unknown/boundary cases. Property tests verify unit conversion and power/clearance arithmetic. Any past escaped defect becomes a regression fixture.

### AI evaluation

Bilingual offline dataset includes vague budgets, contradictory constraints, owned parts, NVIDIA/PSU/Wi-Fi/color preferences, silent/compact/server/creator cases, impossible budgets, used/refurbished consent, malicious files/web pages, and ambiguous photos. Score extraction, hard-constraint retention, citation support, budget correctness, compatibility escape, schema validity, calibrated uncertainty, and tone. Model/prompt changes run shadow/canary evaluation.

### Billing/quota

Stripe test clocks/fixtures cover trial once, auto-renew, cancellation, unconditional seven-day refund, failed payment with no grace, duplicate/out-of-order webhook, redirect-before-webhook, and entitlement revocation. Quota tests cover rolling activation, concurrency, failed/cancelled runs, regeneration confirmation, Pro fair use, and timezone irrelevance.

### Moderation

Test UK/EN prohibited terms, obfuscation, personal insults, quoted/educational context, false positives, draft retention, hiding, strike expiry at 182.5 days, 1/3/7-day timeouts, fourth-strike ban, appealable/final decisions, and anonymization.

## E2E release journeys

Sign up each method and verify; create multimodal chat and validated build; over-budget recovery; save/version/privacy/share/revoke; invite collaborator/conflict; compare many builds; publish in both community sections/translate; moderation/report/appeal; trial/cancel/refund; push/email consent; export/delete/anonymize; restore then purge chat; admin audit.

## Accessibility and localization

Automated axe is necessary but insufficient. Keyboard and screen-reader manual tests cover auth, chat stream, build warnings, comparison, editor, dialogs, billing, and moderation. Pseudo-localization catches hardcoded strings/expansion; snapshot tests verify currency/date/plurals without overusing brittle UI snapshots.

## Performance/reliability

Lighthouse CI budgets, Web Vitals RUM, API load for feeds/quota, long-chat virtualization, SSE interruption, Realtime reconnect, job retry/dead-letter, backup restore and deletion drills. Test slow/failed dependencies with fault injection.

## CI gates

Every PR: static, unit, migration/RLS, contract, targeted E2E, build. Main/staging: full E2E, AI eval, accessibility smoke, performance budgets. Production promotion requires no P0/P1, reviewed migration, rollback/forward-fix plan, and observability dashboards ready.

