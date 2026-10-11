# PCBuilderAI documentation

Status: **Architecture baseline for public beta**  
Last revised: 2026-07-11  
Implementation status: **Not started — approval required**

This directory is the authoritative product and engineering specification for PCBuilderAI. Product behavior belongs in the product documents; implementation choices belong in architecture documents; unresolved launch data belongs in [22-open-questions.md](./22-open-questions.md).

## Reading order

1. [Vision](./00-project-vision.md) and [Project Bible](./01-project-bible.md)
2. [Product requirements](./02-product-requirements.md), [personas](./03-user-personas.md), and [flows](./04-user-flows.md)
3. [Features](./05-feature-list.md), [design system](./06-design-system.md), and [information architecture](./09-information-architecture.md)
4. [Database](./10-database-design.md), [Supabase](./11-supabase.md), [AI](./12-ai-architecture.md), and [API](./13-api.md)
5. Engineering standards, deployment, testing, security, performance, and roadmap

## Decision authority

- These documents supersede informal assumptions but not later written product-owner decisions.
- A change affecting scope, privacy, billing, moderation, AI safety, data ownership, or public URLs requires an Architecture Decision Record (ADR).
- Product copy is localized in Ukrainian and English; no user-facing string may be hardcoded.
- No implementation begins until the owner approves this documentation set.

## Document map

| File | Purpose |
|---|---|
| 00–05 | Vision, requirements, users, flows, feature scope |
| 06–09 | Visual language, UX, brand, navigation |
| 10–13 | Data, Supabase, Gemini, application API |
| 14–16 | Security, performance, test strategy |
| 17–21 | Delivery, standards, structure, deployment, future |
| 22 | Remaining non-blocking launch inputs |

## Product constants

- Brand: **PCBuilderAI**
- Markets: United States and Ukraine; currencies USD and UAH
- Languages: Ukrainian and English
- Platform: desktop PCs, prebuilt desktops, and servers; no laptops
- Runtime: latest stable Next.js + TypeScript + App Router on Vercel; Supabase backend
- AI: Google Gemini only
- Access: verified accounts only; Free = 5 full AI generations per rolling 24 hours; Pro = USD 20/month
- Release: public beta and clearly identified author-owned pet project

