# Open questions and launch inputs

All architecture-blocking discovery questions are resolved. The following are intentionally deferred operational inputs; they must be completed before the affected feature or public launch, not guessed by developers.

## Owner-supplied before public beta

1. Legal owner name or public operator identity for Terms/Privacy.
2. Support/privacy/contact email addresses.
3. Final production domain and sender domains.
4. Supabase production region and paid backup/PITR plan.
5. Final Gemini model/config after evaluation against current official capabilities and cost.
6. Email delivery provider and verified sender; web-push VAPID ownership.
7. Analytics/monitoring vendors and consent/legal-basis decision.
8. Ukrainian legal review plus assessment of obligations for global users aged 13+.

## Product configuration before implementation acceptance

- Exact fair-use thresholds for Pro: concurrent runs, burst rate, daily safety ceiling, attachment/context caps, and review/recovery flow. They must allow normal interactive “unlimited” use.
- Default forum categories in Ukrainian and English.
- Moderation policy text, protected-term datasets, context exceptions, appeal response targets, and localized “Deleted account” labels.
- Merchant risk thresholds and trusted evidence hierarchy. There is deliberately no fixed recommended-retailer list.
- Price freshness windows by source/type and availability states.
- Default compatibility headroom policies (PSU, thermals, upgrade horizon) and expert-reviewed rule fixtures.
- Refund operational path (automated self-service or admin-assisted), while the seven-day unconditional policy is fixed.
- Content/file size limits validated against the then-current Gemini/Vercel/Supabase plans.

## Decisions already closed

- PCBuilderAI spelling; global access; USA/Ukraine pricing; USD/UAH
- Gemini only; no provider abstraction beyond internal gateway
- Registered and email-verified AI/community access
- Free five completed generations per rolling 24-hour activation window
- Pro USD 20, one-day one-time card trial, seven-day unconditional refund, no failed-payment grace
- Profiles/builds public by default with privacy controls; chats private with share/publish
- Full bilingual community, translation, reports, strike/appeal system, one super-admin
- Custom desktop/prebuilt/server; new/used/refurbished/discontinued with consent and warnings; no laptops
- Vercel + Supabase; Stripe billing; no direct messages

## Approval record

Documentation status: **Awaiting product-owner review**.  
Approval should record date, approver, accepted exceptions, and links to any superseding decisions. Implementation remains prohibited until explicit approval.
