---
name: Journal financier privé
description: A private financial ledger — local, precise, fr-CH. Numbers are the heroes; chrome earns every pixel.
colors:
  paper: "oklch(0.985 0.002 260)"
  surface: "oklch(1 0 0)"
  sunken: "oklch(0.962 0.004 260)"
  ink: "oklch(0.215 0.02 265)"
  ink-soft: "oklch(0.45 0.02 265)"
  ink-faint: "oklch(0.52 0.02 265)"
  line: "oklch(0.9 0.005 265)"
  line-strong: "oklch(0.8 0.01 265)"
  accent: "oklch(0.49 0.2 264)"
  accent-soft: "oklch(0.95 0.025 264)"
  positive: "oklch(0.5 0.12 158)"
  positive-soft: "oklch(0.94 0.04 158)"
  negative: "oklch(0.51 0.17 27)"
  negative-soft: "oklch(0.95 0.025 27)"
typography:
  headline:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  micro:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    fontFeature: "\"tnum\""
rounded:
  sm: "2px"
  DEFAULT: "4px"
  md: "6px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 1rem"
    height: "2.25rem"
  button-primary-hover:
    backgroundColor: "oklch(0.215 0.02 265 / 0.85)"
    textColor: "{colors.paper}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 1rem"
    height: "2.25rem"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 1rem"
    height: "2.25rem"
  button-outline-hover:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 1rem"
    height: "2.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 0.625rem"
    height: "2.25rem"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.negative}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 1rem"
    height: "2.25rem"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 0.75rem"
    height: "2.25rem"
  input-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 0.75rem"
    height: "2.25rem"
---

# Design System: Journal financier privé

## 1. Overview

**Creative North Star: "The Private Ledger"**

A ruled private ledger kept on a banker's desk. Every column aligns, every number is legible at a glance, every stroke of chrome justifies its presence against the data it serves. The surface is light but not warm — the barely-blue neutrals carry the precision of blue-black ink rather than the ease of cream paper. This is a tool for a single informed user who already trusts the premise; the interface earns nothing by persuading and everything by being accurate.

The system does not try to win anyone over. It trusts that the user is already invested. Success is a reconciled balance understood in under two seconds and a transaction logged in under five keystrokes. Every design decision is tested against that measure: does this chrome help, or does it just occupy space?

Explicitly rejected: soft glassmorphism (blurred glass cards, pastel radial gradients, backdrop-filter used decoratively); neobank marketing aesthetics (Revolut/N26-style purple gradients, blobby shapes, playful illustrations); gamified encouragement (confetti, badges, streaks, progress bars tied to behavior); and any marketing-page theatrics — hero sections, gradient CTAs, scroll-driven choreography — applied inside a working tool.

**Key Characteristics:**
- Cool blue-tinted neutrals throughout — paper → surface → sunken form implicit depth without shadows
- IBM Plex Mono carries every financial value; no exceptions; tabular figures and typographic minus
- Indigo Ink accent used exclusively for primary actions, focus rings, and active selection — never decoration
- Green / terracotta semantic pair signals income vs expense with unambiguous meaning
- Motion is state-only: 150–200 ms, out-quart easing, no choreography, no page-load sequences
- Fixed type scale (not fluid): consistent viewport density, no clamp() on labels or data

---

## 2. Colors: The Cool Blue Ledger

A single-accent system built on a stratified cool blue-tinted neutral ramp. Indigo Ink is the only non-semantic accent; a green/terracotta pair handles all financial meaning.

### Primary

- **Indigo Ink** (`oklch(0.49 0.2 264)` ≈ `#3047c0`): The one accent. Used on primary button backgrounds, focus rings, active tab indicators, selected nav states, and form focus borders. Nowhere else. Its rarity is load-bearing; every appearance says "this matters."
- **Indigo Ink Soft** (`oklch(0.95 0.025 264)` ≈ `#eaeaf8`): Background tint for accent-adjacent states (focus halos, tag backgrounds). Never used as a standalone surface.

### Neutral

- **Barely Blue Near-White / Paper** (`oklch(0.985 0.002 260)` ≈ `#f9f9fd`): The base canvas. The chroma 0.002 blue tint is intentional — it reads as precision, not warmth. This is the document floor.
- **Pure White / Surface** (`oklch(1 0 0)` = `#ffffff`): Cards, inputs, select controls, modal panels. Elevated one tier above paper; the contrast is subtle but legible.
- **Cool Well / Sunken** (`oklch(0.962 0.004 260)` ≈ `#f1f1f8`): Sidebar background, tab rail, disabled inputs, recessed containers. Slightly darker than paper — a deliberate tonal step down.
- **Prussian Near-Black / Ink** (`oklch(0.215 0.02 265)` ≈ `#1b1b30`): Primary text and primary button backgrounds. Cool, near-black with a faint blue cast — consistent with the blue-ink metaphor throughout.
- **Secondary Text / Ink Soft** (`oklch(0.45 0.02 265)` ≈ `#5a5a78`): Secondary text, ghost button text, inactive nav labels. Mid-dark; clearly readable, clearly secondary.
- **Placeholder / Ink Faint** (`oklch(0.52 0.02 265)` ≈ `#686884`): Placeholder text, tertiary metadata, icon strokes on inactive states. Meets 4.5:1 against surface.
- **Default Border / Line** (`oklch(0.9 0.005 265)` ≈ `#e2e2ec`): Card borders, dividers, tab container borders. The standard boundary; present but not competing.
- **Form Border / Line Strong** (`oklch(0.8 0.01 265)` ≈ `#c5c5d5`): Input and select control borders at rest. Stronger than line to give form controls a legible boundary against the white surface.

### Semantic

- **Sage Credit / Positive** (`oklch(0.5 0.12 158)` ≈ `#2b6c43`): Income amounts, positive balance deltas, gain indicators. Forest green; readable against both surface and paper.
- **Positive Soft** (`oklch(0.94 0.04 158)` ≈ `#e0f0e7`): Background tint for income rows, tag backgrounds.
- **Russet Debit / Negative** (`oklch(0.51 0.17 27)` ≈ `#8c3320`): Expense amounts, negative balance deltas, deficit indicators. Terracotta-red; distinct from the green at any saturation level.
- **Negative Soft** (`oklch(0.95 0.025 27)` ≈ `#f5e8e5`): Background tint for expense rows, danger states.

### Named Rules

**The One Voice Rule.** Indigo Ink is the only non-semantic accent in the system. It appears on primary actions, active selection, and focus rings — and nowhere else. If you are reaching for `accent` to make something look important without it being a primary action, stop. Use weight, size, or position instead.

**The Semantic Pair Rule.** Positive (green) and Negative (terracotta) are reserved exclusively for financial meaning: income, expense, and balance deltas. They are never used for generic UI states (errors, success toasts, warnings). A form error uses ink, not red. A saved-successfully state uses a neutral confirmation, not green.

---

## 3. Typography

**Body / UI Font:** Inter Variable (with Inter, Segoe UI, system-ui, sans-serif fallbacks)
**Numeric / Mono Font:** IBM Plex Mono (with ui-monospace, Consolas, monospace fallbacks)

**Character:** Inter Variable handles every language token — headings, labels, navigation, body copy. IBM Plex Mono handles every number without exception. These two families serve completely different semantic jobs and never cross into each other's territory. The pairing is not decorative; Plex Mono's fixed pitch and tabular figures are functional requirements for a financial register.

### Hierarchy

- **Headline** (600 weight, 1.125rem / 18px, −0.025em tracking, lh 1.4): Page titles in the header only. One per screen. Uses `text-wrap: balance`.
- **Title** (600 weight, 0.9375rem / 15px, −0.025em tracking, lh 1.4): Card headings, section headings, modal titles. `text-wrap: balance`.
- **Body** (400 weight, 0.875rem / 14px, lh 1.5): Descriptions, form labels, table cell content, navigation labels.
- **Label** (400 weight, 0.8125rem / 13px, lh 1.4): Card descriptions, secondary metadata, supporting copy below titles.
- **Micro** (400 weight, 0.75rem / 12px, lh 1.4): Timestamps, mobile nav labels, the `privé · local · fr-CH` identity mark. Mono variant used here for the identity tagline.
- **Mono** (IBM Plex Mono 400, 0.875rem / 14px, `font-variant-numeric: tabular-nums`, `font-feature-settings: "tnum"`): All currency amounts. Always. The `Amount` component enforces this; do not bypass it with raw text.

### Named Rules

**The Mono Reserve Rule.** IBM Plex Mono is for numbers only. Not for labels, navigation, code, or any text that isn't a financial value. The single deliberate exception is the `privé · local · fr-CH` tagline in the sidebar — it uses mono as a metadata voice, not as aesthetic chrome.

**The Minus Rule.** Negative amounts use the typographic minus (−, U+2212), never a hyphen-minus (-). The `Amount` component handles this; never render a negative value as raw text with a hyphen.

---

## 4. Elevation

Tonal layering, flat by default. Depth is communicated through three background tiers — paper → surface → sunken — not through shadow. At rest, no component in the system casts a shadow.

The three-tier ramp reads naturally: sunken (sidebar, tab rails) sits below surface (cards, inputs), which sits above paper (the document canvas). Borders (line, line-strong) mark the boundaries within this layering.

The single exception is the modal dialog, which adds a structural shadow (`0 20px 60px oklch(0.215 0.02 265 / 0.1)`) to lift it clearly above the overlay backdrop. This shadow is structural, not decorative — it's doing work that tonal layering alone cannot do when a surface sits on top of a full-screen overlay.

### Shadow Vocabulary

- **Modal Shadow** (`box-shadow: 0 20px 60px oklch(0.215 0.02 265 / 0.1)`): Applied exclusively to the modal panel. Cool-tinted shadow consistent with the ink color. No other component uses this.

### Named Rules

**The No-Shadow Rule.** No interactive element, card, or panel uses a shadow at rest or on hover. Shadows appear only when a surface exits the document flow (modal dialog). If you are reaching for `box-shadow` on a component that is not a portal-rendered dialog, use a border or a tonal background shift instead.

---

## 5. Components

### Buttons

Clean, compact, tool-grade. No rounded pills, no gradient fills, no icon-only affordances without a title attribute.

- **Shape:** Mildly rounded (4px) — functional, not soft. Consistent across all variants.
- **Height:** 36px (`h-9`) for full-size; 28px (`h-7`) for compact size. Consistent with input height for aligned form rows.
- **Primary:** Ink background (near-black), paper text. Maximum contrast. Used for the single most important action per screen (submit, save, add).
- **Primary Hover:** Ink at 85% opacity — a subtle lightening, no color shift. Active state returns to full ink.
- **Outline:** Surface background, line-strong border, ink text. Secondary actions. Hover shifts to sunken background.
- **Ghost:** No border, no background, ink-soft text → ink on hover. Tertiary actions, inline controls, icon-adjacent text actions.
- **Danger:** No background, negative (terracotta) text → negative-soft background on hover. Destructive confirmation only; never used as a general "cancel" variant.
- **Focus ring (all variants):** 2px accent ring, 1px paper offset. Always visible; never suppressed.
- **Disabled (all variants):** 50% opacity, pointer-events none.

### Inputs and Selects

- **Height:** 36px — matches button height for aligned rows.
- **Border:** line-strong at rest (`oklch(0.8 0.01 265)`) → accent border + 1px accent ring on focus.
- **Background:** surface (white) — visually elevated above the paper canvas.
- **Radius:** 4px — matches buttons.
- **Placeholder:** ink-faint (`oklch(0.52 0.02 265)`) — meets 4.5:1 contrast against surface.
- **Disabled:** sunken background, ink-faint text, not-allowed cursor.
- **Select:** Identical to input, with an absolutely-positioned ChevronDown icon (ink-faint) and `appearance: none`.

### Tabs (animated)

The smoothest interactive component in the system. The sliding ink pill is the signature transition.

- **Container:** Sunken background, line border, 4px radius, 2px inner padding.
- **Indicator:** Ink-colored `<div>` absolutely positioned; animates `left` and `width` simultaneously in 200ms using the `out-quart` curve (`cubic-bezier(0.25, 1, 0.5, 1)`). This is driven by measuring DOM rects on layout, not CSS transitions on a calculated percentage.
- **Active label:** Paper (white on the ink pill). 500 font-weight. 13px.
- **Inactive label:** ink-soft → ink on hover. Transition 150ms.
- **Keyboard:** Arrow keys move between tabs; Home/End jump to ends. ARIA role `radiogroup` / `radio`.

### Cards

- **Corner style:** Gently rounded (6px, `rounded-md`).
- **Background:** Surface (white) — elevated above the paper canvas; the most common content container.
- **Border:** Line (`oklch(0.9 0.005 265)`) — the primary boundary affordance. No shadow.
- **Padding:** 20px (`p-5`) uniformly.
- **Card title:** 15px, 600 weight, −0.025em tracking, ink.
- **Card description:** 13px, 400 weight, ink-soft.
- **Nesting rule:** Cards are never nested inside other cards. If a section within a card needs visual separation, use a border-top or a background shift to sunken.

### Modal

- **Shape:** `rounded-md` (6px), `max-w-md`, `max-h-[80vh]` with overflow scroll on the body area.
- **Background:** Surface with the one system shadow (`shadow-xl shadow-ink/10`).
- **Backdrop:** `bg-ink/40` overlay, 150ms fade-in.
- **Header:** Sticky, `border-b line`, 15px semibold title + X close button (ghost variant, p-1).
- **Animation:** Scale 0.985 → 1 + translateY 4px → 0 in 180ms out-quart. Backdrop fades 150ms ease-out.
- **Focus management:** Trap on open, return to trigger on close, Escape to dismiss. Native dialog semantics (`role="dialog"`, `aria-modal`, `aria-labelledby`).
- **Rendering:** Always via `createPortal` to `document.body` — never inside an `overflow: hidden` ancestor.

### Amount (signature component)

The single most important component in the system. Every financial value goes through `<Amount>`.

- **Font:** IBM Plex Mono, 400 weight, `font-variant-numeric: tabular-nums`.
- **Minus sign:** Typographic minus (−, U+2212). Never a hyphen.
- **Tones:**
  - `revenu` → `+CHF 1 000.00` in positive (Sage Credit green)
  - `depense` → `−CHF 89.00` in negative (Russet Debit terracotta)
  - `signed` → colored by arithmetic sign
  - `neutral` → ink; for totals, reconciliation values, reference balances
- **Never render a currency value as raw text.** The `Amount` component enforces locale formatting (fr-CH), the correct minus sign, and the correct semantic color.

### Navigation (Desktop Sidebar)

- **Container:** Sunken sidebar, sticky full-height, 230px width.
- **Item shape:** `rounded` (4px), 1px border.
- **Active state:** Surface background + line border + ink text + 500 weight. The border makes active readable without needing a color change on the label.
- **Inactive state:** Transparent border, ink-soft text → surface/60 background + ink text on hover. 150ms color transition.
- **Icon:** 16px Lucide icon, ink-faint color — always `aria-hidden`.

### Navigation (Mobile Bottom Bar)

- **Position:** Fixed bottom, full-width, surface background, border-top line.
- **Safe area:** `padding-bottom: env(safe-area-inset-bottom, 0px)` via `.pb-safe` utility.
- **Active state:** Accent-colored icon (20px), ink text label (10px, 500 weight).
- **Inactive state:** Ink-faint icon + ink-faint label.

---

## 6. Do's and Don'ts

### Do

- **Do** use IBM Plex Mono with `font-variant-numeric: tabular-nums` for every currency value, without exception. Route all amounts through the `<Amount>` component.
- **Do** use the typographic minus (−, U+2212) for negative amounts — never a hyphen-minus. The `Amount` component handles this.
- **Do** format all amounts with fr-CH locale (`Intl.NumberFormat("fr-CH")`) and CHF as the default currency.
- **Do** apply `text-wrap: balance` to all h1–h3 elements. It is already set globally in `index.css`.
- **Do** use tonal background tiers (paper → surface → sunken) to convey depth. Reach for `box-shadow` only on the modal dialog.
- **Do** keep all interactive controls at 36px height (`h-9`) for consistent hit targets and aligned form rows.
- **Do** use Indigo Ink exclusively for primary actions, focus rings, and active selection — its rarity is load-bearing.
- **Do** apply the Semantic Pair (positive green / negative terracotta) consistently and only for financial state — income, expense, balance delta.
- **Do** implement `prefers-reduced-motion` alternatives for every animation. The global override in `index.css` covers most cases; ensure any JS-driven animation checks `matchMedia("(prefers-reduced-motion: reduce)")`.
- **Do** render dialogs and dropdowns via `createPortal` to `document.body` — never inside an `overflow: hidden` ancestor.
- **Do** return focus to the trigger element when a modal closes.

### Don't

- **Don't** use soft glassmorphism: blurred glass cards, pastel radial gradients, or `backdrop-filter` for decoration. The PRODUCT.md names this the primary anti-reference.
- **Don't** apply neobank marketing aesthetics: Revolut/N26-style purple gradients, blobby background shapes, playful illustrations, or animated brand mascots.
- **Don't** add confetti, badges, streaks, or any gamified encouragement. This is a precision tool, not a habit app.
- **Don't** add decorative motion. If a transition does not communicate a state change (open/close, loading, selection), it does not belong.
- **Don't** use Indigo Ink on inactive states, ambient decoration, or headings. If it appears somewhere unexpected, it should not be there.
- **Don't** use positive (green) or negative (terracotta) for anything other than financial state. A form error is not a financial negative; style it with ink and a structural border, not red.
- **Don't** pair Inter with another sans-serif. The two-family system is Inter + IBM Plex Mono; no third family.
- **Don't** use `box-shadow` on any component that is not a portal-rendered modal dialog. Borders and tonal backgrounds handle all other depth.
- **Don't** use side-stripe borders (`border-left` greater than 1px as a colored accent) on cards, callouts, or list items.
- **Don't** use gradient text (`background-clip: text` with a gradient background). Emphasis is achieved through weight, size, or color — never gradients.
- **Don't** render amounts as raw text strings. Always use the `<Amount>` component to guarantee locale formatting, the correct minus sign, and semantic color.
- **Don't** use a card inside another card. If a nested boundary is needed, use a border-top divider or a sunken background shift.
