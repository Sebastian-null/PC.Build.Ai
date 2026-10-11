# Coding standards

These standards govern the later implementation; this documentation phase contains no application code.

## TypeScript and boundaries

Strict TypeScript with no unreviewed `any`; use `unknown` plus validation at every external boundary. Domain types are explicit and discriminated. Money, currency, locale, country, measurements, IDs, compatibility status, and visibility must not be loose strings/numbers. Never use floating-point money.

Server Components by default; add `use client` at the smallest interactive boundary. Business rules do not live in React components, route handlers, prompts, or RLS alone. Separate domain, application orchestration, infrastructure adapters, and presentation.

## Naming and files

- Components/types: PascalCase; functions/variables: camelCase; constants only SCREAMING_SNAKE where truly constant.
- Files use kebab-case except framework-required names; tests colocate or mirror consistently.
- Database snake_case; API camelCase through mapping.
- Boolean names start `is/has/can/should`; timestamps end `At`; money fields end `Minor` and pair with currency.

## Functions and errors

Prefer small pure domain functions. Validate inputs once at boundary, preserve causal errors internally, and map to stable public error codes. Never catch-and-ignore. Expected domain outcomes use typed results; unexpected errors reach monitoring with correlation ID and redaction.

## Localization and accessibility

No user-facing hardcoded strings, including aria labels, errors, emails, metadata, empty states, or admin copy. Translation keys are semantic. Components use native elements first, maintain focus, and include automated/manual accessibility tests.

## Data and security

Select explicit columns; paginate lists; transactions protect invariants; migrations are reviewed. No secrets/client service role, dangerous HTML, raw user URL fetches, unsanitized Markdown, or logs containing chat/file/payment/private content. Every authorization-sensitive query has RLS and application checks/tests.

## Quality tooling

Use the latest stable mutually compatible Next.js/TypeScript toolchain at implementation approval. Formatting/lint/typecheck/tests run in CI and pre-commit where fast. Dependency additions require justification, maintenance/license/security review, and bundle impact.

## Git workflow

Trunk-based development with short-lived branches and protected `main`. Conventional commits are recommended (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`). PRs are small, linked to requirement/issue, include tests, screenshots for UI, migration/RLS notes, localization and accessibility impact. At least one review; sensitive auth/billing/RLS/admin changes require security-minded review.

## Versioning and ADRs

Application releases use SemVer once public contract matters; beta may begin `0.x`. Database migrations are immutable. API, AI schemas, compatibility rules, moderation rules, prompts, and legal policies each carry independent versions. ADRs record consequential decisions and supersession.

## Definition of done

Acceptance criteria met; UK/EN copy included/reviewed; responsive/accessibility states; tests at appropriate levels; RLS/security and observability; docs/ADR/migration updated; no new unexplained warnings; staged verification and rollback/forward-fix plan.
