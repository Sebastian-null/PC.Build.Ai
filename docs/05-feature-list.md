# Feature list and release scope

Legend: **P0** beta launch blocker; **P1** beta quality; **Later** intentionally deferred.

| Module | P0 | P1 / Later |
|---|---|---|
| Landing | Premium bilingual landing, features, FAQ, CTA, beta/pet-project label, auth | Pricing expansion and experiments |
| Auth | Password, magic link, Google, verification, reset, session handling | Passkeys Later |
| Profile | Public profile, privacy toggle, avatar, bio, stats, builds/posts/activity | Reputation, badges, achievements Later |
| Dashboard | Quota, recent chats/builds, notifications, recommendations | Personalized feed P1 |
| AI chat | Streaming, multimodal input, Markdown/cards, history, search, favorites, stop/continue/regenerate/share/publish | Voice Later |
| Builds | Save, versions, validation, sources, totals, privacy, sharing, collaboration | Auto price-refresh schedules P1 |
| Comparison | Unlimited columns, differences, metrics, optional AI summary, share snapshot | Scenario simulations P1 |
| Pricing | USA/UA search, merchant safety, citations, condition, tax/VAT/assembly breakdown | Historical charts Later |
| Community | Language sections, forum, showcases, likes, comments, bookmarks, search/filter, translation | Reputation/badges/moderator roles Later |
| Moderation | Preflight filter, reports, hidden review, strikes, timeouts, ban, appeal, admin audit | Community moderators Later |
| Notifications | In-app, web push, opt-in email preferences | Mobile native push Later |
| Billing | Free quota, Pro, trial, checkout, portal, cancellation, refund state | Annual/team plans Later |
| Admin | Single super-admin queues and controls | Delegated RBAC Later |
| Legal/support | Privacy, Terms, contact, consent, deletion/export | SLA/support desk Later |

## Required pages

All requested pages are P0: Landing, authentication, profile, dashboard, AI chat, generated builds, build details, build comparison, saved builds, community, forum, categories, topics, comments, user profiles, settings, notifications, admin, 404, legal hub, Privacy, Terms, and Contact.

## Feature flags

High-cost or high-risk features are remotely controllable without redeploy: new registrations, AI generation, uploads by type, web grounding, used/refurbished search, chat publication, automatic translation, collaboration, community posting, push/email delivery, trial, and maintenance mode. Flags do not replace authorization.

## Definition of “future-ready”

Future-ready means stable identifiers, extensible schemas, versioned interfaces, and no UX promise of unfinished functionality. Empty buttons or fake pricing are prohibited. Admin is not merely future-ready: the moderation subset is required at beta launch.
