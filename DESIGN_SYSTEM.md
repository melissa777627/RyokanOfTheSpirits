# Design System — Ryokan of The Spirits
**"The Zen Hearth"**

> Merged spec: visual rules from the Zen Hearth document + typography confirmed from Stitch project DESIGN_SYSTEM_01.md.

---

## 1. Overview & Creative North Star

This design system moves away from the generic, grid-locked structures of standard web apps to embrace a refined, illustrative experience. It is inspired by the warmth of a Japanese hearth (*irori*) and the modern *kawaii* culture.

Instead of rigid lines, we use **intentional asymmetry** and **overlapping layers** to create a sense of discovery. The experience should feel like high-end stationery. We break the "template" look by treating the screen as a canvas where elements have room to breathe, using the cream background as a unifying organic texture.

---

## 2. Colors

Our palette is rooted in traditional Japanese pigments, balanced with soft, approachable neutrals.

```css
:root {
  --primary:            #B02B2B;          /* Tori Red — CTA, high-impact moments */
  --primary-container:  #E8A0A0;          /* gradient endpoint for CTAs */
  --secondary:          #1B4F72;          /* Nami Blue — nav, supporting info */
  --bg:                 #FDF6E3;          /* Washi paper cream — base canvas */
  --surface-low:        #F5EAD0;          /* interactive layer (quiz, question areas) */
  --surface-lowest:     #EFE0C0;          /* floating cards, choice buttons */
  --on-surface:         #1A120A;          /* body text — NEVER use pure black */
  --outline-variant:    rgba(26,18,10,0.15); /* ghost border fallback (a11y only) */
}
```

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.**
Boundaries must be defined solely through background color shifts (e.g., `--bg` → `--surface-low`).

### Surface Hierarchy & Tonal Layering
Treat the UI as a series of physical paper layers:

| Layer | Token | Use |
|---|---|---|
| Base | `--bg` | Main canvas |
| Interactive | `--surface-low` | Quiz areas, question containers |
| Floating | `--surface-lowest` | Cards, choice buttons, overlays |

### The "Glass & Gradient" Rule
- **CTAs & hero backgrounds:** subtle gradient from `--primary` → `--primary-container`
- **Modals & floating overlays:** Glassmorphism — semi-transparent `--surface-lowest` + `backdrop-filter: blur(20px)`

---

## 3. Typography

> **Source:** Confirmed from Stitch project (DESIGN_SYSTEM_01.md). All fonts are Google Fonts (open-source).

| Role | Font | Weight | Use |
|---|---|---|---|
| Display | **Kaisei Decol** | 700 | Yokai names, hero title, event headers |
| Body | **M PLUS Rounded 1c** | 500 / 700 | Body copy, button labels, choice text, nav |
| Accent | **Noto Serif JP** | 400–700 | Kanji labels, scene eyebrow, watermark backgrounds |

### Fallback Stack
| Context | Fallback |
|---|---|
| Display | Georgia, serif |
| Body | Arial, sans-serif |

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@700&family=M+PLUS+Rounded+1c:wght@500;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
```

---

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering**, not structural shadows.

- **Layering Principle:** Place `--surface-lowest` card on `--surface-low` section → natural "lift" mimicking paper stock.
- **Ambient Shadows:** For floating elements (FABs, Next button):
  - Color: tinted `--on-surface` at **6% opacity**
  - Blur: `24px`–`40px` — soft ambient glow, not a hard drop shadow
  ```css
  box-shadow: 0 8px 32px rgba(26,18,10,0.06);
  ```
- **Ghost Border Fallback:** If a border is required for accessibility, use `--outline-variant` (15% opacity). Never use 100% opaque borders.
- **Seigaiha Texture:** Wave/scale pattern overlay on `--surface-low` sections at ~0.18 opacity to add soul.

---

## 5. Components

### Buttons

| Type | Background | Border | Radius | Hover |
|---|---|---|---|---|
| **Primary CTA** | gradient `--primary` → `--primary-container` | none | `3rem` (pill) | scale 1.02 |
| **Secondary** | transparent | ghost (`--outline-variant`) | `3rem` | scale 1.02 |
| **Choice** | `--surface-lowest` | ghost (`--outline-variant`) | `1.5rem` | background → `--surface-low` |
| **FAB** | `--primary` | none | `50%` | scale 1.05 |

### Cards & Lists
- **Rule of Silence:** No divider lines. Separate items with vertical whitespace or background color shifts.
- **Asymmetry (Result cards):** Slightly varied corner radii (e.g., top-left `2rem`, others `1.5rem`) for scrapbook feel.

### Quiz Progress Bar
- Track: `--surface-low`
- Fill: `--primary`
- Add small character icon at leading edge of fill

### Modals / Overlays
- Background: `rgba(239,224,192,0.7)` (`--surface-lowest` at 70%)
- `backdrop-filter: blur(20px)`
- `border-radius: 2rem`
- Ambient shadow: `0 8px 40px rgba(26,18,10,0.06)`

---

## 6. Do's and Don'ts

### Do
- **DO** use whitespace as a functional tool. Increase padding before adding any border.
- **DO** use `--secondary` blue tones to balance the heat of `--primary` red.
- **DO** use `--on-surface` for all text — never `#000000`.
- **DO** keep corners rounded. Everything in this system should feel safe, soft, and touchable.

### Don't
- **DON'T** use pure black (`#000000`). Always use `--on-surface`.
- **DON'T** use sharp 90-degree corners anywhere.
- **DON'T** use 1px solid borders for layout sectioning.
- **DON'T** use hard drop shadows. Keep shadows ambient and barely visible.
- **DON'T** use `background: white` or `#FFFFFF`. Base is always `--bg`.
