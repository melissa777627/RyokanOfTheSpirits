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
| `doll/teru_body.png` | ตุ๊กตาไล่ฝน (หน้าว่าง) สำหรับ view-doll · 1000×1000 พื้นใส · หน้า = วงกลม center (482,386) r≈168 — ระบายได้เฉพาะพิกเซลสีหน้า |
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
