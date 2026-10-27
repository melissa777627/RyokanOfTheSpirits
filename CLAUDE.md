# 🏮 CLAUDE.md — Ryokan of The Spirits
> Agent memory file. Read this before doing anything. Do not deviate from these rules.
> Last updated: Phase 2 — question design final (11 ข้อ), scoring redesign documented, engine รอเขียนใหม่.

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
Noto Serif Thai    → ตัวไทยของ display + kanji (fallback ในตัวแปร)    (Google Fonts)
Sarabun            → ตัวไทยของ body (fallback ในตัวแปร)               (Google Fonts)
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
view-landing  →  view-gender  →  view-quiz (Stage 1 · E1–E5)
                                      ↓  calcHouse()
                               view-bento (pop-up Q ก่อน → ลากอาหาร)
                                      ↓
                               view-quiz (Stage 2 · E6–E10)
                                      ↓  outro → calcYokai()
                               view-loading  →  view-result
```

| View ID | Screen | Key Elements |
|---|---|---|
| `view-landing` | Landing Page | Art fade hero + paper stamp button + lorebook grid |
| `view-gender` | Event 0 · Gender | Mirror + 3 gender card buttons |
| `view-quiz` | Quiz (Stage 1 & 2 shared) | Progress bar + scene label + story box + 4 choices |
| `view-bento` | Bento Mini-Game | (ก่อนเข้า view: narration บทเชื่อมฟ้าสาง → ฉากเบนโตะหน้าแยก) → Intro card → pop-up Q (prompt อย่างเดียว) → drag & drop food → Continue → บทพูดของแขก |
| `view-doll` | E7 Teru Teru Bozu | Intro card → วาดหน้า (ซูมหัว · สีฟิกซ์ + วงล้อสี, 3 ความหนา, undo/clear) → Next → แต่งตัว (แท็บ Ribbon/Hat/Flower/Charm + ชั้นวางแบบ Bento, undo) → Done reveal — cosmetic, ไม่มีผลคะแนน |
| `view-loading` | Loading Screen | Kanji cycle + spirit orb (3–4 sec auto-advance) |
| `view-result` | Result Page | Hero (Yokai + บับเบิ้ลแตะคุย) + การ์ดปัด 心/縁/共 (กางอ่านต่อ) + เหมือนกัน/ความเข้ากัน + คู่ที่เกือบได้ + ตุ๊กตา + gender toggle + Omikuji |

---

## 5. Scoring System — 2-Stage Funnel (Approved)

```
32 Yokai
  → Event 0:     เลือกเพศ                 → pool = 16
  → E1–E5:       House Sorting (คืนพายุ)   → pool = 4 (winningHouse)
  → Bento:       pop-up Q                  → Q แรกของ Stage 2
  → E6–E10:      Yokai Selection (แขกในหมอก) → เหลือ 1 = เนื้อคู่
รวม 11 ข้อ (5 + Bento + 5)
```
Pseudocode เต็ม → `DATA_SCHEMA.md` Section 5

### Stage 1 — House Sorting (E1–E5)
- วัด **บ้านของเนื้อคู่** จากแผลที่ผู้เล่นมี (Schema Therapy × Keirsey) ไม่ใช่บ้านของผู้เล่น
- 5 คำถาม ทุกข้อมี 4 ช้อย = 4 บ้านครบ · ช้อย: บ้านหลัก **+2**, บ้านสำรอง **+1** (`SECONDARY_HOUSE`: purple↔blue, green↔yellow)
- Tie-break: บ้านหลักที่ถูกเลือกบ่อยสุด → บ้านหลักล่าสุดไล่ย้อนจาก E5 (ไม่ random)
- `calcHouse()` เรียกทันทีหลังตอบ E5

### E7 · วาดหน้าตุ๊กตาไล่ฝน (view-doll)
- ฉาก E7 ("คืนหนึ่งฝนตกไม่ยอมหยุด…") เล่นเป็น narration ก่อนทั้งสองชุด · หน้าคำถามโชว์แค่ prompt
- J/P (purple/green): ถาม E7 ก่อน → วาด · T/F (blue/yellow): วาดก่อน → ถาม (คำถาม T/F คือ "ตุ๊กตาเสร็จแล้ว แขวนตรงไหน")
- ลำดับกำหนดใน `questions.js` → `yokai[2].doll = { JP: 'after', TF: 'before' }`
- รูปที่วาดเก็บใน `state.dollImage` → หน้า result โชว์คู่กับตุ๊กตาประจำ Yokai (`YOKAI_DATA[x].dollImage`)

### Bento Intermission
- ฉากเบนโตะ ("เช้าวันแรกที่เขาพักต่อ…") เล่นเป็น narration หน้าแยก ต่อจาก lead และก่อนการ์ด "Time to prepare some bento." · pop-up โชว์แค่ prompt
- กฎเดียวกับ E7: ข้อที่มีมินิเกม เล่นฉากเป็น narration ก่อนการ์ดเสมอ
- pop-up คำถามขึ้น **ก่อน** ลากอาหาร · คำตอบ = Q แรกของ Stage 2
- ลากอาหารลงกล่องอิสระ ไม่มีผลคะแนน → Continue → บทพูดของแขก → E6

### Stage 2 — Yokai Selection (Bento + E6–E10)
- stem เดียวกันทุกบ้าน · บ้านล็อกตัวอักษรไว้ 2 ตัว เหลือ 2 แกนให้วัด
- Bento / E6 / E7 = แกนที่ 2 (`HOUSE_AXIS`: purple/green = **J/P**, blue/yellow = **T/F**) — มี 2 ชุดช้อยต่อข้อ
- E8 / E9 / E10 = **E/I** — ชุดเดียวทุกบ้าน
- แต่ละข้อ: ช้อยขั้วละ 2 ตัว · ตัดสิน **เสียงข้างมาก 3 ข้อต่อแกน** (ไม่มีเสมอ ไม่มี tie-breaker)
- ทุกช้อยติด function (Te/Ne/Pi ฯลฯ) → เก็บใน `stage2Answers` ไว้ใช้หน้า result ไม่มีผลกับคะแนน

### House → Yokai Pools
```javascript
const HOUSE_POOLS = {
  purple: ['Tenjin',    'Yumekui',  'Ryuu',     'Kitsune' ],
  green:  ['Shinigami', 'Yukionna', 'Oni',      'Tanuki'  ],
  blue:   ['Tengu',     'Ningyo',   'Jorogumo', 'Inugami' ],
  yellow: ['Nekomata',  'Hebi',     'Raijin',   'Fuujin'  ]
};
```

---

## 6. State Object (Approved)

```javascript
let state = {
  playerGender:      '',   // 'male' | 'female' | 'nonbinary'
  targetGender:      '',   // 'male' | 'female' | 'any'
  resultGenderShown: '',   // เวอร์ชันที่โชว์บน result page (toggle ได้)

  houseScores:   { purple:0, green:0, blue:0, yellow:0 },
  houseAnswers:  [],       // บ้านหลักแต่ละข้อ ตามลำดับ — tie-break
  winningHouse:  '',

  yokaiPool:     [],       // set โดย loadStage2()
  stage2Answers: [],       // [{ qid, axis, pole, fn }] — เสียงข้างมาก + function สำหรับ result
  winningYokai:  '',

  stage:         1,        // 1 = house sorting, 2 = yokai selection
  currentQ:      0,
  bentoSelected: [],
  dollImage:     ''        // PNG dataURL ตุ๊กตาที่ผู้เล่นวาด (E7) — cosmetic
};
```

---

## 7. Yokai Roster — 16 ตัว (×2 เพศ = 32 total)

| House | MBTI | Yokai | Emoji |
|---|---|---|---|
| 🟣 Purple (Analysts NT) | INTJ | Tenjin | 📜 |
| | INTP | Yumekui | 💤 |
| | ENTJ | Ryuu | 🐉 |
| | ENTP | Kitsune | 🦊 |
| 🟢 Green (Diplomats NF) | INFJ | Shinigami | 💀 |
| | INFP | Yukionna | ❄️ |
| | ENFJ | Oni | 👹 |
| | ENFP | Tanuki | 🍃 |
| 🔵 Blue (Sentinels SJ) | ISTJ | Tengu | 👺 |
| | ISFJ | Ningyo | 🧜 |
| | ESTJ | Jorogumo | 🕸️ |
| | ESFJ | Inugami | 🐕 |
| 🟡 Yellow (Explorers SP) | ISTP | Nekomata | 🐈‍⬛ |
| | ISFP | Hebi | 🐍 |
| | ESTP | Raijin | ⚡ |
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
/* รูปอาร์ตเต็มความกว้าง สูง ~70% หน้าจอ */
.art-section { position: relative; }

/* overlay fade ทับบนรูป */
.art-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%,
    color-mix(in srgb, var(--bg) 45%, transparent) 68%,
    color-mix(in srgb, var(--bg) 82%, transparent) 86%, var(--bg) 100%);
  pointer-events: none;
}
```
- Nav ทับบนรูป (position absolute, z-index สูง)
- รูปจริง: `assets/ui/hero/hero.jpg`
- `.hero-content` ดึงขึ้นทับขอบล่างของรูป (`margin-top: -140px`) — ไล่สีนุ่มให้เห็นภาพหลัง eyebrow/title (เจ้าของขอ 2026-10-20)

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
| `questions.js` | ✅ | 11 ข้อ FINAL (ไทย) + บทเชื่อมฉาก ตาม DATA_SCHEMA §4 |
| `thai-break.js` | ✅ | ตัดบรรทัดภาษาไทย (pure) — รายการคำห้ามแยก/ห้ามขึ้นต้น/ห้ามจบบรรทัด · ข้อความไทยทุกจุดต้องผ่าน `thaiBreakable()` |
| `README.md` | ✅ | Asset naming guide + folder structure |
| `.claude/agents/spirit-psychologist.md` | ✅ | Subagent: MBTI/psychometrics — เขียน/ตรวจ/จำลองคำถาม + เนื้อหาผลลัพธ์ (read-only, เสนอร่างเท่านั้น) |
| `.claude/agents/ryokan-storyteller.md` | ✅ | Subagent: นักเขียนนิยายไทย — ขัดเกลาฉาก/ช้อย/บทพูดให้สละสลวย พีเรียดเบาๆ อ่านง่าย โดยไม่เปลี่ยนสิ่งที่คำถามวัด (read-only, เสนอร่างเท่านั้น) |
| `.claude/agents/thai-line-editor.md` | ✅ | Subagent: บรรณาธิการภาษาไทย — เกลาบทพูด/ช้อยที่ร่างแล้วให้เป็นภาษาที่คนพูดจริง อ่านรอบเดียวเข้าใจ ไม่เหมือนแปลมา (ใช้หลัง storyteller · read-only) |
| `assets/yokai/` | 🔄 | Yokai art — `{name}_{m|f}.png` × 32 · มีแล้ว 16 + Tanuki_f (mp4) · ยังขาด: ♂ Tenjin Yumekui Ryuu Kitsune Shinigami Yukionna Ningyo Jorogumo Fuujin · ♀ Tenjin Ryuu Kitsune Jorogumo Hebi Raijin |
| `assets/ui/` | ⬜ | hero_art, seigaiha, ornament_divider |
| `assets/audio/` | ⬜ | BGM + SFX |
| `index.html` | ✅ Step 1–2 | Shell + CSS tokens + Landing page |

---

## 10. Current Status

### ✅ Done
- Design system, style guide, design system doc ครบ
- Scoring redesign approved + documented (DATA_SCHEMA §5) — need-based houses +2/+1, Stage 2 เสียงข้างมากรายแกน
- เนื้อหาคำถาม 11 ข้อ + บทเชื่อมฉาก + ข้อความปิด FINAL (ภาษาไทย, ต้นฉบับอยู่ใน memory)
- Data schema + state object approved
- Yokai roster 16 ตัว confirmed
- 2-stage scoring architecture approved
- Gender routing logic approved
- Landing page design approved (art fade + paper stamp)

### ⬜ Todo
- [ ] `index.html` ทุก view (รอ plan mode)
- [ ] Wire scoring-engine.js เข้า UI
- [ ] Bento drag & drop
- [x] เขียน `scoring-engine.js` ใหม่ตาม DATA_SCHEMA §5 + `validateQuestions()` + `guardState()` แบบ throw
- [ ] Result page + gender toggle + Omikuji modal
- [ ] Loading animation
- [ ] BGM/SFX audio manager (stub ก่อน)
- [ ] ⚠ ลบปุ่มชั่วคราว "ดูหน้าผลลัพธ์ · สุ่ม" (`devRandomResult()` + `.dev-shortcut`) ก่อน production
- [ ] Share to Story (html2canvas)
- [x] เขียน `questions.js` ใหม่ตาม DATA_SCHEMA §4 (ข้อความภาษาไทย 11 ข้อ + lead/afterArrange/outro)
- [ ] แปลคำถามเป็น EN (ทีหลัง)
- [x] UI: pop-up Bento ก่อนลากอาหาร, หน้าบรรยาย lead/outro (ดีไซน์ชั่วคราว), progress 11 ขั้น
- [x] วาดหน้าตุ๊กตาไล่ฝน E7 (view-doll) — 2 ขั้น: วาดหน้า (ซูมหัว) → แต่งตัว (ของแต่ง 4 หมวด, undo)
- [ ] รูปของแต่งตุ๊กตาจริง (ตอนนี้ emoji placeholder) — `assets/ui/doll/acc_{section}_{n}.png`
- [x] ชั้นวาง Bento: แถบเลื่อน + ลูกกลิ้งเมาส์เลื่อนข้าง (PC) + ปุ่ม Undo
- [x] E4 ห้องต้องห้าม: ช้อยซ่อนหลังประตูบานเลื่อน (Split Reveal) · ภาพประตู CSS ชั่วคราว
- [ ] รูปประตูบานเลื่อนจริง (E4)
- [ ] รูปตุ๊กตาไล่ฝนประจำ Yokai (`assets/ui/doll/{name}_teru.png`) — มีแล้ว 11 · ยังขาด Tenjin Ryuu Jorogumo Raijin Fuujin
- [x] BG เมฆ `assets/ui/quiz/cloud_bg.png` ทุกอีเวนต์คำถาม (E3 เลิกใช้ภาพโคมไฟ เหลือแค่ glass)
- [ ] การ์ดช้อยยังไม่มีรูป
- [x] หน้า result ใหม่ (2026-10-27): บับเบิ้ลแตะคุย + การ์ดปัด 3 ใบ + คู่ที่เกือบได้บอกเหตุผล + ตุ๊กตาแปะ · เลิกบทพูดหลัง loading (memory/near)
- [x] บับเบิ้ล `lines` ครบ 16 ตัว (8 ตัวหลัง Yumekui Ryuu Shinigami Tanuki Ningyo Jorogumo Hebi Raijin อนุมัติ 2026-10-27)
- [x] การ์ด 縁 `why`/`whyLead` + 共 `life` ครบ 16 ตัว · การ์ด 心 `HOUSE_HEART` ครบ 4 บ้าน (2026-10-27)
