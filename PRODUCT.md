# Product

## Register

product

## Users

A single user (the developer himself) tracking his own personal finances. Context: quick desktop check-ins to log transactions, reconcile the real bank balance against the expected one, and keep an eye on subscriptions. French-language UI (the user's native language). No multi-user, no collaboration, no public audience.

## Product Purpose

A private financial journal ("Journal financier privé"): record income and expenses, track recurring subscriptions, compare the manually-entered bank balance with the computed expected balance, and visualize spending by category and net cash flow per month. Success = the user trusts the numbers at a glance and logging a transaction takes seconds. Data is local (browser storage), privacy by design.

## Brand Personality

Précis et pro. Sharp, confident, banking-grade legibility — numbers are the heroes, chrome stays out of the way. Tone: factual and calm, never cheerleading. Three words: **précis, sobre, fiable**.

## Anti-references

- **Soft glassmorphism** — the current blurred glass cards / pastel radial-gradient look is explicitly what this should move away from; too decorative for a precision tool.
- **Neobank marketing aesthetics** — Revolut/N26-style purple gradients, blobby shapes, playful illustrations.
- No confetti, badges, or gamified encouragement; no marketing-page theatrics inside the app.

## Design Principles

1. **Numbers first** — tabular figures, strong numeric hierarchy; the balance and deltas are the most legible things on any screen.
2. **Density over decoration** — every pixel of chrome must earn its place; prefer rules, alignment, and whitespace over cards and blur.
3. **Fast capture** — adding or editing a transaction is the hot path; minimize clicks, keep forms keyboard-friendly.
4. **Trust through precision** — exact currency formatting (fr-CH locale, CHF default with EUR/USD options), consistent dates, visible reconciliation between real and expected balances.
5. **Quiet by default** — motion and color signal meaning (income vs expense, alerts), never ambiance.

## Accessibility & Inclusion

WCAG AA: ≥4.5:1 body-text contrast, full keyboard navigation, visible focus states, `prefers-reduced-motion` alternatives for all animation. Charts should not rely on color alone (labels/patterns where practical). French locale formatting throughout.
