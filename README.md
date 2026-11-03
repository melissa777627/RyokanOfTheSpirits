# Assets — Ryokan of The Spirits
> วางไฟล์รูปและเสียงตามโครงสร้างนี้ โค้ดอ้างอิง path เหล่านี้ตรง ๆ

---

## โครงสร้าง Folder

```
assets/
├── yokai/          ← รูปตัวละคร Yokai (หลัก)
├── ui/             ← UI elements, patterns, ornaments
├── audio/          ← BGM + SFX
└── README.md       ← ไฟล์นี้
```

---

## yokai/ — Yokai Character Art

แต่ละ Yokai มี **2 ไฟล์** (male version + female version)

### Naming Convention
```
{yokainame_lowercase}_{m|f}.{ext}
```

### รายการทั้งหมด (32 ไฟล์)

| Yokai | Male | Female |
|---|---|---|
| Tenjin | `tenjin_m.png` | `tenjin_f.png` |
| Yumekui | `yumekui_m.png` | `yumekui_f.png` |
| Ryuu | `ryuu_m.png` | `ryuu_f.png` |
| Kitsune | `kitsune_m.png` | `kitsune_f.png` |
| Shinigami | `shinigami_m.png` | `shinigami_f.png` |
| Yukionna | `yukionna_m.png` | `yukionna_f.png` |
| Oni | `oni_m.png` | `oni_f.png` |
| Tanuki | `tanuki_m.png` | `tanuki_f.png` |
| Tengu | `tengu_m.png` | `tengu_f.png` |
| Ningyo | `ningyo_m.png` | `ningyo_f.png` |
| Jorogumo | `jorogumo_m.png` | `jorogumo_f.png` |
| Inugami | `inugami_m.png` | `inugami_f.png` |
| Nekomata | `nekomata_m.png` | `nekomata_f.png` |
| Hebi | `hebi_m.png` | `hebi_f.png` |
| Raijin | `raijin_m.png` | `raijin_f.png` |
| Fuujin | `fuujin_m.png` | `fuujin_f.png` |

### Format ที่รองรับ
- `.png` — แนะนำ (รองรับ transparency)
- `.gif` — ถ้าต้องการ animation
- `.webm` — ถ้าต้องการ video loop

> Path ที่โค้ดใช้: `assets/yokai/tenjin_m.png`  
> ถ้ายังไม่มีรูป → โค้ดจะแสดง placeholder div สีพื้น `--surface-low`

---

## ui/ — UI Elements

| ไฟล์ | ใช้งาน |
|---|---|
| `hero/hero.jpg` | Landing page art banner (full-bleed) · 1080px wide JPEG, crop จาก center top |
| `quiz/cloud_bg.png` | พื้นหลังเมฆญี่ปุ่น + ลาย asanoha — view-quiz และ view-result |
| `fx/rain_ripples_glow.webp` | วงคลื่นฝน (animated WebP พื้นใส 1280×720, 48 เฟรม 4s loop, 3.9MB) — reveal หลังวาดตุ๊กตา E7 · เส้นขาว ใช้บนพื้นมืดเท่านั้น · จากชุด effect ของเจ้าของ (มีสิทธิ์ใช้) |
| `quiz/cloud_bg.png` | พื้นหลังทุกอีเวนต์คำถาม E1–E10 (`#view-quiz`) · 750×1334 เมฆญี่ปุ่นบนลาย asanoha โทนครีม |
| `choice/choiceevent1/{bell,omamori,pocketwatch,notebook}.png` | รูปของหาย E1 ครบ 4 บ้าน · 1000×1000 พื้นใส สไตล์สติกเกอร์ขอบขาว · bell = กระดิ่งเล็ก (ม่วง) · omamori = เครื่องรางโอมาโมริ 成就 (ฟ้า) · pocketwatch = นาฬิกาพก (เหลือง) · notebook = สมุดเล่มเล็ก (เขียว) · แสดงแบบ D: เงาสีเดียวข้างข้อความ → ข้อที่เลือกขยาย 120px ลงสี · ตอนนี้ใช้ใน `lab/choice-img-lab.html` เท่านั้น |
| `choice/choiceevent1/{name}_sm.png` | ไฟล์ที่เกมใช้จริง (E1) — ย่อจากต้นฉบับเหลือ 320px (~70–90KB) · ต้นฉบับ 1000px เก็บไว้เป็น source |
| `crowd/{name}_{m|f}.png` | เงาโยไคสำหรับฉากแขกกรู E2 — 320px สีดำทึบ เก็บแค่รูปทรง (ใช้เป็น CSS mask) ~20KB/ไฟล์ · export จาก `assets/yokai/` ด้วย canvas · 12 ตน: tengu_m nekomata_f oni_m tanuki_m yukionna_f inugami_m shinigami_f hebi_m raijin_m fuujin_f ningyo_f oni_f · เปลี่ยนรูปโยไคเมื่อไร export ใหม่ |
| `choice/choiceevent1/omamori_outline.png` | เครื่องรางแบบขอบขาว + เส้นดำรอบนอก — แบบที่ไม่ได้เลือก (เก็บไว้เผื่อ) |
| `event10_mist/BG.PNG` | ภาพฉาก E10 "โคมดวงสุดท้าย" (ภาพร่างชั่วคราวของเจ้าของ) · 1080×1920 PNG · ถนนงานเทศกาล โคม โทริอิ ท้องฟ้าพลบค่ำ · ใช้ใน key scene E10 และ E9 ชั่วคราว (`#view-key`) เส้นสั่นด้วย `#choice-boil-*` |
| `event5_porch/BG.PNG` | ภาพฉาก E5 "ฟ้าสาง" (ภาพร่างชั่วคราวของเจ้าของ) · 1080×1920 PNG · ระเบียงใต้ชายคา กระดิ่งลม ท้องฟ้าเช้า · ใช้ใน key scene E5 เส้นสั่นด้วย `#choice-boil-*` (เหมือน E10) |
| `doll/{name}_teru.png` | ตุ๊กตาไล่ฝนประจำ Yokai (ใช้ทั้งสองเพศ) · 1000×1000 พื้นใส · name ตัวเล็ก · มีแล้ว 11: hebi inugami kitsune nekomata ningyo oni shinigami tanuki tengu yukionna yumekui · ยังขาด: tenjin ryuu jorogumo raijin fuujin → `YOKAI_DATA[x].dollImage` |
| `doll/teru_body.png` | ตุ๊กตาไล่ฝน (หน้าว่าง) สำหรับ view-doll · 1000×1000 พื้นใส · หน้า = วงกลม center (482,386) r≈168 — ระบายได้เฉพาะพิกเซลสีหน้า |
| `doll/acc_{section}_{n}.png` | ⬜ ของแต่งตุ๊กตา (หน้าแต่งตัว E7) — section = `ribbon` \| `hat` \| `flower` \| `charm` · PNG พื้นใส สี่เหลี่ยมจัตุรัส ~320×320 ครอปชิดตัวของ · ตอนนี้ใช้ emoji แทน (`DOLL_ACCESSORIES` ใน index.html) — ได้รูปแล้วต้องเปลี่ยนทั้งการ์ดบนชั้นวางและ `drawDollAccessories()` เป็น drawImage |
| `food/{Name}.PNG` | ของกินบนชั้นเบนโตะ (`#bento-palette` สองแถว) 14 อย่าง · ~1000×1000 พื้นใส · Onigiri, Karaage␠, Ebi tempura, Hamburg, Sashimi, Shake (แซลมอนย่าง), Saba, Tako wiener, Tamako, Shoronpo, Sakuramochi, Lemon, Oba leaf, Ume boshi · ชื่อมีช่องว่าง → ใส่ `%20` ใน url (`Karaage .PNG` มีช่องว่างท้ายชื่อ) · เพิ่มอย่างใหม่ = เพิ่ม `.shelf-item` ใน index.html |
| `food/bento/{Body,Cover,BGmaipai}.PNG` | กล่องเบนโตะ (drop zone) · ฝากล่อง (มุมบน) · พื้นหลังลายไม้ |
| `seigaiha.svg` | Seigaiha (鱗) scale pattern — overlay opacity 0.18 |
| `ornament_divider.svg` | Gold line + ✦ + line divider |
| `logo.png` | App logo (ถ้ามี) |

---

## audio/ — BGM & SFX

| ไฟล์ | ใช้งาน |
|---|---|
| `bgm_main.mp3` | Background music — loop ตลอด |
| `sfx_click.mp3` | เสียงกดปุ่ม / เลือกคำตอบ |
| `sfx_reveal.mp3` | เสียงเผย Yokai บน result page |
| `sfx_page.mp3` | เสียง transition ระหว่าง view |

> โค้ดใช้ AudioContext stub จนกว่าจะมีไฟล์จริง — ไม่มี error ถ้าไฟล์ยังไม่อยู่

---

## หมายเหตุ

- **ห้ามเปลี่ยน path หรือชื่อไฟล์** โดยไม่อัปเดต `YOKAI_DATA` ใน `index.html` และ `CONTEXT_FOR_CLAUDECODE.md` ด้วย
- ขนาดที่แนะนำ: Yokai art **780×780px** หรือ **390×780px** (portrait)
- ไม่ต้องมีรูปจริงก่อน build — placeholder จะแสดงแทน
