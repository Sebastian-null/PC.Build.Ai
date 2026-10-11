# UI and UX principles

## The three questions

Every screen must make clear: what am I doing, why does it matter, and what should I do next? The dominant next action is singular; secondary actions remain discoverable.

## Conversation UX

- Start with a useful prompt, not a long form. Ask one grouped question only when the answer changes recommendations.
- Distinguish hard constraints (“must”) from preferences (“prefer”) and allow users to correct extracted requirements.
- Show concise progress labels such as “checking prices” and “validating fit”; never reveal or claim private chain-of-thought.
- Streaming text must remain readable and cancellable. Structured cards render only from validated data.
- A quota unit is explained before regeneration or another full generation.

## Trust UX

- Source, observed time, condition, currency basis, and confidence stay close to the claim.
- “Compatible” means all required facts passed current rules; “likely” or “unknown” is never styled as compatible.
- Separate hardware subtotal from estimated checkout total. Explain tax/assembly additions line by line.
- AI opinions, deterministic checks, merchant data, and community content have distinct labels.
- Discontinued/refurbished/used warnings survive sharing and screenshots.

## Empty, error, and degraded states

Empty states explain benefit and one action. Errors state what failed, whether data was saved/quota charged, and how to recover. Dependency failures do not blame the user. Offline mode permits reading cached non-sensitive content and drafts but blocks misleading actions.

## Accessibility

Meet WCAG 2.2 AA. Navigation and composite widgets follow WAI-ARIA patterns. Logical focus follows streaming inserts without stealing focus. Live regions announce completion/errors sparingly. Charts have tables/text equivalents. Markdown headings preserve hierarchy. User content cannot inject unsafe HTML.

## Keyboard model

Global shortcuts open search and new chat without conflicting with browser/assistive technology. Composer supports Enter-to-send only when configured; Shift+Enter always inserts newline. Escape stops generation when focus is in chat and closes the top modal. Shortcuts are discoverable and remappable/disableable.

## Localization UX

Layouts tolerate 30–40% text expansion. Never concatenate translated fragments. Dates, currency, plurals, tax terminology, moderation language, and legal copy use locale-aware formatting. Automatic community translation is clearly labeled and source text is one action away.

## Privacy UX

Public defaults are disclosed at creation/save, not hidden in settings. Chat sharing requires explicit action and shows what recipients can see; revocation is immediate. Consent controls are granular and rejecting optional processing has no dark pattern.

## Performance perception

Prioritize useful shell/content over spinners. Optimistic updates are allowed for reversible low-risk actions such as likes, with rollback. Billing, moderation, quota, privacy, and build-version writes wait for authoritative confirmation.

