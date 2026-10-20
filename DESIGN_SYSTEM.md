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

  /* Doll ink — สีฟิกซ์ของหน้าวาดตุ๊กตา (มาจากสีบ้าน green/yellow ที่ใช้อยู่ในหน้า result) */
  --ink-green:          #2D7A4F;
  --ink-gold:           #B58A00;

  /* Narration text — น้ำตาลนุ่ม แทนดำ (ดำโดดเกินบนแถบขาว) */
  --ink-brown:          #6B4A35;

  /* Rain dusk — ท้องฟ้าฝนอึมครึมสีเทาน้ำเงิน (ฉากตุ๊กตา E7: intro card + reveal) */
  --rain-dusk:          #5B6B7A;
  --rain-dusk-deep:     #3B4856;
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

### Narration Overlay (`.narration`) — บทเชื่อมฉาก
- ใช้กับ `lead` / `afterArrange` / `outro` ใน `questions.js` (1 string = 1 หน้า)
- Full-screen fixed, `--bg` ทึบ (ไม่ให้เห็นคำถามข้างหลัง), กว้างไม่เกิน `--max-w`
- ข้อความ: `--font-body`, 0.98rem, line-height 1.95, กึ่งกลาง · มี `.frost-band` (แถบขาวเบลอหลังตัวอักษร แบบเดียวกับการ์ด Bento) ให้อ่านง่าย
- **ขึ้นทีละบรรทัด** (1 บรรทัดใน string = 1 แตะ) บรรทัดก่อนหน้าค้างไว้บนจอ
- บรรทัดบรรยาย: สี `--ink-brown`, typewriter ทีละ grapheme (สระ/วรรณยุกต์ไทยไม่หลุด)
- ตัวเลือกตอบของผู้เล่น (`{ reply: [...] }`): ปุ่มแบบ Choice (`--surface-lowest`, ghost border, 1.5rem, ◆ สี `--primary`) ข้อความไม่มี `"` · เข้าแบบ Row Expand (scaleY 0.08→1 จากขอบบน + opacity, 720ms easeOutBack, ห่างกันทีละ 65ms) — หน้าหยุดรอจนเลือก, แตะพื้นหลังไม่มีผล · เลือกแล้วระบบครอบ `"…"` ให้ กลายเป็นบรรทัดบทพูดสี `--primary` (`.narration-line--player`) · ไม่มีผลคะแนน
- บรรทัดบทพูด (ขึ้นต้นด้วย `"`): `.narration-line--speech` ตัวหนา `--secondary` 1.04rem ค่อยๆ เฟดขึ้น 1.1s (opacity + blur + เลื่อนขึ้น)
- บรรทัดสะเทือนใจ (`{ slow: [...] }`): `.narration-line--slow` — เงียบ 0.7s แล้วแต่ละวลี (`.narration-phrase`) ลอยขึ้นจากเบลอ 2s ห่างกัน 1.7s เองโดยไม่ต้องแตะ · จบแล้วข้อความอยู่นิ่ง (ไม่ re-render) · วลีเดียวก็ได้ = ค่อยๆ โผล่ทั้งบรรทัดในจังหวะเดียว · `breath: true` = แต่ละวลีขึ้นบรรทัดใหม่ เว้นช่อง 14px (`.narration-line--breath`)
- ไหลต่อเอง (ไม่ต้องแตะ): บรรทัดที่ผู้เล่นเลือก และ `{ say, auto: true }` — ขึ้นครบแล้วเว้น 0.65s ขึ้นบรรทัดถัดไปเอง (แตะระหว่างนั้น = ไปต่อทันที) · ถ้าขึ้นต้นด้วย `"` ใช้สไตล์บทพูดด้วย
- แตะระหว่างกำลังขึ้น = แสดงครบทันที · แตะเมื่อครบ = บรรทัดถัดไป / หน้าถัดไป / ปิด
- "— tap to continue —" (`--font-kanji`) โผล่หลังพิมพ์จบ
- สถานะ: ดีไซน์ชั่วคราว รอเจ้าของเคาะ

### Quiz BG (`#view-quiz`)
- ทุกอีเวนต์คำถาม E1–E10 (Stage 1+2): ภาพเมฆญี่ปุ่นบนลาย asanoha `assets/ui/quiz/cloud_bg.png` (`cover`, ทับบน `--bg`) · Bento ใช้ BG ของตัวเอง
- `.quiz-next-wrap` พื้นใส (ไม่มี gradient `--bg` ทับภาพ)

### Glass Scene (`#view-quiz.quiz-glass-scene`)
- E3 ฟ้าผ่าเท่านั้น: story box / choice แบบ glass + black overlay fade-in (BG เมฆเหมือนข้ออื่น)

### Scene Intro Card (`.scene-intro`) — ใช้ร่วม Bento + Doll
- แถบขาวหลังชื่อฉากคือ `.frost-band` (class ใช้ร่วมกับ narration)
- การ์ดเต็มจอ glass (`--bg` 72% + blur) · ชื่อฉาก `--font-display` 2rem + ตรา sakura-stamp (เปลี่ยน emoji/คันจิได้) + "— tap to continue —"
- แตะ → white flash (`dismissSceneIntro`) → เผยเนื้อหาหลัก
- Bento: "Time to prepare some bento." 🌸桜 · Doll: "The rain keeps coming… Let's make a teru teru bōzu." ☔雨
- `.scene-intro--rain`: พื้น gradient `--rain-dusk-deep` → `--rain-dusk`, ตัวอักษร `--bg` ทึบ 100% + text-shadow อ่อน (การ์ดปกติจาง 55%)

### Doll Drawing (`view-doll`) — E7 ตุ๊กตาไล่ฝน
- เริ่มด้วย Scene Intro Card ก่อนเข้าหน้าวาด
- ทั้งฉากใช้พื้น `--rain-dusk` (หัว/คำแนะนำเป็น `--bg`) · reveal เข้มลงเป็น `--rain-dusk-deep`
- glow ห่อทั้งตัว (`.doll-figure` = ตัว + หน้า) ค่อยๆ ขึ้นหลัง Done (2s, delay 1.2s) — ห้าม glow แยกชั้น/ขึ้นทันที
- กด Done → reveal (~6s): UI อื่นจางออก 0.8s → ตุ๊กตาเลื่อนเข้ากลางจอ + scale 1.18 → พื้นหลังเป็นเทาน้ำเงิน `--rain-dusk-deep` (คืนฝนอึมครึม — ไม่ใช่ดำล้วน) + ตุ๊กตาเรืองนวล → วงคลื่นฝน `assets/ui/fx/rain_ripples_glow.webp` เฟดขึ้นใต้ตุ๊กตา (ไม่บีบภาพ, เล่นครบ 1 รอบ 4s) → black curtain → ฉากถัดไป
- วงคลื่นเป็นเส้นขาวเรืองแสง — ใช้ได้เฉพาะบนพื้นเข้ม · วางให้จุดกลางอยู่ราวชายกระโปรงตุ๊กตา (`top: 28%`, เลื่อนขวาเล็กน้อยเพราะต้นฉบับเอียงซ้าย)
- ตัวตุ๊กตา `assets/ui/doll/teru_body.png` + `<canvas>` 1000×1000 ซ้อนทับ แสดงกว้าง ~280px
- ระบายได้เฉพาะพิกเซลสีหน้า (mask จาก PNG) — ไม่เลอะคอเสื้อ/เส้นขอบ · `touch-action: none`
- สีฟิกซ์ 6 สี: `--on-surface`, `--primary`, `--primary-container`, `--secondary`, `--ink-green`, `--ink-gold` + ปุ่มวงล้อสี (เปิด glass panel: วงล้อ hue×saturation + แถบความสว่าง)
- ความหนา 3 ระดับ · Undo · Clear · ปุ่ม Done (`.btn-gender-next`)
- Swatch: วงกลม 32px, เลือกแล้วมีวงแหวน `--on-surface`

### Cloud Backdrop (`assets/ui/quiz/cloud_bg.png`)
- ใช้ใน view-quiz และ view-result (ทั้งหน้า)
- Result: เมฆอยู่ที่ `.result-content` เท่านั้น (ใต้รูป Yokai) · ขอบบนไล่จาก `--bg` → โปร่งใส 180px · **ห้ามมีพื้นหลัง/fade ทับตัว Yokai** — house tint อยู่ข้างหลังรูป ไล่จางเป็น `--bg` ที่ขอบล่าง, `.result-content` ไม่ใช้ margin ติดลบทับรูป

### Result Quote Block (`.result-quote-block`) — Result page
- แสดงบทพูดเดียวกับที่ภูตพูดหลัง loading: บรรทัด A แล้วตามด้วย B 0–2 บรรทัด · 1 บรรทัด = `.result-quote` 1 ย่อหน้า ห่างกัน 14px · ข้อความครอบ `"…"` อัตโนมัติ
- Yokai ที่ยังไม่มี `memory` → ไม่แสดงกล่องนี้

### Gender Flip Card (`.gender-flip`) — Result page
- แทนปุ่ม pill เดิม · การ์ด 64×84px `position: absolute` มุมขวาบนของ `.result-content` (ระดับแถว house · MBTI) ชื่อ Yokai ยังอยู่กลาง
- หน้าการ์ด = **เพศที่โชว์อยู่ในหน้านั้น**: หน้า ♂ (`--secondary`) / หลัง ♀ (`--primary`) + label (Noto Serif JP) + "Tap to switch" (M PLUS, จาง 50%)
- พื้น `--surface-lowest`, ghost border, `--shadow-ambient`, มุมไม่เท่ากัน `1.1rem 0.8rem 0.8rem 0.8rem`
- กด → `rotateY(180deg)` 0.7s easeOutBack `cubic-bezier(0.34,1.56,0.64,1)` · `.is-flipped` = กำลังโชว์ female · ระหว่างหมุนกดซ้ำไม่ได้
- กดปุ๊บ **Blinds Transition** เริ่มพร้อมกัน (หน่วง 0.25s ให้เห็นการ์ดพลิกก่อน) · สลับเพศตอนมู่ลี่ปิดสนิท (หลังการ์ดหมุนจบ)

### Blinds Transition (`#blinds-curtain`) — สลับเพศหน้า result
- มู่ลี่ญี่ปุ่น (sudare) แนวนอน 12 แถบ ปิดเต็มคอลัมน์แอป (`max-width: var(--max-w)` กึ่งกลาง — บนคอมไม่ล้นออกนอกจอมือถือ) · แถบไล่สี `--primary` → `--primary` ผสม `--on-surface` 22% (แดงโทริอิ)
- แต่ละแถบ `scaleY(0→1)` จากขอบบน 0.35s `cubic-bezier(0.65,0,0.35,1)` ไล่ดีเลย์ 25ms/แถบ (บนลงล่าง ทั้งตอนปิดและเปิด) · ตอนปิดหน่วงเพิ่ม 0.25s
- ปิดสนิท (~0.9s หลังกด) → สลับเนื้อหา → ค้าง 150ms → เปิด

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
