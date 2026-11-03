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

  /* Accent orange — ส้มอิฐ · เหลือใช้เฉพาะหน้า result (ส่วนผสมสีไม้ด้านล่าง, ขอบบับเบิ้ลคุย) — เลิกใช้เป็นสถานะที่ถูกเลือกแล้ว */
  --accent-orange:      #D2691E;

  /* 臙脂 Enji — แดงครั่งเข้ม (ชุดสี B เจ้าของเลือก 2026-11) */
  --ink-enji:           #9F353A;
  --cta:                var(--ink-enji);   /* ปุ่มยันต์ "ไปต่อ", ผ้าม่านชื่ออีเวนต์ */
  --sel:                var(--primary);    /* สถานะที่ถูกเลือก: ตัวเลือกคำถาม, การ์ดเพศ, ตัวเลือกเบนโตะ */
  --washi-grain:        repeating-linear-gradient(90deg, transparent 0 3px, color-mix(in srgb, var(--ink-brown) 3%, transparent) 3px 4px);  /* ลายกระดาษ: ปุ่มยันต์ + การ์ดเรื่อง */

  /* สเกลตัวอักษรหน้าอีเวนต์ — แต่ละขั้นมีหน้าที่เดียว */
  --fs-eyebrow: 10px; --fs-small: 13px; --fs-body: 16px; --fs-voice: 17px; --fs-ask: 19px; --fs-title: 22px;

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
- `html, body { -webkit-tap-highlight-color: transparent }` — ปิดกรอบฟ้า (Android Chrome) / แฟลชเทา (iOS) ตอนแตะ · กรอบ `:focus-visible` ของคีย์บอร์ดยังอยู่
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
| **Choice** | `--surface-lowest` | ghost (`--outline-variant`) | `1.5rem` | selected: ขอบ `--sel` 2.5px + พื้นแดงจาง 8% |
| **Next (お札 fuda)** | `--washi-grain` + `--bg` | รอ: ghost · พร้อม: กรอบ `--cta` สองชั้น | `8px` | กดได้แล้วเด้ง (pop) · ค้าง 4s ขยับขึ้นลง — ใช้ในหน้าคำถาม (`.cta`) |
| **FAB** | `--primary` | none | `50%` | scale 1.05 — ใช้กับ BGM เท่านั้น (เซียมซีย้ายเป็นกล่องในหน้า: FAB ควรเป็น action หลักอันเดียว) |

### Cards & Lists
- **Rule of Silence:** No divider lines. Separate items with vertical whitespace or background color shifts.
- **Asymmetry (Result cards):** Slightly varied corner radii (e.g., top-left `2rem`, others `1.5rem`) for scrapbook feel.

### Journey Thread (`.journey-thread`) — แถบความคืบหน้าแบบด้ายแดง
- 11 ปม (E1–E5 · Bento · E6–E10) คั่นด้วยเส้น 2px · ปมที่ผ่านแล้ว = `--primary` ทึบ · ปมปัจจุบัน = วงแหวน `--primary` 3px เต้นเบาๆ (1.6s) · ยังไม่ถึง = `--surface-low` + ghost
- `renderThread(el, step)` สร้างใหม่ทุกข้อ · หน้าเลือกเพศ = step 0 (ยังไม่มีปมไหนผูก)

### Event Noren (`.noren-wrap`) — ป้ายชื่ออีเวนต์แบบผ้าม่านร้าน
- ราวไม้ `--ink-brown` 5px · ผ้า `--cta` แถวเดียว: `EVENT 04` (`--font-kanji` `--fs-eyebrow` จาง 75%) · `·` · ชื่อฉาก (`--font-display` `--fs-voice`) · ชายผ้า 3 แฉก แต่ละแฉกสองท่อน (บน/ล่าง 5px)
- ชื่อฉาก = `q.scene` ตัดอีโมจินำหน้า และถ้ามี " · " ใช้แค่ส่วนท้าย (`norenName()`)
- การเคลื่อนไหว: ทั้งผืนเอียงจากราว ≤2° (5.2s) · แฉกงอแยกจังหวะกัน ท่อนล่างตามช้ากว่า · ปิดเมื่อ reduced motion
- อยู่ในหน้า เลื่อนจอแล้วเลื่อนหายไปกับเนื้อเรื่อง (ไม่ติดหัวจอ) · ห่างการ์ดเรื่อง 19px

### Story Card + Ink Reveal (`.quiz-story`)
- การ์ดกระดาษ `--washi-grain` + `--bg`, radius 1.5rem, `--fs-body`, line-height 1.8 · ประโยคคำถามเป็นย่อหน้าสุดท้ายในการ์ด สีแดง `--primary` ตัวหนา `--fs-voice` (`.quiz-prompt`)
- ข้อความขึ้นทีละวลี (วลี = ส่วนที่คั่นด้วยเว้นวรรค): เนื้อเรื่องจางเข้าเฉยๆ 1.2s · คำถามซึมแบบหมึก (เบลอ 3px → ชัด) · พัก 0.55s ต่อวลี, 1.3s หลัง ? ! … —, 1.7s ระหว่างย่อหน้า (`INK`)
- "— tap to show all —" โผล่หลัง 1.5s · แตะตรงไหนก็ได้ในหน้า = ขึ้นครบทันที · reduced motion = ขึ้นครบเลย
- ตัวเลือกโผล่หลังเรื่องขึ้นครบเท่านั้น (ก่อนหน้านั้นแตะไม่ติด) · ถ้าตัวเลือกแรกตกขอบจอ เลื่อนลงให้เห็นเอง

### Choice List (`.choice-btn`) — รายการตัวเลือก
- แนวตั้งเต็มกว้าง · วงกลม ○ (`.choice-radio`) → เลือกแล้วเป็นวงแดง `--sel` + ✓ · ข้ออื่นจางเหลือ 60%
- ลอยขึ้นทีละใบ ห่าง 90ms · ไม่แตะเลย 6s → การ์ดเรืองแสงทีละใบ 2 รอบ (บอกว่าแตะได้)

### Choice Pictures (`c.image` — E1 ของหาย)
- ทุกตัวเลือกที่ยังไม่ถูกเลือกเป็น**เงาสีเดียวกัน** 44px (`brightness(0) opacity(.5)`) — ความสวยของรูปไม่มีผลต่อการเลือก
- ข้อที่เลือก**กางออก**: รูปขยาย 120px ลงสีจริง เอียง −6° อยู่เหนือข้อความ (เหมือนจังหวะได้ไอเทม) · วงกลมเลือกย้ายไปมุมซ้ายบน
- เส้นยึกยือ (line boil): `.choice-pic` สลับ SVG filter `#choice-boil-0…3` (fractalNoise 0.06, 2 octaves, scale 2.4) 8 เฟรม/วิ · ปิดเมื่อ reduced motion
- รูปสไตล์สติกเกอร์ขอบขาว พื้นใส ทุกชิ้นต้องสไตล์/ขนาดในกรอบใกล้กัน · ต้นฉบับ 1000×1000 เก็บไว้ แต่เกมใช้ไฟล์ `*_sm.png` 320px (แสดงใหญ่สุด 120px ยังคมบนจอ 3x) — รูปใหญ่กินแรมราว 4MB ต่อรูปแม้แสดงเล็ก

### Next Fuda + Answer Seal (`.cta`, `.answer-seal`)
- ปุ่มอยู่ชิดขวา กว้าง ≤280px (ไม่เต็มแถวเหมือนตัวเลือก) · ตรา 次 สี่เหลี่ยมซ้าย · ข้อความบอกสิ่งที่ยังขาด: "เปิดประตูให้ครบ · n/4" → "เลือกคำตอบก่อน" → "ไปต่อ →"
- กด → ปุ่มค้างสถานะพร้อม (`.sent`), ตรา 次 กดลงหนึ่งที · ตราซากุระ 🌸 กรอบแดงสองชั้นปั๊มลงบน ○ ของข้อที่เลือก (scale 2.2 → 1) · รอ 0.85s แล้วไปข้อต่อไป (`sealAnswer()` → `confirmAnswer()`)

### Narration Overlay (`.narration`) — บทเชื่อมฉาก
- ใช้กับ `lead` / `afterArrange` / `outro` ใน `questions.js` (1 string = 1 หน้า)
- Full-screen fixed, `--bg` ทึบ (ไม่ให้เห็นคำถามข้างหลัง), กว้างไม่เกิน `--max-w`
- ข้อความ: `--font-body`, 0.98rem, line-height 1.95, กึ่งกลาง · มี `.frost-band` (แถบขาวเบลอหลังตัวอักษร แบบเดียวกับการ์ด Bento) ให้อ่านง่าย
- **ขึ้นทีละบรรทัด** (1 บรรทัดใน string = 1 แตะ) บรรทัดก่อนหน้าค้างไว้บนจอ
- บรรทัดบรรยาย: สี `--ink-brown`, typewriter ทีละ grapheme (สระ/วรรณยุกต์ไทยไม่หลุด) · วางข้อความเต็มบรรทัดตั้งแต่เฟรมแรกด้วย `thaiBreakable(text, true)` (ทุก grapheme เป็น `.th-g`) แล้วเผยทีละตัวโดยถอด `.narration-unrevealed` (`visibility: hidden`) — บรรทัดไม่เลื่อนกึ่งกลาง ไม่ตัดคำใหม่ กล่องไม่กระเด้งระหว่างพิมพ์
- ตัวเลือกตอบของผู้เล่น (`{ reply: [...] }`): ปุ่มแบบ Choice (`--surface-lowest`, ghost border, 1.5rem, ◆ สี `--primary`) ข้อความไม่มี `"` · เข้าแบบ Row Expand (scaleY 0.08→1 จากขอบบน + opacity, 720ms easeOutBack, ห่างกันทีละ 65ms) — หน้าหยุดรอจนเลือก, แตะพื้นหลังไม่มีผล · เลือกแล้วระบบครอบ `"…"` ให้ กลายเป็นบรรทัดบทพูดสี `--secondary` ฟ้า (`.narration-line--player`, ตรงกับป้าย "คุณ" ในกล่อง VN) · ไม่มีผลคะแนน
- บรรทัดบทพูด (ขึ้นต้นด้วย `"`): `.narration-line--speech` ตัวหนา `--primary` แดง 1.04rem (ตรงกับป้าย "???" ในกล่อง VN) ค่อยๆ เฟดขึ้น 1.1s (opacity + blur + เลื่อนขึ้น) · `\n` ในบรรทัดเดียวกัน (หน้าแบบ array) = ขึ้นบรรทัดใหม่ในแตะเดียว (`.narration-line { white-space: pre-line }`) เช่น "ภูตอย่างข้า…↵ไม่มีใคร…"
- บรรทัดสะเทือนใจ (`{ slow: [...] }`): `.narration-line--slow` — เงียบ 0.7s แล้วแต่ละวลี (`.narration-phrase`) ลอยขึ้นจากเบลอ 2s ห่างกัน 1.7s เองโดยไม่ต้องแตะ · จบแล้วข้อความอยู่นิ่ง (ไม่ re-render) · วลีเดียวก็ได้ = ค่อยๆ โผล่ทั้งบรรทัดในจังหวะเดียว · `breath: true` = แต่ละวลีขึ้นบรรทัดใหม่ เว้นช่อง 14px (`.narration-line--breath`)
- ไหลต่อเอง (ไม่ต้องแตะ): บรรทัดที่ผู้เล่นเลือก และ `{ say, auto: true }` — ขึ้นครบแล้วเว้น 0.65s ขึ้นบรรทัดถัดไปเอง (แตะระหว่างนั้น = ไปต่อทันที) · ถ้าขึ้นต้นด้วย `"` ใช้สไตล์บทพูดด้วย
- แตะระหว่างกำลังขึ้น = แสดงครบทันที · แตะเมื่อครบ = บรรทัดถัดไป / หน้าถัดไป / ปิด
- "— tap to continue —" (`--font-kanji`) โผล่หลังพิมพ์จบ
- สถานะ: ดีไซน์ชั่วคราว รอเจ้าของเคาะ

### Quiz BG (`#view-quiz`)
- ทุกอีเวนต์คำถาม E1–E10 (Stage 1+2): ภาพเมฆญี่ปุ่นบนลาย asanoha `assets/ui/quiz/cloud_bg.png` (`cover`, ทับบน `--bg`) · Bento ใช้ BG ของตัวเอง
- `.quiz-next-wrap` พื้นใส (ไม่มี gradient `--bg` ทับภาพ)

### Sliding Doors (`q.doors` — E4 ห้องต้องห้าม)
- ตาราง 2×2 (`.quiz-choices--doors`, gap 12px) การ์ดสูง ≥176px ข้อความกลาง 15px · วงกลมเลือกมุมขวาบน · มุม 「 」 จาง `--ink-brown` 45% (`--font-kanji`) — สิ่งที่อยู่บนการ์ดคือเสียงที่ได้ยิน
- เหนือตารางมีบรรทัด "แตะประตูเพื่อเลื่อนเปิด แล้วเงี่ยหูฟังทีละบาน" (`.quiz-doors-hint` ตัวเล็กเงียบๆ `--font-kanji` `--fs-small` จาง 60% แบบเดียวกับ "— tap to show all —" · เฟดขึ้นพร้อมตัวเลือก) · การ์ดเว้นขอบ 40/24/34px ข้อความไม่ชน 「 」 (18px ชิดมุม 12px)
- ประตูแต่ละบาน: กรอบไม้ `--ink-brown` 4px · ลายโชจิด้านบน · แผงไม้ทึบ (koshi) 22% ล่าง · ที่จับกลม (hikite) ข้างรอยต่อ
- สถานะบน `.choice-btn`: `.closed` (ซ่อนข้อความ+วงกลม) → `.opening` (เลื่อน 720ms, `DOOR_SLIDE_MS`) → `.open` + `.seen` · **เปิดบานใหม่ = บานที่เปิดค้างอยู่ปิดเอง** เหลือเปิดแค่บานที่กำลังฟัง + บานที่เลือก (`shutOtherDoors`) · บานที่ฟังแล้วถูกปิดซ้ำ จางเหลือ 45% หลังปิดสนิท
- ตอนเปิด ข้อความลอยเข้ามาเบลอทีละวลี (`hearIn` ต่อ `.th-unit`, ห่าง 90ms) · ประตูแง้มครั้งเดียวหลังตัวเลือกลอยขึ้น 1.2s · reduced motion = ไม่มี transition / hear-in / แง้ม
- แตะบานปิด = เปิด · แตะระหว่างเลื่อน = ไม่มีผล · แตะบานที่เปิด = เลือก (บานอื่นปิด) · ปุ่มยันต์นับบานที่ฟังแล้วตั้งแต่เปิดหน้า "เปิดประตูให้ครบ · n/4" → "เลือกคำตอบก่อน" → "ไปต่อ"
- ภาพประตูเป็น CSS ชั่วคราว · รอรูปจริงจากเจ้าของ

### Key Scene VN (`#view-key`) — E5 / E9 / E10 แบบวิชวลโนเวล
- ภาพอีเวนต์เต็มจอ (cover) + หมอกลอยช้า (`.key-mist` 14s) · `.key-fx` เข้มขึ้นตามบรรทัด (บรรทัด/ทั้งหมด): e5 `--dawn` แสงทองฟ้าสาง (screen blend) · e10 `--fade` หมอก `--bg` 60% · ด้ายแดงอยู่บนสุด
- e10 เส้นภาพสั่น (`choiceBoil`, inset −4px) · ไฟล์ภาพยังไม่มี = ช่องลายทางบอกชื่อไฟล์ + 750×1334 (`.key-art--todo`) + console warning — ไม่เงียบ
- กล่องบทด้านล่าง: กระดาษ + glass · **บรรยาย** ไม่มีป้ายชื่อ ตัวอักษร `--ink-brown` · **คำพูด** ป้าย "???" แดง + เส้นแดงซ้าย `--fs-voice` (ไม่มีหางชี้ — เจ้าของให้เอาออก) · พิมพ์ทีละตัว 24ms (บรรยาย) / 38ms (คำพูด) · ▼ เมื่อจบบรรทัด · "— tap to continue —" หลังลังเล 2.5s
- แตะจอ: พิมพ์ให้จบ → บรรทัดถัดไป → ช่วงเลือก
- เมนูบนขอบกล่อง: LOG (ไอคอนนาฬิกาย้อน `--primary`) เปิดแผ่น glass แยกบรรยาย/คำพูด · HIDE ซ่อนด้าย+กล่องจนแตะ (หายไปในช่วงเลือก)
- ช่วงเลือก: กล่องหดเหลือคำถามสีแดง · จอหรี่ 35% · ยืม `#quiz-choices` + ปุ่มยันต์ของหน้าคำถามมาวางกลางพื้นที่เหนือกล่องแบบเมนูเกมจีบ (ไม่ทับกล่อง · ล้นจอยังเลื่อนได้แต่ไม่โชว์แถบเลื่อน) · ตราซากุระเหมือนหน้าคำถาม · reduced motion = ไม่พิมพ์ทีละตัว ไม่สั่น

- บทเชื่อม (`lead`) ยังเป็นหน้าบรรยายปกติก่อนเข้า VN เสมอ — E9: "คุณกับเขาคุยกัน…" / "รุ่งเช้าฟ้าเปิดจริงๆ อย่างที่ลุ้นกันไว้" แล้วตัดเข้าม้วนกระดาษ EVENT 09 · คืนเดือนเต็ม
- e9 `--lantern` แสงทองลอยขึ้นจากถนนโคม (screen blend) · ภาพใช้ภาพร่างงานเทศกาลเดียวกับ E10 ไปก่อน
- กล่อง VN รองรับรูปแบบเดียวกับหน้าบรรยาย: `{ say, auto }` ขึ้นครบแล้วเว้น 0.65s ไปบรรทัดถัดไปเอง · `{ slow }` บรรทัดซึ้ง: วลีซึมขึ้นทีละวลีแบบหมึก (ไม่พิมพ์ทีละตัว, breath = วลีละบรรทัด) · `{ reply }` ตัวเลือกตอบ
- **บทต่อหลังตอบ (E5 → เช้าวันแรก)**: หลังปั๊มคำตอบ E5 บท `bento.lead` เล่นต่อในกล่องเดิมบนภาพระเบียงเดิม (แสงฟ้าสางเต็มแล้ว ไม่ไล่ใหม่) → จบแล้ว CHAPTER 02 → หน้าบรรยายฉากเบนโตะ (`continueKeyScene`)
- **ตัวเลือกตอบ (`{ reply }`)**: บรรทัดของเขาค้างในกล่อง · ประโยคตอบ 3 ข้อลอยขึ้นเหนือกล่อง (ปุ่ม `.narration-reply-btn` ◆ แบบเดียวกับหน้าบรรยาย, จอหรี่) · เลือกแล้วประโยคนั้นพิมพ์ลงกล่องในฐานะผู้เล่น: ป้าย "คุณ" สี `--secondary` (ตำแหน่งเดียวกับ "???") + เส้นฟ้าซ้าย `--fs-voice` · ไม่มีผลคะแนน · LOG แสดง "คุณ" สีฟ้า

### Scroll Key Card (`.key-card`) — ป้ายชื่อก่อนฉากใหญ่
- จอหรี่ `--on-surface` 55% · ม้วนกระดาษ 74% กว้าง แกนไม้ `--ink-brown` คลี่จากกลาง 0.9s · แล้ว EVENT nn (`--cta`) / ชื่อฉาก (display 24px กฎชื่อสั้นเดียวกับผ้าม่าน) / คันจิ (`--cta`) ซึมแบบหมึก
- ก่อนเข้าฉาก: บท `lead` เล่นเป็นหน้าบรรยายแบบเดิม → view-key ค่อยๆ ปรากฏจากครีม 1.2s (`--key-enter` = `KEY_ENTER_MS`) แล้วม้วนกระดาษจึงเริ่ม
- ค้าง 3.2s หรือแตะ (reduced motion 1.2s) แล้วจาง 0.6s

### Rain (`q.weather: 'rain'` — E7)
- เส้นฝนตรงดิ่ง 90 เส้น (`.quiz-rain` > `.rain-drop`): ยาวจาง 70% (40–110px, opacity .3–.7) + ขีดสั้นชัด 30% (12–26px, .6–.9) · กว้าง 1px (25% เป็น 2px) · ปลายล่างชัดสุด สี `--secondary` 45% ผสม `--bg` (ขาวจะหายบนพื้นครีม)
- อยู่ใต้การ์ดเรื่อง/ตัวเลือก เหนือ BG เมฆ (`#view-quiz` isolation + z-index −1) · fixed กว้างเท่าคอลัมน์มือถือ · ตก 0.7–1.3s · reduced motion = เส้นนิ่ง

### Glass Scene (`#view-quiz.quiz-glass-scene`)
- E3 ฟ้าผ่าเท่านั้น: การ์ดเรื่อง / ตัวเลือกแบบ glass (BG เมฆเหมือนข้ออื่น)

### Blackout (`q.blackout` — E3) — ไฟดับ จุดไม้ขีดส่อง
- ลำดับ: ฟ้าผ่าพร้อมวลีแรก "เปรี้ยง!" (แสงวาบ 2 จังหวะ < 3 ครั้ง/วินาที · สายฟ้าสุ่มรูป · `.quiz-body` สั่น 0.5s · คำ "เปรี้ยง!" `--font-display` 48px สี `--primary`) → เรื่องขึ้นจบ ตัวเลือกลอยขึ้น → ไฟกระพริบ ดับ-ติด-ดับ-ติด แล้วดับทีละส่วน (ผ้าม่าน → การ์ดเรื่อง → ตัวเลือกทีละอัน, `.lights-out` = brightness .55) → มืดทั้งหน้า (`--blackout-ink` = `--on-surface` 88% + `--secondary`, opacity .95, ทับ fuda ด้วย) → "— ปัดนิ้วเพื่อจุดไม้ขีด —" + เส้นแสงแนะนำกลางจอ (ห่างขอบซ้าย ไม่ชนท่าปัดย้อนกลับของ iOS)
- ปัดครั้งแรก = ประกายไฟ 6 จุด "— ฟึ่บ… ไม่ติด ลองอีกที —" · ครั้งที่สอง = ติด (12 จุด) · หนึ่งครั้งที่แตะจอ = ปัดได้ครั้งเดียว · ติดแล้วลากต่อได้เลยไม่ต้องยกนิ้ว
- ไม้ขีด: **นิ้วจับปลายก้าน** ก้านยาว 64px เอียงขวา 10° หัว `--ink-enji` ก้าน `--surface-lowest` · เปลวไฟอยู่เหนือนิ้ว 70px นิ้วไม่บังสิ่งที่ส่อง · วงแสงรัศมี 120px (ใสเต็มใน 55%) ไหววูบเล็กน้อย + แสงอุ่น `--ink-gold` 28%
- เลือก: แตะการ์ดที่ไฟส่องถึง (แกนแสงแตะขอบการ์ด) = เลือก · แตะการ์ดที่มืด = เปลวไฟลอยไปหา 220ms (ไม่เลือก) · ลากแล้วปล่อยนิ้วไม่นับเป็นการเลือก · เลือกแล้วความมืดเปิดออกจาก ○ ของการ์ดนั้น พร้อมแสงอุ่นบาน ไฟของหน้ากลับมา จากนั้นเป็นหน้าปกติ (เปลี่ยนคำตอบ + กด 次 ได้ตามเดิม)
- นิ้วบนมือถือ: ล็อกการเลื่อนเฉพาะตอนมืด (`#view-quiz.blackout-hold`: touch-action none, ปิดเลือกข้อความ/เมนูกดค้าง) · นับนิ้วแรกนิ้วเดียว · ไฟใกล้ขอบบน (36px) หรือนิ้วใกล้ขอบล่าง (56px) → หน้าเลื่อนเอง ยิ่งลึกยิ่งเร็ว
- reduced motion: ไม่มีแสงวาบ/สายฟ้า/สั่น/กระพริบ — ความมืดกับไม้ขีดยังอยู่ (เป็นตัวเกม)

### Bento Arrange (`#view-bento`) — ชั้นวางของกิน + ลากลงกล่อง
- หน้าเบนโตะสูงเท่าจอ (`100dvh`, ไม่เลื่อน) · `.bento-main` มี `min-height: 0` ให้กล่องเบนโตะหดได้ — **ปุ่ม Continue ต้องอยู่ในจอเสมอ** (ทดสอบแล้วถึงจอสูง 467px)
- ของกินอยู่บน **Item Shelf** (ดูหัวข้อถัดไป) · ล่างสุด `.bento-next-wrap--split`: Undo (`.tool-btn`) ซ้าย · Continue ขวา — Undo เอาชิ้นล่าสุดออก, ไม่เหลือชิ้นไหน = Continue กดไม่ได้
- รูปกล่อง (`.bento-art-img`) ย่อจนกล่องทั้งใบพอดีความสูงพื้นที่วาง และวางกล่องไว้กลางพื้นที่ (container query `cqw/cqh` + ตำแหน่งกล่องใน Body.PNG) — จอเตี้ยกล่องเล็กลง แต่ไม่โดนตัด
- **ป๊อปอัปคำถามเบนโตะ** (`.bento-q-modal` แผ่นล่าง): พื้นเมฆ `cloud_bg` + `--bg` เหมือนหน้าคำถาม · ข้างในใช้ชิ้นเดียวกับหน้าคำถามทั้งหมด — การ์ดเรื่องวาชิ `.quiz-story` + `.quiz-prompt` แดง, ตัวเลือก `.quiz-choices` ○→✓, ปุ่มยันต์ 次 `.cta` + ตราซากุระ (ไม่มีการ์ดรูปช่องว่างแบบเก่าแล้ว)
- อาหารที่วาง (`.bento-placed-food`) กว้าง 22% ของรูปกล่อง (ใช้ min() เดียวกับ `.bento-art-img`) — เล็กลงตามกล่องบนจอเตี้ย
- ชั้นของกิน **สองแถว** (`.item-shelf--two-row`: grid เรียงทีละคอลัมน์, ช่อง 76px) 14 อย่าง · ขอบขวาจางลง (mask) จนกว่าเลื่อนสุด (`.at-end` จาก `markBentoShelfEnd()`)
- **มือชี้ปัด ↔** (`.shelf-hint-hand` SVG ใน `.shelf-hint-wrap`): ขึ้นหลังกด Confirm ปัดขวา→ซ้าย 2 รอบแล้วจาง (`shelfHint`) · หายทันทีเมื่อเลื่อนหรือแตะชั้นครั้งแรก · ลูกศรสี `--primary` ตัวมือ `--bg` ขอบ `--on-surface` · reduced-motion = มือนิ่ง

### Item Shelf (`.item-shelf`) — ใช้ร่วม Bento (ของกิน) + Doll (ของแต่ง)
- ชั้นวางแนวนอน flex, `overflow-x: auto`, scroll-snap · ชิ้น `.shelf-item` 84px (`.shelf-item-img` + `.shelf-item-label` ถ้ามี) · ชิ้นถัดไปโผล่ครึ่งชิ้นที่ขอบขวาเป็นใบ้ว่าเลื่อนได้
- **แถบเลื่อนโชว์เสมอ** (PC ไม่มีการปัด): บาง 6px, ราง `--surface-low`, ตัวจับ `--primary` ขอบมน · ลูกกลิ้งเมาส์แนวตั้ง = เลื่อนชั้นไปด้านข้าง
- `.shelf-item { touch-action: pan-x }` — ปัดซ้าย/ขวา = เลื่อนชั้น, ขยับทางอื่น ≥ 6px = เริ่มลาก (ไม่สร้างภาพตามนิ้วตอนแค่แตะ)
- ระบบลาก (index.html "ITEM SHELF", `initItemShelf(cfg)`): ติดตั้งครั้งเดียวตอนโหลดต่อชั้นวาง · ลากได้ทีละนิ้ว · ภาพตามนิ้ว (`.shelf-drag-ghost`) อยู่ใน view ของชั้นนั้น ไม่ใช่ `body` · ทุกทางที่การลากจบผ่าน `end()` ที่เดียว
- ชิ้นที่กำลังถูกลากแค่จาง (`.shelf-lifted` opacity 0.18) — **ห้ามใส่ `pointer-events: none`** จะทำให้หลุดการจับนิ้ว (ภาพค้างจอ)
- ชิ้นที่วางแล้ว (`.shelf-placed`) ลากต่อได้: ปล่อยในกล่อง = ย้าย (ขึ้นบนสุด + เด้งลงใหม่) · ปล่อยนอกกล่อง = เอาออก · การย้ายไม่นับเป็นขั้น Undo · ชั้นที่ใส่ของ (`.bento-placed-items`, `.doll-placed-items`) ยังเป็น `pointer-events: none` เฉพาะตัวชิ้นที่รับนิ้ว
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

### Crowd Intro (`#crowd-intro`) — E2 แขกภูตกรูเข้าเรียวกัง (อนุมัติจาก lab/crowd-lab "เดิม + ห้องเต็มก่อน")
- Overlay fixed กว้าง `--max-w`, z-index 930 (ใต้ chapter/narration), BG cloud_bg ของตัวเอง · สร้างใหม่ทุกรอบโดย `playCrowdIntro` · class/keyframes ขึ้นต้น `crowd-*`
- ลำดับ (วินาที): จอสั่น 3 ที + "ตึง ตึง ตึง!" (0.1) → หรี่ 50% (0.6) → แถบ obi ครีมเลื่อนเข้าจากซ้าย (0.9) + "โครม!" แดงเอียง (0.95) → ฝน
- เงาโยไค 12 ตนครึ่งบน (CSS mask จาก `assets/ui/crowd/*.png` — เงาสีเดียว 320px ~20KB ที่ export จาก assets/yokai · โหลดล่วงหน้าตอนยืนยันเพศ `preloadCrowdArt()`, 62% บน, แถวหน้า/หลัง, แถวหน้าสลับเข้ม 1/0.82, แถวหลัง 0.5) วิ่งผ่านตั้งแต่ 1.2s · กระดาษเปียกเป็นดวง · น้ำหยดใต้แถบ · หยดน้ำเกาะจอ 7 หยด
- แท็บ "ห้องว่าง 12" ติดขอบบนซ้ายของแถบ ลดทีละ 1 ตอนแต่ละตนวิ่งเข้า → แดง "เต็ม!"
- คอมเมนต์ไหลแบบ Niconico 5 อัน (เริ่ม 0.4s หลังเต็ม ห่าง 0.62s ข้ามจอ 3.4s) + บรรทัดคนมาสาย · ตัวขาวขอบเข้ม · ใหญ่/แดง/ทองบางอัน · `width: max-content` (กันตัดบรรทัดที่ `<wbr>`)
- คนมาสาย: เงาทานูกิ 1.3s หลังคอมเมนต์สุดท้าย สะดุด "ตุ้บ!" · บรรทัดของเขาตามมา 0.6s
- จบ: แถบออก → การ์ด E2 ขึ้นข้างใต้ แล้ว overlay จาง 0.5s · รวม ~10s
- SKIP ▸▸ มุมขวาบน โชว์ทุกคน → ปิดทุกอย่างทันที การ์ดขึ้นครั้งเดียว · หลังแถบออก ปุ่มซ่อนและกดไม่ได้ · reduced motion = ข้ามฉาก
- ข้อความคอมเมนต์/ตัวหนังสือเสียงยังเป็นร่าง รอเจ้าของอนุมัติ
