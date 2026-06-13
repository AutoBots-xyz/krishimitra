# design-system.md — Verdant Agriculture Platform
> Single source of truth for all visual decisions.
> AI assistants: never use colors, fonts, or spacing outside this system. Never invent new values.
>
> Aesthetic: Editorial · Glassmorphism · Apple-light. Light theme only.

---

## CONCEPT

**"Morning Field"** — The palette is the color of fog lifting off a field at dawn.
Not earthy, not dark, not generic ag-green. Luminous, minimal, premium.
Frosted glass panels float over an ambient gradient background of sage and harvest amber.
Typography pairs a luxury editorial serif (Cormorant Garamond) with a crisp Apple-adjacent sans (DM Sans).

---

## COLORS

```css
/* Paste into globals.css */
:root {
  --color-primary:     #1A4731;            /* Deep Forest Green — old-growth authority, Aesop-level craft */
  --color-secondary:   #C8800F;            /* Harvest Amber — wheat at golden hour, not orange */
  --color-background:  #F3F6F0;            /* Morning Mist — near-white with barely perceptible sage warmth */
  --color-surface:     rgba(255,255,255,0.68); /* Frosted Glass — glassmorphism base, always with backdrop-filter */
  --color-border:      rgba(26,71,49,0.10);   /* Glass Edge — tinted green, barely visible */
  --color-text:        #0D1910;            /* Forest Black — near-black with a green soul */
  --color-text-muted:  #6B7E72;            /* Sage Grey — between green and grey */
  --color-error:       #C53030;            /* Brick Red */
  --color-success:     #1A6B45;            /* Deep Forest Green — deeper than primary */
  --color-warning:     #B67D14;            /* Deep Amber — deeper than secondary */
}
```

**Glassmorphism surface rule — always pair surface with:**
```css
.glass {
  background: var(--color-surface);         /* rgba(255,255,255,0.68) */
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
}
```

**Ambient background rule — page always has radial gradient blobs:**
```css
body {
  background:
    radial-gradient(ellipse 60% 50% at 10% 10%, rgba(120,190,110,0.28) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 85% 25%, rgba(200,128,15,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 45% 45% at 45% 85%, rgba(26,71,49,0.14) 0%, transparent 60%),
    var(--color-background);
  background-attachment: fixed;
}
```

**Color usage rules:**
- Primary — buttons, links, active states, logo
- Secondary — highlights, badges, harvest/grain accents
- Background — page bg only (with ambient blobs)
- Surface — all glass cards, modals, nav, inputs
- Never use raw hex values in components — always use CSS variables

---

## TYPOGRAPHY

```
Display font:  'Cormorant Garamond', serif       (headings, hero text — editorial luxury)
Body font:     'DM Sans', sans-serif             (all body text — clean, Apple-adjacent)
Mono font:     'JetBrains Mono', monospace       (data values, labels, badges, timestamps)
```

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Size scale:**
```
xs:   12px  — labels, captions, timestamps
sm:   14px  — secondary text, form labels
base: 16px  — body text default
lg:   18px  — large body, intro text
xl:   20px  — small headings
2xl:  24px  — section headings
3xl:  30px  — page headings
4xl:  36px  — large headings
5xl:  48px  — hero text
hero: 88px  — display / Cormorant Garamond only
```

**Weight:**
```
normal:   400  — body text (DM Sans)
light:    300  — descriptive paragraphs (DM Sans)
medium:   500  — labels, nav, emphasis (DM Sans)
semibold: 600  — subheadings, card titles (Cormorant or DM Sans)
bold:     700  — headings (Cormorant Garamond)
```

**Signature type moment:**
The hero italic in Cormorant Garamond is the defining typographic element.
Example: "Grow with *intention.*" — the italic word carries all the weight.

---

## SPACING SCALE
> Base unit: 4px. Always use multiples.

```
1  =  4px
2  =  8px
3  = 12px
4  = 16px
5  = 20px
6  = 24px
8  = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
24 = 96px
```

---

## BORDER RADIUS

```
none:  0
sm:    4px    — badges, small tags
md:    8px    — buttons, inputs, small chips
lg:    12px   — modals, dropdowns
xl:    16px   — glass cards (primary radius)
2xl:   20px   — hero cards, feature panels
full:  9999px — pills, avatars
```

> Glass cards default to `xl` (16px) or `2xl` (20px). Avoid md on large surfaces.

---

## SHADOWS

> Use sparingly — glassmorphism provides its own depth via blur.
> Only use shadows to lift interactive cards on hover.

```
sm:  0 1px 2px rgba(0,0,0,0.04)
md:  0 4px 16px rgba(0,0,0,0.06)
lg:  0 12px 40px rgba(0,0,0,0.08)
xl:  0 24px 60px rgba(0,0,0,0.10)
```

---

## BREAKPOINTS

```
sm:  640px   — large phone
md:  768px   — tablet
lg:  1024px  — small laptop
xl:  1280px  — desktop
```

**Rule: Mobile first always.**
```tsx
// ✅ correct
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ wrong
<div className="grid grid-cols-3 md:grid-cols-1">
```

---

## CORE COMPONENTS

### Glass Card
```
Background:       rgba(255,255,255,0.68)
Backdrop-filter:  blur(24px) saturate(180%)
Border:           1px solid rgba(255,255,255,0.85)
Radius:           xl (16px) or 2xl (20px) for feature panels
Padding:          24px default
Shadow on hover:  lg
Transition:       transform 150ms ease, box-shadow 150ms ease
```

### Button — Primary
```
Background:  var(--color-primary)   #1A4731
Text:        white
Radius:      md (10px)
Padding:     12px 24px
Font:        DM Sans 500 14px
Hover:       background #153a27, translateY(-1px), shadow md
```

### Button — Ghost / Secondary
```
Background:  rgba(255,255,255,0.6) with backdrop-filter blur(12px)
Border:      1px solid rgba(26,71,49,0.18)
Text:        var(--color-primary)
Radius:      md (10px)
Hover:       background rgba(26,71,49,0.06)
```

### Input
```
Background:  rgba(255,255,255,0.6) with backdrop-filter
Border:      1px solid rgba(26,71,49,0.14)
Radius:      md (8px)
Focus:       border 1px solid var(--color-primary)
States:      default | focus | error | disabled
Always:      label above (DM Sans 13px muted), error below
```

### Badge / Chip
```
Font:     JetBrains Mono 11px 500
Padding:  3px 10px
Radius:   full (100px)
Variants:
  success  — bg rgba(26,107,69,0.10)  text var(--color-success)
  warning  — bg rgba(183,125,20,0.10) text var(--color-warning)
  error    — bg rgba(197,48,48,0.10)  text var(--color-error)
  default  — bg rgba(26,71,49,0.08)   text var(--color-primary)
```

### Section Label (eyebrow)
```
Font:      JetBrains Mono 11px 500
Case:      uppercase
Tracking:  0.08–0.10em
Color:     var(--color-text-muted)
Use:       above every section heading to categorize content
```

### Data Row (crop / table row)
```
Display:       flex, align-items center
Padding:       12–14px 0
Border-bottom: 1px solid rgba(26,71,49,0.07)
Progress bar:  4px height, background rgba(26,71,49,0.09), fill primary or warning
Numbers:       JetBrains Mono 12px, right-aligned
```

### Nav (floating pill)
```
Position:        fixed, top 16px, centered
Width:           calc(100% - 48px), max-width 1200px
Radius:          xl (16px)
Glass:           surface + backdrop-filter
Shadow:          0 4px 24px rgba(0,0,0,0.06)
Active state:    bg rgba(26,71,49,0.09), text primary
```

### Modal
```
Overlay:  rgba(0,0,0,0.4)
Panel:    glass surface, radius 2xl (20px), padding 24px
Width:    max-w-md default
Close:    top-right X, always present
```

---

## ANIMATION

```
Default transition:   all 150ms ease
Hover lift:           translateY(-2px), 150ms
Card hover:           translateY(-4px), shadow lg, 200ms
Button press:         scale(0.98)
Loading skeletons:    pulse 1.5s infinite
Page transitions:     200ms
```

---

## DESIGN SIGNATURE

The single memorable element: **the ambient radial-gradient background with floating glassmorphism panels.**
Three soft blobs — sage green (top-left), harvest amber (top-right), deep forest (bottom-center) —
create a luminous depth that every glass surface reflects and refracts.
Typography contrast: Cormorant Garamond headlines (serif editorial authority) vs DM Sans body (clean precision).
The italic hero word in primary green is the brand moment.

---

## RULES FOR AI

- Never use hex values inline — always CSS variables
- Never invent new colors outside this palette
- Never use fonts not listed here (Cormorant Garamond, DM Sans, JetBrains Mono only)
- Never use dark backgrounds — this is a light-theme-only system
- Glass surfaces always require backdrop-filter — never use surface color without it
- Always mobile first — sm: then md: then lg:
- Every interactive element needs hover + focus + disabled states
- Section eyebrows use JetBrains Mono uppercase — never DM Sans
- Data values (numbers, %, kg, ha) always use JetBrains Mono

---

*Lock this before building any UI.*
*Update here first before changing any visual decision.*
