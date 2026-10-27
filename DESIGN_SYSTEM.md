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

### Result Page (`view-result`) — โครง
- ไม่มีบทพูดหลัง loading แล้ว · หน้านี้ **ไม่มี emoji** (อาร์ตยังไม่มา = kanji `--font-kanji` 5rem `--ink-brown` 60%)
- **Hero:** eyebrow "เนื้อคู่ของคุณคือ" → ชื่อ Kaisei 2.5rem → `kanji · title` → แท็ก pill (บทบาทบ้าน + MBTI แดง) → รูปสูง 300px (แตะได้) · gender flip มุมขวาบน
- **การ์ดปัด (`.result-deck`)** — scroll-snap แนวนอน การ์ดกว้าง 86% ให้ใบถัดไปโผล่ · การ์ดสูงเท่ากัน · จุดบอกหน้า (ใบปัจจุบันยืดเป็นแถบแดง 18px) · แตะใบที่โผล่ = เลื่อนไปใบนั้น · ไม่มีพรีวิวเลื่อนตอนเปิดหน้า
  - ลำดับเล่าเรื่อง: 心 "ใจของคุณเป็นแบบไหน?" (แดง) → 縁 "ทำไมถึงต้องเป็นเขา?" → 共 "ถ้าหากได้ใช้ชีวิตร่วมกัน…"
  - หน้าการ์ด = ประโยคเต็มแบบเล่า (`.result-card-lead` Kaisei 0.92rem · การ์ด 縁 ใช้ Sarabun ตามที่เจ้าของขอ) · หัวการ์ดปัด 1rem ตัวหนา — ใหญ่กว่าเนื้อความเสมอ หรือประโยคเด็ด (`.result-card-hook` 1.32rem) · ไม่ตัดเป็นวลีสั้นติดป้าย (เจ้าของ: ยิ่งสั้นยิ่งแข็ง)
  - `.result-card-invite` (การ์ด 心): "{Yokai} จะชวนให้คุณลอง…" ตัวหนา แล้วข้อความต่อ · `.result-card-pairs` (การ์ด 共): dt/dd "คุณจะได้" / "อาจกระทบกัน" ในกล่อง `--surface-low`
  - อ่านต่อ: ปุ่มกลม 32px ลูกศร ⌄ กลางล่างการ์ด ลอยขึ้นลงแบบ "…" ของบับเบิ้ล · แตะ = การ์ดยืดในตัว (grid-rows 0fr→1fr 0.4s) แล้วข้อความจางเข้า · ส่วนกาง = **ขยายความ ห้ามซ้ำหน้าการ์ด** · ปัดออก = หุบเอง
- **แถวสองคอลัมน์:** 似 เหมือนกันตรงไหน (ชื่อแถว = วิธีคิดของ Yokai `ALIKE_LABEL[fn]` · ขีด ●●○ = ผู้เล่นเลือกช้อยแบบเดียวกันกี่ใน 3 ข้อ · 3 ทุกข้อ ✦ / 2 ส่วนใหญ่ = `.result-tone--good` · 1 มีบ้าง = `--mid` · **การ์ดนี้ไม่มีแดง** (ได้เนื้อคู่แล้วต้องรู้สึกดี) — function ตรงกัน 0 ข้อ → แถวนั้นโชว์ขั้วแทน (ALIKE_LABEL E/I/J/P/T/F ≥2 ข้อเสมอ) · คำกับขีดใช้สีเดียวกัน (currentColor) · คำยาวตกลงใต้ขีดได้) | 相 ความเข้ากัน — "เข้ากันดีเรื่อง" (ป้ายเล็ก `--font-kanji` 0.68rem `.result-tone--good`) + 2 ชิป `.result-match-chip` (ป้ายครีม `--surface-low` + ghost frame `--outline-variant` ตัวอักษร `--ink-brown` — ห้ามชิปสีเขียว เจ้าของบอกดูเหมือน AI) · "ต้องค่อยๆ ปรับ" (`.result-tone--low`) + ประโยคเต็ม 0.8rem · ไม่มีตัวเลข/คำประเมิน
- **คู่ที่เกือบได้ + ตุ๊กตา:** การ์ด 岐 (รูปโคลสอัพหน้า — `.result-near-portrait` 1.4:1 ซูมรูปสี่เหลี่ยมจัตุรัส 150% โฟกัสหัวที่ (50%, 37%) ใช้ร่วมทุกตัว + หมอก `.result-near-mist` ม่าน `--bg` 30% ทั้งภาพ + ก้อนหมอกสองชั้นลอยซ้าย-ขวา 16s/21s หนาที่ขอบ/ล่าง · รูปหม่น saturate 0.7 + blur 0.6px ให้ไม่เด่นกว่าเนื้อคู่ตัวจริง · reduced-motion = นิ่ง · kanji fallback ไม่ซูม, ชื่อ, "อีกมุมหนึ่งของคุณ {มุม} ก็เข้ากับ X ได้ดีเหมือนกัน" + คำพูดของ X เอง (`almost`, Kaisei 0.78rem `--ink-brown` กล่อง `--surface-low`) — ชมว่ามีหลายด้าน ห้ามพูดแบบ "ตอบผิดไปข้อเดียว"/"แทน") ข้างๆ เป็นตุ๊กตาสองตัวยืนคู่กันชิดๆ ที่มุมขวาล่าง (ฐานเดียวกับการ์ด) — ของผู้เล่นซ้ายสูงกว่านิด อยู่หน้า · ของภูตขวาต่ำกว่านิด · เอียงสวน ±4° **ไม่มีกล่องรอง/เทป/หัวข้อ/ป้าย** · เงา drop-shadow นุ่ม · เส้นสั่นแบบวาดมือ (`#doll-boil`: feTurbulence 0.031 + feDisplacementMap 4.5, เปลี่ยน seed 7 FPS วน 6 ค่า) ทั้งสองตัว · reduced-motion = นิ่ง · ไม่มีใครเฉียด = "ใจคุณชัดเจนมาก มีแค่ {Yokai} คนเดียวที่ใช่"
- **ปุ่มท้าย:** 2 pill เท่ากัน (`.result-action`) — 御籤 เสี่ยงเซียมซี · เล่นอีกครั้ง ↺
- `prefers-reduced-motion`: ไม่มีเด้ง/ลอย/ยืด และไม่มีซากุระ

### Talk Bubble (`.result-say`) — Result page
- แบบล็อบบี้เกมกาชา: ไม่แตะ = "…" เล็กลอยขึ้นลงที่มุมขวาบนของหัว · แตะ (บับเบิ้ลหรือตัวละคร) = ประโยคเต็มเด้งขึ้นทั้งบรรทัด (0.18s) ขยายขึ้นขวา **ไม่บังหน้า** · ค้าง 1400ms + 70ms/ตัว แล้วจางกลับเป็น "…" · ตัวละครเด้งนุ่ม (scale 1.015/0.985, เอียง ±1.5°)
- พื้น `--bg` 32% + blur 3px · ขอบ `--accent-orange` 85% 1.5px · ฮาโลครีมฟุ้งนอกขอบ · มุมล่างซ้าย 0.3rem ชี้หัว · ตัวอักษร Kaisei 0.88rem `--ink-brown` + แสงครีมรอบตัวอักษร (อ่านได้บนผมสีเข้ม)
- จุดยึดบับเบิ้ล left 64% / bottom 84% ตำแหน่งเดียวทุกตัว (ยึดตาม Tengu ♂ — เจ้าของขอ 2026-10-27) · ไม่มีค่าแยกรายรูป

### Chapter Intro (`#chapter-intro`) — ตัวคั่นบท
- ขึ้น 2 ที่: หลังเลือกเพศ (CHAPTER 01 · คืนพายุ) และหลังตอบ E5 (CHAPTER 02 · แขกในหมอก) · ข้อมูลจาก `QUESTIONS.chapters` · ไม่ใช้ภาษาญี่ปุ่น
- พื้น `--on-surface` เต็มคอลัมน์แอป (`max-width: var(--max-w)`) · z-index 940 (ใต้ narration 950 — บทบรรยายถัดไปจางขึ้นทับ แล้วพื้นมืดค่อยจางออกข้างใต้ หน่วง 0.45s จะได้ไม่เห็นหน้าข้างหลังแว้บ)
- 3 ชั้น ไม่มี scale: ป้าย `CHAPTER 01` (Noto Serif JP, `--bg` 60%, เลข `--primary-container`) → เส้น `--primary` 144px + ข้าวหลามตัด 5px ที่ปลาย → ชื่อบท Kaisei Decol 2rem `--bg` โผล่จากใต้เส้น (mask)
- เวลา 2800ms: ป้าย 0.30–0.80s (easeOutCubic, ลอยขึ้น 6px) · เส้น 0.62–1.12s (easeInOutCubic) · ชื่อ 0.95–1.55s (easeOutExpo) · ค้าง · จาง 2.30–2.60s (easeInCubic) — อ้างอิง motion-reference "チャプター導入"
- แตะเพื่อข้าม · `prefers-reduced-motion` = โชว์เฟรมสุดท้ายนิ่งๆ แล้วไปต่อเองตามเวลา

### Gender Flip Card (`.gender-flip`) — Result page
- แทนปุ่ม pill เดิม · การ์ด 64×84px `position: absolute` มุมขวาบนของ `.result-hero` (top 14px · right 16px) ชื่อ Yokai ยังอยู่กลาง
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
