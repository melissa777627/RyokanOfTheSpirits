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

  /* Accent orange — ส้มอิฐ สถานะที่ถูกเลือก: .choice-btn, .bento-choice-btn, .gender-card, .gender-img-btn */
  --accent-orange:      #D2691E;

  /* Wood + gold — หน้า result · ผสมจาก token ด้านบนด้วย color-mix ไม่มี hex ใหม่ */
  --wood-walnut:        color-mix(in srgb, var(--ink-brown) 62%, var(--on-surface));       /* ป้ายหัวข้อ, ขอบสวิตช์เพศ */
  --wood-cedar:         color-mix(in srgb, var(--ink-brown) 82%, var(--accent-orange));    /* กล่องเซียมซี */
  --wood-cedar-dark:    color-mix(in srgb, var(--ink-brown) 80%, var(--on-surface));       /* ลายไม้กล่องเซียมซี */
  --wood-hinoki:        color-mix(in srgb, var(--surface-lowest) 85%, var(--accent-orange)); /* ไม้อ่อน: รางสวิตช์เพศ, ไม้เซียมซี */
  --gold:               color-mix(in srgb, var(--accent-orange) 55%, var(--surface-lowest)); /* คันจิลงทองบนป้ายที่เลือก */
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
| Thai · Display/Accent | **Noto Serif Thai** | 400 / 700 | ตัวอักษรไทยใน `--font-display` + `--font-kanji` (แบบหมินโจ คู่กับ Noto Serif JP) |
| Thai · Body | **Sarabun** | 500 / 700 | ตัวอักษรไทยใน `--font-body` |

### Thai Line Breaking (`thai-break.js` + `thaiBreakable()`)
- **ข้อความไทยทุกจุดต้องเข้าจอผ่าน `thaiBreakable(text)`** — ห้ามใช้ `textContent =` / `${text}` ตรงๆ กับข้อความไทย (เบราว์เซอร์จะตัดตามพจนานุกรม ICU ทำให้คำฉีก เช่น "เรียว|กัง" "ชิ้น|หนึ่ง")
- ลำดับการตัด: (1) เว้นวรรคระหว่างวลี (2) วลี ≤ 14 ตัวอักษร (`PHRASE_KEEP`) ไม่ตัดเลย (3) วลียาวตัดได้เฉพาะระหว่างหน่วย = คำ ICU ที่รวมด้วย `KEEP` (คำห้ามแยก) + เครื่องหมายวรรคตอน แล้วรวมอีกรอบด้วย `NO_START` (ห้ามขึ้นต้นบรรทัด: ๆ หรอก ไหม ไป มา ฯลฯ) / `NO_END` (ห้ามจบบรรทัด: ไม่ จะ แต่ ใน กับ ที่ ฯลฯ)
- หน่วย = `<span class="th-unit">` (`white-space: nowrap`) คั่นด้วย `<wbr>` · คำในรายการ `NO_START` ที่อยู่โดดๆ หลังเว้นวรรค (เช่น " หรอก") ติดไปกับหน่วยก่อนหน้าทั้งเว้นวรรค ไม่ขึ้นต้นบรรทัดใหม่ · **ห้ามใช้ `text-wrap: pretty`** — Safari 26 จัดทุกบรรทัดใหม่ บรรทัดสั้นเหลือที่ว่างขวา ~30% (เจอบน iPhone 2026-10-27)
- `html, body { touch-action: manipulation }` — ปิดซูมจากการแตะสองครั้งบน iOS (คนกด Undo / Next รัวๆ) · ยังซูมด้วยสองนิ้วได้
- เพิ่มข้อความใหม่ → รันรายงานการตัดบรรทัดที่ 360px/480px แล้วเติม `KEEP` ตามจุดที่ฉีก (หน่วยไม่ควรยาวเกิน ~12 ตัว — การ์ดช้อยแคบ)
- ข้อแลก: การ์ดช้อยบางใบที่จอแคบสูงขึ้น 1 บรรทัด เพราะยกทั้งวลีแทนการตัดกลางคำ

> ฟอนต์ไทยต่อท้ายในตัวแปรฟอนต์ทั้ง 3 ตัว — อังกฤษ/ญี่ปุ่นยังใช้ฟอนต์เดิม เบราว์เซอร์ใช้ฟอนต์ไทยเฉพาะตัวอักษรไทย · ห้ามเขียนชื่อฟอนต์ตรงๆ ใน component ให้ใช้ตัวแปรเท่านั้น

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
| **Choice** | `--surface-lowest` | ghost (`--outline-variant`) | `1.5rem` | background → `--surface-low` · selected: ขอบ `--accent-orange` |
| **FAB** | `--primary` | none | `50%` | scale 1.05 — ใช้กับ BGM เท่านั้น (เซียมซีย้ายเป็นกล่องในหน้า: FAB ควรเป็น action หลักอันเดียว) |

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
- บรรทัดบรรยาย: สี `--ink-brown`, typewriter ทีละ grapheme (สระ/วรรณยุกต์ไทยไม่หลุด) · วางข้อความเต็มบรรทัดตั้งแต่เฟรมแรกด้วย `thaiBreakable(text, true)` (ทุก grapheme เป็น `.th-g`) แล้วเผยทีละตัวโดยถอด `.narration-unrevealed` (`visibility: hidden`) — บรรทัดไม่เลื่อนกึ่งกลาง ไม่ตัดคำใหม่ กล่องไม่กระเด้งระหว่างพิมพ์
- ตัวเลือกตอบของผู้เล่น (`{ reply: [...] }`): ปุ่มแบบ Choice (`--surface-lowest`, ghost border, 1.5rem, ◆ สี `--primary`) ข้อความไม่มี `"` · เข้าแบบ Row Expand (scaleY 0.08→1 จากขอบบน + opacity, 720ms easeOutBack, ห่างกันทีละ 65ms) — หน้าหยุดรอจนเลือก, แตะพื้นหลังไม่มีผล · เลือกแล้วระบบครอบ `"…"` ให้ กลายเป็นบรรทัดบทพูดสี `--primary` (`.narration-line--player`) · ไม่มีผลคะแนน
- บรรทัดบทพูด (ขึ้นต้นด้วย `"`): `.narration-line--speech` ตัวหนา `--secondary` 1.04rem ค่อยๆ เฟดขึ้น 1.1s (opacity + blur + เลื่อนขึ้น) · `\n` ในบรรทัดเดียวกัน (หน้าแบบ array) = ขึ้นบรรทัดใหม่ในแตะเดียว (`.narration-line { white-space: pre-line }`) เช่น "ภูตอย่างข้า…↵ไม่มีใคร…"
- บรรทัดสะเทือนใจ (`{ slow: [...] }`): `.narration-line--slow` — เงียบ 0.7s แล้วแต่ละวลี (`.narration-phrase`) ลอยขึ้นจากเบลอ 2s ห่างกัน 1.7s เองโดยไม่ต้องแตะ · จบแล้วข้อความอยู่นิ่ง (ไม่ re-render) · วลีเดียวก็ได้ = ค่อยๆ โผล่ทั้งบรรทัดในจังหวะเดียว · `breath: true` = แต่ละวลีขึ้นบรรทัดใหม่ เว้นช่อง 14px (`.narration-line--breath`)
- ไหลต่อเอง (ไม่ต้องแตะ): บรรทัดที่ผู้เล่นเลือก และ `{ say, auto: true }` — ขึ้นครบแล้วเว้น 0.65s ขึ้นบรรทัดถัดไปเอง (แตะระหว่างนั้น = ไปต่อทันที) · ถ้าขึ้นต้นด้วย `"` ใช้สไตล์บทพูดด้วย
- แตะระหว่างกำลังขึ้น = แสดงครบทันที · แตะเมื่อครบ = บรรทัดถัดไป / หน้าถัดไป / ปิด
- "— tap to continue —" (`--font-kanji`) โผล่หลังพิมพ์จบ
- สถานะ: ดีไซน์ชั่วคราว รอเจ้าของเคาะ

### Quiz BG (`#view-quiz`)
- ทุกอีเวนต์คำถาม E1–E10 (Stage 1+2): ภาพเมฆญี่ปุ่นบนลาย asanoha `assets/ui/quiz/cloud_bg.png` (`cover`, ทับบน `--bg`) · Bento ใช้ BG ของตัวเอง
- `.quiz-next-wrap` พื้นใส (ไม่มี gradient `--bg` ทับภาพ)

### Sliding Doors (`q.doors` — E4 ห้องต้องห้าม) — Split Reveal
- การ์ดช้อยทุกใบเริ่มหลังประตูบานเลื่อน fusuma 2 บาน (`.choice-doors` > `.choice-door--l/--r`) ชนกันกลางการ์ด
- **ไม่มีรูปช้อย** — การ์ดเป็นข้อความอย่างเดียว อยู่กลางการ์ด (`.quiz-choices--doors`, สูงอย่างน้อย 150px) · เหนือตารางมีบรรทัดบอกวิธีเล่น "— Tap each door to slide it open —" (`.quiz-doors-hint`: pill กระจกฝ้า `--surface-lowest` 88% + ตัวหนา `--on-surface` ให้อ่านออกบนพื้นเมฆ · เฟดขึ้นพร้อมช้อย ไม่ขึ้นก่อนคำถาม)
- ประตูแง้มออก ±10% แล้วปิดกลับ **ครั้งเดียว** ตอนการ์ดเพิ่งขึ้น (เริ่ม 2.3s ไล่ทีละบานห่าง 0.15s, `doorNudgeL/R`) — ใบ้ว่าเลื่อนได้ ไม่วนซ้ำ
- ประตูแต่ละบานมีกรอบไม้ `--ink-brown` 4px (inset box-shadow, มุมนอกโค้งตามการ์ด 18px) — สองบานชนกันเป็นเสากลางหนา · กรอบเลื่อนไปกับบานประตู
- แตะครั้งแรก = ประตูแยกออกซ้าย/ขวา (animation `doorOpenL/R` → `translateX(∓105%)`, 720ms easeInOutCubic — ใช้ animation ไม่ใช่ transition เพราะต้องแทนที่ลูปแง้ม และ `animationend` ของ `doorOpenL` คือสัญญาณ `.doors-ready`) เผยช้อย · แตะอีกครั้ง (หลังเปิดสุดแล้ว `.doors-ready`) = เลือก · แตะรัวระหว่างเลื่อน = แค่เปิด ไม่เลือก
- เปิดค้างได้หลายบาน · **Next กดได้เมื่อเปิดครบ 4 บาน + เลือกแล้ว** (ให้ผู้เล่นอ่านครบทุกช้อย ไม่เลือกบานแรกที่เปิด)
- ภาพประตูเป็น CSS ชั่วคราว: พื้น `--surface-low` + ลายตาราง shoji + ที่จับกลม (hikite) จาง `--on-surface` · รอรูปจริงจากเจ้าของ

### Glass Scene (`#view-quiz.quiz-glass-scene`)
- E3 ฟ้าผ่าเท่านั้น: story box / choice แบบ glass + black overlay fade-in (BG เมฆเหมือนข้ออื่น)

### Bento Arrange (`#view-bento`) — ชั้นวางของกิน + ลากลงกล่อง
- หน้าเบนโตะสูงเท่าจอ (`100dvh`, ไม่เลื่อน) · `.bento-main` มี `min-height: 0` ให้กล่องเบนโตะหดได้ — **ปุ่ม Continue ต้องอยู่ในจอเสมอ** (ทดสอบแล้วถึงจอสูง 467px)
- ของกินอยู่บน **Item Shelf** (ดูหัวข้อถัดไป) · ล่างสุด `.bento-next-wrap--split`: Undo (`.tool-btn`) ซ้าย · Continue ขวา — Undo เอาชิ้นล่าสุดออก, ไม่เหลือชิ้นไหน = Continue กดไม่ได้

### Item Shelf (`.item-shelf`) — ใช้ร่วม Bento (ของกิน) + Doll (ของแต่ง)
- ชั้นวางแนวนอน flex, `overflow-x: auto`, scroll-snap · ชิ้น `.shelf-item` 84px (`.shelf-item-img` + `.shelf-item-label` ถ้ามี) · ชิ้นถัดไปโผล่ครึ่งชิ้นที่ขอบขวาเป็นใบ้ว่าเลื่อนได้
- **แถบเลื่อนโชว์เสมอ** (PC ไม่มีการปัด): บาง 6px, ราง `--surface-low`, ตัวจับ `--primary` ขอบมน · ลูกกลิ้งเมาส์แนวตั้ง = เลื่อนชั้นไปด้านข้าง
- `.shelf-item { touch-action: pan-x }` — ปัดซ้าย/ขวา = เลื่อนชั้น, ขยับทางอื่น ≥ 6px = เริ่มลาก (ไม่สร้างภาพตามนิ้วตอนแค่แตะ)
- ระบบลาก (index.html "ITEM SHELF", `initItemShelf(cfg)`): ติดตั้งครั้งเดียวตอนโหลดต่อชั้นวาง · ลากได้ทีละนิ้ว · ภาพตามนิ้ว (`.shelf-drag-ghost`) อยู่ใน view ของชั้นนั้น ไม่ใช่ `body` · ทุกทางที่การลากจบผ่าน `end()` ที่เดียว
- ชิ้นที่กำลังถูกลากแค่จาง (`.shelf-item--lifted` opacity 0.18) — **ห้ามใส่ `pointer-events: none`** จะทำให้หลุดการจับนิ้ว (ภาพค้างจอ)
- ชิ้นที่ยังไม่มีรูป: `.shelf-item-glyph` (emoji กลางการ์ด) — placeholder เท่านั้น
- `.tool-btn` — ปุ่มเล็ก ghost border pill 36px สำหรับ Undo / Clear (Bento, Doll) · disabled จาง 0.35

### Scene Intro Card (`.scene-intro`) — ใช้ร่วม Bento + Doll
- แตะการ์ด → **Ripple Reveal** (`.tap-ripple`): วงคลื่นขยายจาก**จุดที่นิ้วแตะ**เสมอ (scale 0.2→2.2, 950ms easeOutCubic) + วงสะท้อนตามมา 110ms · **ไม่มีเส้นขอบ** — เป็นคลื่นน้ำใสๆ: เลนส์วงแหวนเบลอฉากข้างหลัง (`backdrop-filter: blur(4px)` + mask) + สันคลื่นสว่าง `--bg` ด้านใน + ท้องคลื่นจาง `--on-surface` ด้านนอก (`--trough` 20% การ์ดครีม / 10% การ์ดฝน) · 380ms หลังแตะ แสงขาววาบเริ่มทับ · แตะซ้ำระหว่างนั้นไม่มีผล (`.dismissing`) · ใช้เฉพาะการ์ดนี้ (ไม่ใช้กับบทบรรยาย — แตะบ่อยเกินจะรก)
- แถบขาวหลังชื่อฉากคือ `.frost-band` (class ใช้ร่วมกับ narration)
- การ์ดเต็มจอ glass (`--bg` 72% + blur) · ชื่อฉาก `--font-display` 2rem + ตรา sakura-stamp (เปลี่ยน emoji/คันจิได้) + "— tap to continue —"
- แตะ → white flash (`dismissSceneIntro`) → เผยเนื้อหาหลัก
- Bento: "Time to prepare some bento." 🌸桜 · Doll: "The rain keeps coming… Let's make a teru teru bōzu." ☔雨
- `.scene-intro--rain`: พื้น gradient `--rain-dusk-deep` → `--rain-dusk`, ตัวอักษร `--bg` ทึบ 100% + text-shadow อ่อน (การ์ดปกติจาง 55%)

### Doll Drawing (`view-doll`) — E7 ตุ๊กตาไล่ฝน
- เริ่มด้วย Scene Intro Card ก่อนเข้าหน้าวาด · ฉาก E7 ("คืนหนึ่งฝนตกไม่ยอมหยุด…") เล่นเป็น narration **ก่อน** การ์ดนี้/ก่อนคำถาม — ไม่มี story box ในหน้าตุ๊กตา
- **2 ขั้น** (`#view-doll.doll-dress` สลับ; `.doll-face-only` / `.doll-dress-only`):
  1. **วาดหน้า** — "— Draw its face —" · ซูมที่หัว `.doll-figure` scale 2 (origin 46.4% 27.2% = กลางหัว) ใน `.doll-frame` (กรอบตัดขอบ radius 1.5rem) · เครื่องมือวาด · ปุ่ม Next (กดได้เมื่อวาด ≥ 1 เส้น)
  2. **แต่งตัว** — "— Dress it up —" · ซูมออกเห็นทั้งตัว (transition 0.9s) · วาดต่อไม่ได้ · แท็บหมวด `.doll-tab` (pill, ตัวอักษร `--bg` · เลือกแล้ว = `--surface-lowest`) เหนือ Item Shelf · ลากของวางบนตัวตุ๊กตาตรงไหนก็ได้ · Undo ซ้าย / Done ขวา (Done กดได้เลยแม้ไม่แต่ง)
- ของที่วาง `.doll-placed-item` ขนาด 16cqw (สัดส่วนของกรอบ — `.doll-frame` เป็น container) ให้ภาพ export ตรงกับจอ
- ทั้งฉากใช้พื้น `--rain-dusk` (หัว/คำแนะนำเป็น `--bg`) · reveal เข้มลงเป็น `--rain-dusk-deep`
- glow ห่อทั้งตัว (`.doll-frame` = ตัว + หน้า + ของแต่ง) ค่อยๆ ขึ้นหลัง Done (2s, delay 1.2s) — ห้าม glow แยกชั้น/ขึ้นทันที
- กด Done → reveal (~6s): UI อื่นจางออก 0.8s → ตุ๊กตาเลื่อนเข้ากลางจอ + scale 1.18 → พื้นหลังเป็นเทาน้ำเงิน `--rain-dusk-deep` (คืนฝนอึมครึม — ไม่ใช่ดำล้วน) + ตุ๊กตาเรืองนวล → วงคลื่นฝน `assets/ui/fx/rain_ripples_glow.webp` เฟดขึ้นใต้ตุ๊กตา (ไม่บีบภาพ, เล่นครบ 1 รอบ 4s) → black curtain → ฉากถัดไป
- วงคลื่นเป็นเส้นขาวเรืองแสง — ใช้ได้เฉพาะบนพื้นเข้ม · วางให้จุดกลางอยู่ราวชายกระโปรงตุ๊กตา (`top: 28%`, เลื่อนขวาเล็กน้อยเพราะต้นฉบับเอียงซ้าย)
- ตัวตุ๊กตา `assets/ui/doll/teru_body.png` + `<canvas>` 1000×1000 ซ้อนทับ แสดงกว้าง ~280px
- ระบายได้เฉพาะพิกเซลสีหน้า (mask จาก PNG) — ไม่เลอะคอเสื้อ/เส้นขอบ · `touch-action: none`
- สีฟิกซ์ 6 สี: `--on-surface`, `--primary`, `--primary-container`, `--secondary`, `--ink-green`, `--ink-gold` + ปุ่มวงล้อสี (เปิด glass panel: วงล้อ hue×saturation + แถบความสว่าง)
- ความหนา 3 ระดับ · Undo · Clear (`.tool-btn`) · ปุ่ม Next (`.btn-gender-next`)
- Swatch: วงกลม 32px, เลือกแล้วมีวงแหวน `--on-surface`

### Cloud Backdrop (`assets/ui/quiz/cloud_bg.png`)
- ใช้ใน view-quiz และ view-result (ทั้งหน้า)
- Result: เมฆอยู่ที่ `.result-wrap` ทั้งหน้า · `.result-hero` ไล่ house tint (`--house-tint`) → `--bg` 70% → โปร่งใส ทับบนเมฆ

### Result Page (`view-result`) — โครง (ย้ายจาก lab V30 · 2026-11-03)
- ไม่มีบทพูดหลัง loading · หน้านี้ **ไม่มี emoji** (อาร์ตยังไม่มา = kanji `--font-kanji` 5rem `--ink-brown` 60%)
- **Hero:** eyebrow "เนื้อคู่ของคุณคือ" → ชื่อ Kaisei 2.5rem → `kanji · title` → แท็กเป็นคำธรรมดา (บทบาทบ้าน | MBTI แดง คั่นเส้นบาง ไม่ใช่ pill) → รูปสูง 300px (แตะได้) · บับเบิ้ลขวาบน · สวิตช์เพศซ้ายล่างของภูต
- **ป้ายหัวข้อ (`.result-tabs`)** — แผ่นไม้วอลนัท (`--wood-walnut`) 3 ป้ายแขวนบนราวไม้ แถวเดียว สูง 40px · คันจิข้างคำ (ใจของคุณ / ทำไมเป็นเขา / ถ้าอยู่ด้วยกัน) · ขอบล่างเป็นเปลือกไม้ (live edge, `--tag-shape`) · เห็นความหนาไม้ 3px · ป้ายที่ไม่ได้เลือกหรี่ (brightness 0.82)
  - ป้ายที่เลือก: หย่อนลงตามเชือก 9px + แกว่ง 1s · เชือกเป็นแดง · คันจิลงทอง (`--gold` เรืองนิดๆ) · เปลี่ยนหัวข้อ = ลมพัดผ่านป้ายอื่นทีละอัน (110ms/ป้าย)
  - แตะป้าย = ไปการ์ดนั้น · ปัดการ์ด = ป้ายตาม · ครั้งแรกที่เลื่อนมาเห็น deck ขยับไปทางขวา 64px แล้วกลับ (บอกว่าปัดได้)
- **การ์ด (`.result-deck`)** — ทีละใบเต็มความกว้าง (scroll-snap) · deck สูงเท่าการ์ดที่อยู่บนจอ (ไม่มีที่ว่างใต้การ์ดสั้น)
  - กระดาษวาชิ: ครีม + เส้นใยจางๆ · `--shadow-float` · ตราแดงสี่เหลี่ยมเอียง -5° · คันจิลายน้ำใหญ่จางมุมขวาล่าง (`--primary` 7%) · การ์ด 心 ไม่แดงแล้ว — ทุกใบเป็นกระดาษเหมือนกัน
  - **หน้าการ์ด = ใจความหลักอย่างเดียว** (hook / lead Kaisei 1.22rem) แบบผลเกมทายใจ · คู่ "คุณจะได้ / อาจกระทบกัน", เนื้อความขยาย, คำชวน "{Yokai} จะชวนให้คุณลอง…" อยู่หลัง "อ่านต่อ" ทั้งหมด · ส่วนกางมีรอยพับ (เส้นจาง) คั่น
  - ท้ายการ์ด (`.result-card-foot`): ซ้าย "อ่านต่อ ▾" / "ย่อ ▴" = กระดาษครีมเรียบ **ไม่มีเงา** มีชายพับจางๆ ใต้ขอบ กางแล้วชายพับพลิกขึ้น (คงคำไว้ — รูปมุมพับเดี่ยวๆ คนอ่านเป็น "คั่นหน้า") · ขวา "ถัดไป {ตรา} {หัวข้อ} ›" จาง 62% (ใบสุดท้าย = "‹ กลับไปอ่านใบแรก")
  - แตะการ์ดที่อยู่บนจอ = กาง/หุบ · ปัดออก = หุบเอง
- **แถวสองคอลัมน์:** 似 เหมือนกันตรงไหน (ชื่อแถว = วิธีคิดของ Yokai `ALIKE_LABEL[fn]` · ขีด ●●○ = ผู้เล่นเลือกช้อยแบบเดียวกันกี่ใน 3 ข้อ · 3 ทุกข้อ ✦ / 2 ส่วนใหญ่ = `.result-tone--good` · 1 มีบ้าง = `--mid` · **การ์ดนี้ไม่มีแดง** — function ตรงกัน 0 ข้อ → แถวนั้นโชว์ขั้วแทน · คำกับขีดใช้สีเดียวกัน · คำยาวตกลงใต้ขีดได้) | 相 ความเข้ากัน — "เข้ากันดีเรื่อง" (`--font-kanji` 0.68rem `.result-tone--good`) + 2 คำแบบข้อความธรรมดา นำหน้าด้วย ・ส้ม (ไม่ใช่ชิป/pill · ห้ามสีเขียว) · "ต้องค่อยๆ ปรับ" (`.result-tone--low`) + ประโยคเต็ม 0.8rem
- **คู่ที่เกือบได้ (`.result-near`)** — แบนเนอร์แนวนอน: หน้าต่างรูปซ้าย 32% (สี่เหลี่ยมจัตุรัส เห็นทั้งหัว ซูม 112% — เล็กกว่าเนื้อคู่ตัวจริงเสมอ) · ขวา = ชื่อ, "อีกมุมหนึ่งของคุณ {มุม} ก็เข้ากับ X ได้ดีเหมือนกัน", คำพูดของ X (`almost`) · ไม่มีใครเฉียด = "ใจคุณชัดเจนมาก มีแค่ {Yokai} คนเดียวที่ใช่" เต็มการ์ด
  - **กระจกฝ้า (`.result-fog`, canvas):** ฝ้าครีมไม่สม่ำเสมอ + หยดน้ำ · ถูด้วยนิ้ว = เช็ด (หน้าไม่เลื่อนระหว่างถู) · เช็ดเกินครึ่ง = ฝ้าหายทั้งแผ่น รูปชัด (ไม่เบลอ) · **ไม่มีคำบนกระจก** — ใช้มือ gesture-swipe (Tabler, `--primary`) โบกกลางกระจกแทน · เลื่อนมาเห็นครั้งแรก มือถูไปมาให้ดู (แปรงเล็ก ฝ้าแค่บางลง หน้ายังไม่โผล่) แล้วฝ้าค่อยๆ กลับมา · สาธิตสูงสุด 2 ครั้ง ห่าง 7 วิ · คีย์บอร์ด: Enter/Space = เปิด · สลับเพศแล้วยังใสอยู่
- **ตุ๊กตา + กล่องเซียมซี (`.result-dolls-row`):** ตุ๊กตาสองตัวยืนคู่กัน (ของผู้เล่นซ้ายสูงกว่านิด อยู่หน้า · ของภูตขวาต่ำกว่า · เอียงสวน ±4° · เส้นสั่น `#doll-boil`) · กล่องเซียมซีไม้ซีดาร์ (`--wood-cedar`) ป้ายแดง 御籤 + "เขย่าเซียมซี" ห่างตุ๊กตา 26px · เขย่าเองเป็นระยะ · แตะ = เขย่า 2 ที ไม้เซียมซีเด้งออก แล้วเปิดใบเซียมซี
- **ปุ่มท้าย (`.result-actions`):** แชร์นำ (ปุ่มหลัก) · เล่นอีกครั้งเล็กใต้ลงมา
  - **แชร์ (`.result-share`) = ซองจดหมายกระดาษครีม** มุมมน ฝาซ้ายปลายมน ปิดด้วยตราซากุระแดง · แสตมป์ขอบหยักมุมขวาบนเขียนคันจิของภูต (แนวตั้ง 1–4 ตัว) · ไอคอนแชร์ + "แชร์ผลให้เพื่อน" · กระโดดดึ๋งทุก 6 วิ · แตะ/ชี้ = ฝาแง้ม ตราเด้งหมุน หัวใจลอยออก
  - **เล่นอีกครั้ง (`.result-again`) = กระดาษพับใบเล็ก** รอยพับกลาง เอียง 1.5° ลูกศร ↺ แดง · แตะครั้งแรก = "แตะอีกครั้ง ผลนี้จะหายไป" (แดง) 3 วิ · แตะซ้ำ = เริ่มใหม่
- `prefers-reduced-motion`: ไม่มีเด้ง/แกว่ง/ลอย/สาธิตถู ไม่มีซากุระ · ใบเซียมซีโชว์ด้านคำทำนายทันที

### Talk Bubble (`.result-say`) — Result page
- ภูตทักเอง 0.9 วิหลังเข้าหน้า (`lines.greet` ครั้งเดียวต่อผลลัพธ์ — สลับเพศไม่ทักซ้ำ) · ก่อนพูด = ▼ เล็กกระพริบ (สัญลักษณ์ "มีต่อ" แบบกล่องข้อความเกม/VN)
- แตะ (บับเบิ้ลหรือตัวละคร) = ประโยคถัดไปเด้งขึ้น (0.18s) · **ประโยคค้างอยู่** ไม่หุบ · ▼ กระพริบต่อท้ายคำสุดท้าย 0.45 วิหลังเด้ง · รอแตะ = เด้งกระโดดเป็นระยะ (3.2s)
- ทิ้งไว้ 15 วิ (ตอนบับเบิ้ลอยู่บนจอ) = พูดประโยคคุยเอง (chat1/chat2 เท่านั้น — poke เป็นปฏิกิริยาต่อการจิ้ม)
- กล่องพอดีข้อความ: วัดบรรทัดที่กว้างสุดแล้วตั้งความกว้างตามนั้น (ไม่เหลือช่องว่างขวา) · วัดซ้ำหลังฟอนต์โหลด
- พื้น `--bg` 32% + blur 3px · ขอบ `--accent-orange` 85% 1.5px · ฮาโลครีม · มุมล่างซ้าย 0.3rem ชี้หัว · Kaisei 0.88rem `--ink-brown` + แสงครีมรอบตัวอักษร
- จุดยึด left 54% / **top 8px** (ห้อยลงจากบนเวที — ประโยคยาวยืดลงล่าง ไม่ขึ้นไปทับแถวบทบาท/MBTI) · กว้างสุด 44%

### Chapter Intro (`#chapter-intro`) — ตัวคั่นบท
- ขึ้น 2 ที่: หลังเลือกเพศ (CHAPTER 01 · คืนพายุ) และหลังตอบ E5 (CHAPTER 02 · แขกในหมอก) · ข้อมูลจาก `QUESTIONS.chapters` · ไม่ใช้ภาษาญี่ปุ่น
- พื้น `--on-surface` เต็มคอลัมน์แอป (`max-width: var(--max-w)`) · z-index 940 (ใต้ narration 950 — บทบรรยายถัดไปจางขึ้นทับ แล้วพื้นมืดค่อยจางออกข้างใต้ หน่วง 0.45s จะได้ไม่เห็นหน้าข้างหลังแว้บ)
- 3 ชั้น ไม่มี scale: ป้าย `CHAPTER 01` (Noto Serif JP, `--bg` 60%, เลข `--primary-container`) → เส้น `--primary` 144px + ข้าวหลามตัด 5px ที่ปลาย → ชื่อบท Kaisei Decol 2rem `--bg` โผล่จากใต้เส้น (mask)
- เวลา 2800ms: ป้าย 0.30–0.80s (easeOutCubic, ลอยขึ้น 6px) · เส้น 0.62–1.12s (easeInOutCubic) · ชื่อ 0.95–1.55s (easeOutExpo) · ค้าง · จาง 2.30–2.60s (easeInCubic) — อ้างอิง motion-reference "チャプター導入"
- แตะเพื่อข้าม · `prefers-reduced-motion` = โชว์เฟรมสุดท้ายนิ่งๆ แล้วไปต่อเองตามเวลา

### Gender Switch (`.result-gender`) — Result page
- สวิตช์ไม้เลื่อน 84×38px มุม**ซ้ายล่าง**ของภูต (left 16px · bottom 10px) · ♂ ซ้าย / ♀ ขวา
- รางไม้ฮิโนกิครีม (`--wood-hinoki`) ขอบวอลนัท 3px (`--wood-walnut`) · ปุ่มแดง (`--primary`) 34×30 มีวงวอลนัท 4px เป็นของตัวปุ่ม (เท่ากันทุกด้าน ชนขอบนอกพอดี เลื่อน/ขยับไปพร้อมปุ่ม) · สัญลักษณ์ที่เลือก = `--bg` · อีกฝั่ง `--ink-brown` 55%
- ปุ่มแดงขยับไปทางอีกฝั่ง 7px ทุก 5 วิ (บอกว่าเลื่อนได้) · แตะ = ปุ่มเลื่อนข้าม 42px (0.35s easeOutBack) แล้ว 0.38 วิ ต่อด้วย Blinds Transition
- aria-label = "สลับเป็นเวอร์ชัน{อีกเพศ}"

### Blinds Transition (`#blinds-curtain`) — สลับเพศหน้า result
- มู่ลี่ญี่ปุ่น (sudare) แนวนอน 12 แถบ ปิดเต็มคอลัมน์แอป (`max-width: var(--max-w)` กึ่งกลาง — บนคอมไม่ล้นออกนอกจอมือถือ) · แถบไล่สี `--primary` → `--primary` ผสม `--on-surface` 22% (แดงโทริอิ)
- แต่ละแถบ `scaleY(0→1)` จากขอบบน 0.35s `cubic-bezier(0.65,0,0.35,1)` ไล่ดีเลย์ 25ms/แถบ (บนลงล่าง ทั้งตอนปิดและเปิด) · ตอนปิดหน่วงเพิ่ม 0.25s (ให้เห็นสวิตช์เลื่อนก่อน)
- ปิดสนิท (~0.9s หลังกด) → สลับเนื้อหา → ค้าง 150ms → เปิด

### Omikuji Slip (`.kuji-modal`) — Result page
- พื้นกระจก: `--on-surface` 45% + blur 20px · ใบเซียมซีแบบ V6: กระดาษครีม 300×360 มุม 1.2rem กรอบพิมพ์ด้านในแดงจาง · แถบแดงแนวตั้งขวา (หน้า: 御神籤 第○番 สุ่ม · หลัง: 恋愛運)
- เปิด = ใบเลื่อนขึ้นจากล่าง (ดึงออกจากกล่อง) 0.55s easeOutBack
- **หน้า:** "ตอนนี้คุณโสดอยู่ไหม" (Kaisei) + 2 ปุ่ม "โสดอยู่" / "มีคนข้างกายแล้ว" · **หลัง:** อันดับ (大吉…凶 Kaisei 3.6rem แดง · 凶 = `--ink-brown`) + คำไทย + เส้นคั่น + คำทำนาย
- เลือกแล้วพลิก ตาม motion-reference "Reward Card Reveal": ยก 14px + ขยาย 6% (0–0.3s) → พลิก 180° สลับหน้าที่ 90° (0.35–0.85s) → วางลง · เงาใต้ใบหดตอนลอย · ข้อความ "ผูกไว้กับกิ่งสน…" ขึ้นใต้ใบหลังพลิกเสร็จ (1.25s)
- ปิด: ✕ มุมซ้ายบน / แตะนอกใบ / Esc · โฟกัสกลับกล่องเซียมซี

### Toast (`.toast`)
- ข้อความสั้นลอยเหนือขอบล่าง 24px · `--on-surface` 85% ตัวอักษร `--bg` pill · หาย 2.2 วิ (ใช้กับผลการแชร์)

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
