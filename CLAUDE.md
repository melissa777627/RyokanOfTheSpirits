# 🏮 CLAUDE.md — Ryokan of The Spirits
> Agent memory file. Read this before doing anything. Do not deviate from these rules.
> Last updated: Phase 1 complete — architecture, design system, and scoring engine approved.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Ryokan of The Spirits |
| **Type** | Mobile-first personality quiz web app |
| **Core Concept** | Shadow-work psychological test disguised as a soulmate quiz. Player is a Ryokan caretaker → answers questions → matched with 1 of 32 Yokai spirits. |
| **Target** | Mobile-first, max-width 480px. Must feel like a premium illustrated game, not a web form. |
| **Tech Stack** | Vanilla HTML + CSS + JavaScript — single `index.html`. No frameworks. |

---

## 2. Development Rules (NON-NEGOTIABLE)

### Rule 0 — Clarify Before Starting
- If requirements are unclear, **ask first** — offer choices or alternatives, never guess.
- If a request is likely to break the architecture or design system, **say so** and propose a better path.
- Read `CONTEXT_FOR_CLAUDECODE.md`, `DESIGN_SYSTEM.md`, and `DATA_SCHEMA.md` before every task.

### Rule 1 — Doc-Driven Development
- **NEVER write implementation code immediately.**
- Step 1: Explain your plan and how it fits the current architecture.
- Step 2: Update relevant docs if structure changes (see Rule 4).
- Step 3: Wait for user approval.
- Step 4: Only then write the actual code.

### Rule 2 — Design Consistency
- Stick strictly to the design system in Section 3. Do not invent new hex codes or spacing values.
- All colors must use CSS variables defined in `:root`. Never use raw hex in component CSS.
- If a UI element is used more than once → extract it as a reusable CSS class.
- Read `DESIGN_SYSTEM.md` for full component specs.

### Rule 3 — DRY Code
- Never write the same logic or UI structure twice.
- Scoring logic (`scoring-engine.js`), data (`questions.js`, `YOKAI_DATA`), and UI rendering must stay separate.
- Keep functions pure, small, and named clearly. No anonymous logic blocks.

### Rule 4 — Documentation Maintenance (Mandatory After Every Task)
After any task that changes design or structure, update immediately:

| What changed | Update this file |
|---|---|
| UI components, colors, layout patterns | `DESIGN_SYSTEM.md` |
| State object, scoring logic, data shape | `DATA_SCHEMA.md` |
| New views, functions, file structure | `CONTEXT_FOR_CLAUDECODE.md` |
| Asset additions / naming | `assets/README.md` |
| Project status / todo | `CLAUDE.md` Section 10 |

### Rule 5 — Fail Fast, No Silent Fallbacks
- **No fallback policy:** Do not add silent defaults, hidden fallbacks, or backward-compat shims.
- If `state.winningHouse` is missing when Stage 2 expects it → throw a visible error, do not guess.
- If a Yokai key is missing from `YOKAI_DATA` → log explicitly, do not render partial data.
- Use `guardState()` at every view entry point. Prefer loud failure over silent corruption.

### Rule 6 — Root-Cause Fixes Only
- Never patch symptoms (hardcoding values, special-case ifs, one-off overrides).
- Read the data flow in `DATA_SCHEMA.md` → find where the invariant breaks → fix there.
- Remove incorrect logic entirely. Do not leave dead code or commented-out workarounds.

### Rule 7 — Simplicity Over Cleverness
- Vanilla JS only. No libraries unless explicitly approved.
- No speculative abstractions ("this might be useful later"). Build exactly what's needed.
- Three similar lines are better than a premature abstraction.

---

## 3. Design System (Approved — "The Zen Hearth")

> Full spec in `DESIGN_SYSTEM.md`. This section is the quick-reference summary.

### Color Palette
```css
:root {
  --primary:            #B02B2B;          /* Tori Red — CTA, high-impact */
  --primary-container:  #E8A0A0;          /* gradient endpoint */
  --secondary:          #1B4F72;          /* Nami Blue — nav, supporting info */
  --bg:                 #FDF6E3;          /* Washi paper cream — base canvas */
  --surface-low:        #F5EAD0;          /* interactive layer (quiz areas) */
  --surface-lowest:     #EFE0C0;          /* floating cards, choice buttons */
  --on-surface:         #1A120A;          /* body text — NEVER use pure black */
  --outline-variant:    rgba(26,18,10,0.15); /* ghost border (a11y only) */
}
```

### Typography
```
Kaisei Decol       → display, Yokai names, hero title, event headers  (Google Fonts)
M PLUS Rounded 1c  → body, buttons, choice text, UI labels            (Google Fonts)
Noto Serif JP      → kanji labels, eyebrow/scene text, watermarks     (Google Fonts)
```

### Core Design Rules
- **No-Line Rule** — No 1px solid borders for sectioning. Use background color shifts only.
- **Ghost Border fallback** — `--outline-variant` (15% opacity) for a11y only.
- **Glass & Gradient** — CTAs: gradient `--primary` → `--primary-container`. Modals: glassmorphism + `backdrop-filter: blur(20px)`.
- **Tonal Layering** — `--bg` (base) → `--surface-low` (interactive) → `--surface-lowest` (cards).
- **Ambient Shadows** — `0 8px 32px rgba(26,18,10,0.06)`. No hard drop shadows.
- **Seigaiha texture** — scale pattern overlay on `--surface-low` at ~0.18 opacity.
- **No pure black** — always use `--on-surface`.
- **No sharp corners** — everything rounded.

### Button Styles (Quick Reference)
- **Primary CTA:** gradient `--primary` → `--primary-container`, `border-radius: 3rem` (pill), scale 1.02 on hover
- **Secondary:** ghost border, `--secondary` text, `border-radius: 3rem`
- **Choice:** `--surface-lowest` bg, ghost border, left-aligned, `border-radius: 1.5rem`
- **FAB:** `--primary` circle, 44–48px (Omikuji, BGM)

---

## 4. App Architecture — 6 Views

```
view-landing  →  view-gender  →  view-quiz (Stage 1)
                                      ↓
                               view-bento (pop-up Q)
                                      ↓
                               view-quiz (Stage 2)
                                      ↓
                               view-loading  →  view-result
```

| View ID | Screen | Key Elements |
|---|---|---|
| `view-landing` | Landing Page | Art fade hero + paper stamp button + lorebook grid |
| `view-gender` | Event 0 · Gender | Mirror + 3 gender card buttons |
| `view-quiz` | Quiz (Stage 1 & 2 shared) | Progress bar + scene label + story box + 4 choices |
| `view-bento` | Bento Mini-Game | Drag & drop food + Continue → pop-up modal |
| `view-loading` | Loading Screen | Kanji cycle + spirit orb (3–4 sec auto-advance) |
| `view-result` | Result Page | Yokai + MBTI + why match + compat bars + gender toggle + Omikuji |

---

## 5. Scoring System — 2-Stage Funnel (Approved)

```
32 Yokai
  → Event 0:    เลือกเพศ          → pool = 16
  → Event 1–5:  House Sorting      → pool = 4 (winningHouse)
  → Bento:      pop-up Q           → นับเป็น Q แรกของ Stage 2
  → Event 6–10: Yokai Selection    → เหลือ 1 = เนื้อคู่
```

### Stage 1 — House Sorting (Event 1–5)
- 5 คำถาม, 4 ตัวเลือก/ข้อ, แต่ละตัวเลือก +1 ให้ purple/green/blue/yellow
- Tie-breaker: ดู `lastHouseAnswer` (Q5) → random

### Bento Intermission
- ลากอาหารวาง 3 slot อิสระ ไม่มีผลคะแนน
- กด Continue → `calcHouse()` → pop-up คำถาม
- คำตอบ pop-up = Q แรกของ Stage 2

### Stage 2 — Yokai Selection (Event 6–10)
- โหลดชุดคำถาม **ตาม winningHouse** (4 ชุดแยกกัน)
- 5 คำถาม (รวม bento pop-up), 4 ตัวเลือก/ข้อ
- Tie-breaker: ดู `lastYokaiAnswer` → random

### House → Yokai Pools
```javascript
const HOUSE_POOLS = {
  purple: ['Tenjin',    'Yumekui',  'Ryuu',     'Tengu'   ],
  green:  ['Shinigami', 'Yukionna', 'Kitsune',  'Tanuki'  ],
  blue:   ['Oni',       'Ningyo',   'Raijin',   'Inugami' ],
  yellow: ['Nekomata',  'Hebi',     'Jorogumo', 'Fuujin'  ]
};
```

---

## 6. State Object (Approved)

```javascript
let state = {
  playerGender:      '',   // 'male' | 'female' | 'nonbinary'
  targetGender:      '',   // 'male' | 'female' | 'any'
  resultGenderShown: '',   // เวอร์ชันที่โชว์บน result page (toggle ได้)

  houseScores:     { purple:0, green:0, blue:0, yellow:0 },
  winningHouse:    '',
  lastHouseAnswer: '',

  yokaiPool:       [],     // set โดย loadStage2()
  yokaiScores:     {},     // build dynamically จาก yokaiPool
  winningYokai:    '',
  lastYokaiAnswer: '',

  stage:         1,        // 1 = house sorting, 2 = yokai selection
  currentQ:      0,
  bentoSelected: []
};
```

---

## 7. Yokai Roster — 16 ตัว (×2 เพศ = 32 total)

| House | MBTI | Yokai | Emoji |
|---|---|---|---|
| 🟣 Purple (Analysts NT) | INTJ | Tenjin | 📜 |
| | INTP | Yumekui | 💤 |
| | ENTJ | Ryuu | 🐉 |
| | ENTP | Tengu | 👺 |
| 🟢 Green (Diplomats NF) | INFJ | Shinigami | 💀 |
| | INFP | Yukionna | ❄️ |
| | ENFJ | Kitsune | 🦊 |
| | ENFP | Tanuki | 🍃 |
| 🔵 Blue (Sentinels SJ) | ISTJ | Oni | 👹 |
| | ISFJ | Ningyo | 🧜 |
| | ESTJ | Raijin | ⚡ |
| | ESFJ | Inugami | 🐕 |
| 🟡 Yellow (Explorers SP) | ISTP | Nekomata | 🐈‍⬛ |
| | ISFP | Hebi | 🐍 |
| | ESTP | Jorogumo | 🕸️ |
| | ESFP | Fuujin | 🌪️ |

### Gender Logic
```
playerGender = 'female'    → targetGender = 'male'
playerGender = 'male'      → targetGender = 'female'
playerGender = 'nonbinary' → targetGender = 'any' (random + toggle)
```
Result page มีปุ่มสลับ male ↔ female version ตลอดเวลา

---

## 8. Landing Page Spec (Approved)

### Art Banner — Full-bleed fade
```css
/* รูปอาร์ตเต็มความกว้าง สูง ~55–60% หน้าจอ */
.art-section { position: relative; }

/* overlay fade ทับบนรูป */
.art-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 45%, #FDF6E3 90%);
  pointer-events: none;
}
```
- Nav ทับบนรูป (position absolute, z-index สูง)
- ใช้ placeholder div ก่อน — เจ้าของใส่รูปจริงทีหลัง

### Hero Content (ต่อจาก fade)
- Eyebrow: "✦ A Spirit Awaits ✦" (Noto Serif JP, gold, letter-spacing 4px)
- Title: "Ryokan of The **Spirits**" (Kaisei Decol, คำว่า Spirits = สีแดง)
- Kanji: "妖怪の宿"
- Gold ornamental divider (line + ✦ + line)
- Body text: italic, line-height 1.85
- Paper stamp button: "Begin Journey"

---

## 9. Project Files

| File | Status | Purpose |
|---|---|---|
| `CLAUDE.md` | ✅ | Master rules + architecture |
| `CONTEXT_FOR_CLAUDECODE.md` | ✅ | Quick-start context for every Claude session |
| `DESIGN_SYSTEM.md` | ✅ | "Zen Hearth" — colors, fonts, components |
| `DATA_SCHEMA.md` | ✅ | State object, YOKAI_DATA structure, scoring pseudocode |
| `scoring-engine.js` | ✅ | Pure scoring functions (no UI) |
| `questions.js` | ✅ | 25 placeholder questions รอเนื้อหา |
| `README.md` | ✅ | Asset naming guide + folder structure |
| `assets/yokai/` | ⬜ | Yokai art — `{name}_{m|f}.png` × 32 |
| `assets/ui/` | ⬜ | hero_art, seigaiha, ornament_divider |
| `assets/audio/` | ⬜ | BGM + SFX |
| `index.html` | ✅ Step 1–2 | Shell + CSS tokens + Landing page |

---

## 10. Current Status

### ✅ Done
- Design system, style guide, design system doc ครบ
- Scoring engine พร้อม (scoring-engine.js)
- Question bank placeholder 25 ข้อ (questions.js)
- Data schema + state object approved
- Yokai roster 16 ตัว confirmed
- 2-stage scoring architecture approved
- Gender routing logic approved
- Landing page design approved (art fade + paper stamp)

### ⬜ Todo
- [ ] `index.html` ทุก view (รอ plan mode)
- [ ] Wire scoring-engine.js เข้า UI
- [ ] Bento drag & drop
- [ ] Dynamic question loader ตาม winningHouse
- [ ] Result page + gender toggle + Omikuji modal
- [ ] Loading animation
- [ ] BGM/SFX audio manager (stub ก่อน)
- [ ] Share to Story (html2canvas)
- [ ] เนื้อหาคำถาม 25 ข้อ (เจ้าของเขียนเอง)
