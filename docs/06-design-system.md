# Design system

## Direction

PCBuilderAI uses a dark-first, content-led visual system: quiet surfaces, strong typography, precise spacing, restrained color, and motion that communicates state. Inspiration from Linear, Vercel, Stripe, Notion, Cursor, and Apple means disciplined hierarchy—not imitation.

## Foundations

- **Grid:** 4px base; common spacing 4/8/12/16/24/32/48/64/96.
- **Content widths:** reading 720px; app content 1280px; comparison may exceed viewport inside its own scrolling region.
- **Radii:** 8px controls, 12px cards, 16px feature surfaces, pill only for tags/status.
- **Typography:** variable sans with Cyrillic coverage; mono for prices/specs/IDs. Minimum body 16px, line-height ≥1.5. Use tabular numerals in price tables.
- **Elevation:** borders and tonal layers before shadows. Avoid glassmorphism that reduces contrast.
- **Icons:** one consistent outlined family; every icon-only action has accessible name and tooltip.

## Semantic tokens

Tokens are role-based and have dark/light values: `background`, `surface-1..3`, `text-primary/secondary/muted`, `border-default/strong`, `accent`, `focus`, `success`, `warning`, `danger`, `info`, and `compatibility-unknown`. Never encode validation only by color.

Minimum contrast follows WCAG 2.2 AA: 4.5:1 normal text, 3:1 large text and meaningful UI graphics. Focus ring is always visible and not clipped.

## Core components

- Buttons: primary, secondary, quiet, destructive; loading does not alter width.
- Inputs: persistent label, optional hint, inline error, character/size counter where relevant.
- Dialog/drawer: focus trap, Escape behavior, return focus; destructive confirmation states consequences.
- Toast: supplementary only; durable results also appear inline/in notification center.
- Data table: semantic headers, keyboard reachable controls, responsive card fallback where comparison is unnecessary.
- Component card: role, product, condition, price, merchant, source age, confidence, compatibility status, alternatives.
- Price card: hardware subtotal visually separate from additions and estimated final total.
- Compatibility banner: blocker/warning/unknown/info counts with links to findings.
- Citation: numbered link with source title, domain, observed time, and external-link warning.
- AI message: prose and structured blocks; source and action region; clear distinction from user message.
- Skeleton/progress: reflects actual layout and named research stages, never fake percentages.

## Responsive behavior

Design from 320px upward. Navigation collapses to a bottom/compact pattern for primary tasks; sidebars become drawers. Tables transform only when semantic comparison remains clear. Comparison retains horizontal scroll with sticky first column. Composer respects safe areas and virtual keyboard. Touch target minimum 44×44 CSS px.

## Motion

Use 120–240ms transitions for feedback and 300–500ms only for spatial navigation. Animate opacity/transform, not layout-heavy properties. Respect `prefers-reduced-motion`; decorative landing motion is removable and never blocks content.

## Content density modes

Default is comfortable. Comparison/specification views use compact density with user-controllable expansion. Never hide warnings to reduce density.

## Design QA checklist

Every component documents states: default, hover, focus, active, disabled, loading, empty, error, offline, permission-denied, long translated text, and reduced motion. Test at 200% zoom, keyboard-only, screen reader, dark/light, UK/EN, mobile, and slow network.

