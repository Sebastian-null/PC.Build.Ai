# Project vision

## Vision

PCBuilderAI is a global, bilingual hardware consultant that turns natural-language intent into a purchasable, compatible, explainable desktop system. It combines an expert AI conversation, deterministic safety checks, live market evidence, and a hardware community.

The product is not a parts-list generator. It guides trade-offs, asks only consequential questions, stays within the component budget, explains evidence and uncertainty, and continues searching for a viable solution before suggesting the smallest justified budget increase.

## Problem

PC buying is fragmented across benchmarks, retailer listings, compatibility tables, tax rules, stale advice, and communities. Novices cannot reliably join these sources; experts repeatedly perform the same research. Store configurators are inventory-biased, while general chatbots can invent prices or compatibility.

## Promise

Given a country, budget, workload, preferences, and owned parts, PCBuilderAI produces a sourced recommendation that:

- satisfies hard constraints or explicitly reports why it cannot;
- never silently presents a known incompatibility;
- separates component subtotal from tax, delivery, and assembly services;
- provides cheaper and premium alternatives plus upgrade paths;
- labels estimates, used/refurbished/discontinued parts, and evidence freshness;
- can be saved, versioned, compared, shared, collaboratively edited, and discussed.

## Audience and market

The beta is global in access but commercially optimized for the USA and Ukraine. The interface is fully authored in Ukrainian and English. Browser locale `uk` selects Ukrainian, `en` selects English, and all other locales fall back to English. Users may switch manually.

Supported system classes are custom desktops, prebuilt desktops, and servers. Laptops are explicitly out of scope. Condition modes are new or used; refurbished, open-box, and discontinued products are separately labeled and require user acceptance.

## Principles

1. **Compatibility before persuasion.** A lower price cannot override a safety rule.
2. **Evidence before confidence.** Prices, specifications, tax inputs, and performance estimates show source and observed date.
3. **Budget truth.** Component subtotal targets the user's budget. Taxes, delivery, and optional assembly are itemized below it.
4. **AI proposes; software verifies.** Gemini interprets and researches; deterministic policies validate normalized facts.
5. **Privacy by default for conversation.** Chats are private until explicitly shared or published.
6. **Public contribution with control.** Profiles/builds default public, with profile and per-build privacy controls.
7. **Localization is product design.** English is independently authored, not treated as machine-translated Ukrainian.
8. **Accessible premium simplicity.** Every view explains task, reason, and next action.

## Success outcomes

Beta success means users reach a validated build without leaving to reconstruct research, understand why it fits, and trust the final total. Primary metric: validated builds saved per activated user. Guardrails: critical incompatibility escape rate, unsupported-claim rate, stale-price rate, refund rate, moderation response time, accessibility regressions, and AI cost per successful build.

## Non-goals for beta

- Laptop selection or repair diagnosis
- Direct retail checkout, inventory ownership, or retailer endorsement
- A canonical in-house catalog continuously curated by staff
- Guaranteed benchmark outcomes or financial guarantees on prices
- Private direct messaging
- Multiple AI providers
- Multiple administrative roles (one super-admin only)

