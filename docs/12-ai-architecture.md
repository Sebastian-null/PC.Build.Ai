# AI architecture

## Scope and model policy

Google Gemini is the sole AI provider. The exact production model is an environment/configuration choice, selected at implementation after quality, grounding, multimodal, structured-output, latency, and cost evaluation. Do not encode a model name throughout domain code. Provider abstraction is not required, but a thin internal Gemini gateway centralizes SDK use, retries, safety, telemetry, and model changes.

## Responsibilities

Gemini may interpret intent; ask questions; analyze files/images/URLs; use Google Search/URL/File tools; extract specs/offers; propose candidates; explain trade-offs; translate; and generate structured recommendations. It may not decide identity, authorization, quota, billing, moderation sanction, merchant approval, arithmetic truth, or final compatibility status.

## Orchestration pipeline

1. **Intake:** deterministic parsing plus Gemini creates `RequirementSpec` with hard/soft constraints and missing consequential fields.
2. **Clarify:** ask the smallest grouped question; non-generative clarification does not consume free quota.
3. **Plan:** choose system class, required roles, search queries, region and condition rules.
4. **Research:** Gemini Google Search/URL Context and permitted file analysis retrieve candidate evidence. Each fact retains source attribution and observation time.
5. **Normalize:** map products to stable type/manufacturer/model/part number; convert units; reject ambiguous bundles/listings.
6. **Validate:** deterministic rule engine evaluates normalized facts. Unknown critical facts remain unknown.
7. **Optimize:** constrained search evaluates compatibility, budget, workloads, preference score, efficiency/noise/upgradeability, evidence quality, and availability.
8. **Price:** server arithmetic calculates subtotal and additions; tax requires jurisdiction input and remains estimated unless authoritative.
9. **Explain:** Gemini receives the verified structured result and produces localized prose; it cannot alter numbers/statuses.
10. **Persist/render:** validate against versioned JSON schema, store run/build version/citations, then render typed UI blocks.

## Structured contracts

Version schemas for `RequirementSpec`, `CandidateOffer`, `NormalizedComponent`, `CompatibilityFinding`, `PerformanceEstimate`, `PriceBreakdown`, `BuildRecommendation`, `ComparisonSummary`, and `ModerationPreflight`. Unknown is a first-class nullable/status value; no guessed required field.

Use structured outputs for final UI data and function calling for application tools. Reject/repair schema-invalid output within bounded attempts; never render unvalidated model JSON. Preserve Gemini-required context/signatures when tool flows require them.

## Compatibility engine

Rules are deterministic code/data with semantic versions and fixtures. Core checks:

- CPU socket, motherboard socket, chipset support, BIOS minimum/version confidence
- RAM generation, supported speed/profile, capacity, DIMM topology/ECC mode
- Cooler socket, thermal class, radiator/height/RAM clearance
- GPU length/height/width/slots, case and radiator interference
- PSU continuous/headroom policy, transient behavior, connector count/type, adapter warning
- Case form factor, drive bays, fan/radiator positions, front headers
- Storage interface/key/form factor, SATA/M.2 ports, lane sharing/disabling
- PCIe mechanical/electrical version/lanes, bifurcation and card requirements
- Server CPU count, registered/unbuffered/ECC compatibility, lane and storage topology
- Upgrade path constraints including socket lifecycle, PSU/case capacity, free slots and BIOS

Rule outcomes: pass, warning, blocker, unknown. A candidate with blocker cannot be the recommended final build. Unknown critical fit prevents “validated” status.

## Market evidence and store safety

PCBuilderAI has no manually complete catalog and searches current markets. Discovery results become immutable evidence snapshots plus a reusable normalized cache. Store verification is risk-based: domain age/reputation signals where legally/technically available, HTTPS, contact/returns transparency, listing consistency, seller identity for marketplaces, suspicious price deviation, redirect/affiliate behavior, and prior admin decisions. Failing or unresolved high-risk merchants are excluded; the UI does not call inclusion an endorsement.

Do not scrape where terms/robots/law prohibit it. Prefer official product pages, retailer feeds/APIs if later obtained, Google-grounded results, and user-provided URLs. Provider adapters isolate search/retrieval mechanisms despite Gemini being the only reasoning provider.

## Budget optimizer

Model preferences as hard constraints, weighted soft preferences, workload utility, and total hardware cost. Search candidates with pruning; run deterministic validation at every substitution. Owned parts cost zero. When no feasible solution exists, compute a Pareto-near option and minimum observed excess, explain relaxed soft preferences, and request approval. Never autonomously treat an increased budget as accepted.

## Performance estimates

Store workload/game, version, resolution, settings, upscaling/frame-generation state, benchmark source/date, sample context, and confidence/range. Prefer multiple reputable sources and comparable test conditions. AI may synthesize ranges but must label inference. Productivity scores state benchmark version. No single opaque “future-proof” number: show explained dimensions.

## Context and memory

Canonical session state is a structured rolling summary plus recent turns and referenced build versions. Full history remains available but is not resent blindly. Users can inspect/edit extracted requirements. Cross-chat memory is off unless explicitly designed/consented later; profile preferences are user-managed settings, not hidden inferred memory.

## Streaming and failure

Stream status events, safe text deltas, citations, then finalized cards. Persist run state and idempotency key before calling Gemini. Cancellation stops downstream work when possible. Retry transient 429/5xx with jitter and `Retry-After`, bounded by request budget. Grounding/schema/safety failures preserve draft, consume no quota, and offer retry.

## Safety, privacy, and evaluation

Prompt injection in web pages/files is untrusted content; tools cannot authorize actions or reveal secrets. Strip active content and delimit evidence. Send only required user data. Product-improvement datasets require opt-in and de-identification; never store chain-of-thought.

Maintain bilingual evaluation sets for requirement extraction, compatible/incompatible builds, used/discontinued warnings, budget impossibility, citations, price arithmetic, image ambiguity, prompt injection, and moderation false positives. Gate model/prompt/rule changes on blocker escape rate, citation correctness, budget correctness, schema success, helpfulness, latency, and cost.

## Official references

- [Gemini tools and function calling](https://ai.google.dev/gemini-api/docs/tools)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search)

