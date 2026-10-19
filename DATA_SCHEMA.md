# DATA_SCHEMA.md — Ryokan of The Spirits
> Last updated: Phase 2 · Question design final (need-based houses + letter-axis Stage 2)
> Do not change data structures without updating this file first.

---

## 1. State Object

```js
let state = {
  // ── Event 0 ──────────────────────────────────────────
  playerGender:      '',   // 'male' | 'female' | 'nonbinary'
  targetGender:      '',   // 'male' | 'female' | 'any' (derived, see Gender Logic)
  resultGenderShown: '',   // 'male' | 'female' — เวอร์ชันที่โชว์บน Result page (toggle ได้)

  // ── Stage 1 · E1–E5 · House Sorting ──────────────────
  houseScores: {
    purple: 0,   // Analysts  NT · เยียวยา Self-Sacrifice
    green:  0,   // Diplomats NF · เยียวยา Emotional Deprivation
    blue:   0,   // Sentinels SJ · เยียวยา Abandonment
    yellow: 0    // Explorers SP · เยียวยา Unrelenting Standards
  },
  houseAnswers:    [],     // บ้านหลักของแต่ละข้อที่ตอบ ตามลำดับ (ยาว 5) — ใช้ tie-break
  winningHouse:    '',     // set หลัง calcHouse() (ตอนจบ E5)

  // ── Stage 2 · Bento + E6–E10 · Yokai Selection ───────
  yokaiPool:     [],       // HOUSE_POOLS[winningHouse] — set โดย loadStage2()
  stage2Answers: [],       // [{ qid, axis, pole, fn }] ยาว 6 — คะแนน + เก็บ function ไว้ใช้หน้า result
  winningYokai:  '',       // set หลัง calcYokai()

  // ── Progress ──────────────────────────────────────────
  stage:         1,        // 1 = house sorting, 2 = yokai selection
  currentQ:      0,        // index ภายใน stage ปัจจุบัน (0-based) · stage 2 index 0 = Bento
  bentoSelected: []        // food ที่ลากลงกล่อง — cosmetic only
};
```

ตัดออกจากเวอร์ชันก่อน: `lastHouseAnswer`, `yokaiScores`, `lastYokaiAnswer` (Stage 2 ใช้เสียงข้างมากรายแกน ไม่มีเสมอ จึงไม่มี tie-breaker)

---

## 2. Gender Logic

```
playerGender = 'female'   →  targetGender = 'male'
playerGender = 'male'     →  targetGender = 'female'
playerGender = 'nonbinary'→  targetGender = 'any'
                              (random male/female at result, toggleable)

resultGenderShown = targetGender  (default)
ปุ่มสลับบน Result page → toggle resultGenderShown ระหว่าง 'male' ↔ 'female'
```

ในเนื้อเรื่อง แขกในหมอกใช้ "เขา" (กลางทุกเพศ) และแทนตัวเองว่า "ข้า" — ไม่ต้องสลับข้อความตามเพศ

---

## 3. Yokai Data Structure

แต่ละ Yokai มี **2 เวอร์ชัน** (male / female) ใน key เดียวกัน

```js
const YOKAI_DATA = {
  Tenjin: {
    house:   'purple',
    mbti:    'INTJ',          // calcYokai() จับคู่ด้วย field นี้ — ห้ามซ้ำในบ้านเดียวกัน
    emoji:   '📜',
    name:    'Tenjin',
    title:   'เทพแห่งปัญญา',

    male: {
      image:       'assets/yokai/tenjin_m.png',   // รองรับ .gif / .webm / .mp4
      tagline:     'The God of Knowledge',
      why:         '...',
      quote:       '"..."',
      compat: [
        { label: 'Intellectual Bond', value: 97 },
        { label: 'Passion',           value: 58 },
        { label: 'Warmth',            value: 42 }
      ]
    },

    female: { /* โครงเดียวกัน */ }
  },
  // ... Yokai ที่เหลืออีก 15 ตัว ใช้ structure เดียวกัน
};
```

### Yokai Roster ครบ 16 ตัว

| House | MBTI | Name | Emoji | Thai Name |
|---|---|---|---|---|
| purple | INTJ | Tenjin | 📜 | เทพแห่งปัญญา |
| purple | INTP | Yumekui | 💤 | ปีศาจกินฝัน |
| purple | ENTJ | Ryuu | 🐉 | มังกรเทพเจ้า |
| purple | ENTP | Kitsune | 🦊 | จิ้งจอกเก้าหาง |
| green | INFJ | Shinigami | 💀 | ยมทูต |
| green | INFP | Yukionna | ❄️ | ปีศาจหิมะ |
| green | ENFJ | Oni | 👹 | ยักษ์โอนิ |
| green | ENFP | Tanuki | 🍃 | ทานุกิ |
| blue | ISTJ | Tengu | 👺 | เทนกุ |
| blue | ISFJ | Ningyo | 🧜 | เงือกญี่ปุ่น |
| blue | ESTJ | Jorogumo | 🕸️ | ปีศาจแมงมุม |
| blue | ESFJ | Inugami | 🐕 | เทพสุนัข |
| yellow | ISTP | Nekomata | 🐈‍⬛ | แมวปีศาจสองหาง |
| yellow | ISFP | Hebi | 🐍 | ปีศาจงูขาว |
| yellow | ESTP | Raijin | ⚡ | เทพสายฟ้า |
| yellow | ESFP | Fuujin | 🌪️ | เทพวายุ |

---

## 4. Question Bank Structure

รวม **11 ข้อ**: Stage 1 = 5 ข้อ (ทุกคนชุดเดียวกัน) · Stage 2 = 6 ข้อ (Bento + E6–E10, stem เดียวกันทุกบ้าน)

```js
const QUESTIONS = {

  // ── Stage 1 · E1–E5 · ทุกคนได้ชุดเดียวกัน ───────────────
  house: [
    {
      id:     'e1',
      scene:  'Dusk',                    // ป้ายฉากบน quiz header
      lead:   [],                        // บทเชื่อมก่อนฉาก (ว่างได้) — ดู Section 7
      text:   'Story / situation text',
      choices: [
        { text: 'Choice text', house: 'purple' },   // house = บ้านหลัก (+2) · บ้านสำรองมาจาก SECONDARY_HOUSE
        { text: 'Choice text', house: 'blue'   },
        { text: 'Choice text', house: 'yellow' },
        { text: 'Choice text', house: 'green'  }
      ]
    },
    // e2 … e5 — ทุกข้อมีครบ 4 บ้าน บ้านละ 1 ช้อย
  ],

  // ── Stage 2 · Bento + E6–E10 · ทุกบ้านใช้ stem เดียวกัน ──
  yokai: [
    // index 0–2: แกนที่ 2 — มี 2 ชุดช้อย เลือกชุดตาม HOUSE_AXIS[winningHouse]
    {
      id:     'bento',
      scene:  'The First Day',
      lead:   ['…'],                     // บทเชื่อม "ฟ้าสาง"
      text:   'Story / situation text',
      sets: {
        JP: {
          prompt: 'Question line',
          choices: [
            { text: 'Choice text', pole: 'J', fn: 'Te' },
            { text: 'Choice text', pole: 'P', fn: 'Ne' },
            { text: 'Choice text', pole: 'J', fn: 'Fe' },
            { text: 'Choice text', pole: 'P', fn: 'Se' }
          ]
        },
        TF: { prompt: '…', choices: [ /* T·Ti, F·Fe, T·Te, F·Fi */ ] }
      },
      afterArrange: 'Line he says after Continue'   // เฉพาะ bento
    },
    // e6, e7 — โครงเดียวกับ bento (ไม่มี afterArrange)

    // index 3–5: แกน E/I — ช้อยชุดเดียวทุกบ้าน
    {
      id:     'e8',
      scene:  'Rain Night',
      lead:   [],
      text:   'Story / situation text',
      axis:   'EI',
      prompt: 'Question line',
      choices: [
        { text: 'Choice text', pole: 'E', fn: 'Pe' },
        { text: 'Choice text', pole: 'I', fn: 'Ji' },
        { text: 'Choice text', pole: 'E', fn: 'Je' },
        { text: 'Choice text', pole: 'I', fn: 'Pi' }
      ]
    },
    // e9, e10
  ],

  // ── ข้อความหลังตอบ E10 → Loading ─────────────────────
  outro: ['Bridge line', 'Closing line']
};
```

### กฎของข้อมูล (ตรวจโดย `validateQuestions()` ตอนโหลดหน้า — ผิดเมื่อไร throw ทันที)
- `house.length === 5`, `yokai.length === 6`
- Stage 1: ทุกข้อมีช้อย 4 ตัว ครบทั้ง 4 บ้าน ไม่ซ้ำ
- Stage 2 ชุดใดก็ตาม (`sets.JP`, `sets.TF`, หรือ E/I): ช้อย 4 ตัว แต่ละขั้ว 2 ตัว
- `yokai[0..2]` ต้องมี `sets.JP` และ `sets.TF` · `yokai[3..5]` ต้องมี `axis: 'EI'`
- ข้อความในเกมเป็น**ภาษาไทย** ตามต้นฉบับใน memory ของเจ้าของ (`project_questions_draft.md`) — คัดลอกลง `questions.js` ตรงตัว
- ลำดับช้อยในไฟล์ไม่มีผล: UI สุ่มลำดับทุกครั้ง (`shuffled()`)

---

## 5. Scoring

### ค่าคงที่
```js
const HOUSE_POOLS = {
  purple: ['Tenjin',    'Yumekui',  'Ryuu',     'Kitsune' ],
  green:  ['Shinigami', 'Yukionna', 'Oni',      'Tanuki'  ],
  blue:   ['Tengu',     'Ningyo',   'Jorogumo', 'Inugami' ],
  yellow: ['Nekomata',  'Hebi',     'Raijin',   'Fuujin'  ]
};

// Stage 1: ช้อยบ้านหลัก +2 · บ้านสำรอง +1 (ตารางตายตัว ทุกข้อใช้กฎเดียว)
const SECONDARY_HOUSE = { purple: 'blue', blue: 'purple', green: 'yellow', yellow: 'green' };

// Stage 2: แกนที่ 2 ที่บ้านนั้นยังไม่ล็อก
const HOUSE_AXIS = { purple: 'JP', green: 'JP', blue: 'TF', yellow: 'TF' };

// ตัวอักษรที่บ้านล็อกไว้แล้ว: ? = E/I, _ = แกนที่ 2
const HOUSE_MBTI_TEMPLATE = { purple: '?NT_', green: '?NF_', blue: '?S_J', yellow: '?S_P' };
```

### Stage 1 — pickHouseAnswer(house)
```js
function pickHouseAnswer(house) {
  state.houseScores[house]                  += 2;
  state.houseScores[SECONDARY_HOUSE[house]] += 1;
  state.houseAnswers.push(house);
}
```

### calcHouse() — เรียกทันทีหลังตอบ E5
```js
function calcHouse() {
  const max  = Math.max(...Object.values(state.houseScores));
  let   ties = Object.keys(state.houseScores).filter(h => state.houseScores[h] === max);

  // Tie-break 1: บ้านที่ถูกเลือกเป็นบ้านหลักบ่อยที่สุด
  if (ties.length > 1) {
    const count = h => state.houseAnswers.filter(a => a === h).length;
    const top   = Math.max(...ties.map(count));
    ties = ties.filter(h => count(h) === top);
  }
  // Tie-break 2: ไล่ย้อนจาก E5 หาบ้านหลักล่าสุดที่อยู่ใน ties (ไม่ random)
  let winner = ties[0];
  if (ties.length > 1) {
    winner = [...state.houseAnswers].reverse().find(h => ties.includes(h));
  }
  if (!winner) throw new Error('[Ryokan] calcHouse: unresolved tie ' + JSON.stringify(state.houseScores));

  state.winningHouse = winner;
  loadStage2(winner);
}
```
Invariant: บ้านคะแนนสูงสุดต้องเคยเป็นบ้านหลักอย่างน้อย 1 ครั้ง (บ้านที่ได้แต่ +1 สูงสุด 5 แต้ม ขณะที่คู่ของมันได้ 10) → tie-break 2 หาเจอเสมอ · enumerate 1024 paths: ทุกบ้าน 25.0%

### loadStage2(house)
```js
function loadStage2(house) {
  state.yokaiPool     = [...HOUSE_POOLS[house]];
  state.stage2Answers = [];
  state.stage         = 2;
  state.currentQ      = 0;   // 0 = Bento
}
```

### getStage2Set(q) — ช้อยที่ผู้เล่นเห็นในข้อนั้น
```js
function getStage2Set(q) {
  if (q.axis === 'EI') return { axis: 'EI', prompt: q.prompt, choices: q.choices };
  const axis = HOUSE_AXIS[state.winningHouse];
  return { axis, prompt: q.sets[axis].prompt, choices: q.sets[axis].choices };
}
```

### Stage 2 — pickYokaiAnswer(q, choice)
```js
function pickYokaiAnswer(q, choice) {
  const { axis } = getStage2Set(q);
  state.stage2Answers.push({ qid: q.id, axis, pole: choice.pole, fn: choice.fn });
}
```

### calcYokai() — เสียงข้างมาก 3 ข้อต่อแกน (คี่ ไม่มีเสมอ)
```js
function majorityPole(axis) {
  const votes = state.stage2Answers.filter(a => a.axis === axis);
  if (votes.length !== 3) throw new Error(`[Ryokan] axis ${axis} has ${votes.length} votes, expected 3`);
  const [a, b] = axis.split('');               // 'EI' → 'E','I'
  return votes.filter(v => v.pole === a).length >= 2 ? a : b;
}

function calcYokai() {
  const house  = state.winningHouse;
  const mbti   = HOUSE_MBTI_TEMPLATE[house]
                   .replace('?', majorityPole('EI'))
                   .replace('_', majorityPole(HOUSE_AXIS[house]));
  const winner = state.yokaiPool.find(name => YOKAI_DATA[name].mbti === mbti);
  if (!winner) throw new Error(`[Ryokan] no yokai with ${mbti} in ${house}`);

  state.winningYokai      = winner;
  state.resultGenderShown = resolveResultGender();
}
```
ตอบสุ่มแล้วแต่ละตัวในบ้านออก 25% พอดี

### Function ของผู้เล่น (เก็บไว้ใช้หน้า result — ไม่มีผลกับคะแนน)
`state.stage2Answers[].fn` = Te/Ti/Fe/Fi/Ne/Se (แกนที่ 2) และ Pe/Pi/Je/Ji (E/I) — สูตรใช้กับ compat bars / ประโยคเฉพาะตัว จะกำหนดตอนทำหน้า result

---

## 6. Flow ของ Bento

```
ตอบ E5 → calcHouse() → loadStage2() → showView('bento')
  → intro: lead ของ yokai[0] (บทเชื่อมฟ้าสาง)
  → pop-up คำถาม Bento ขึ้น "ก่อน" ลากอาหาร   (ชุด JP/TF ตามบ้าน)
  → เลือกช้อย → pickYokaiAnswer → currentQ = 1
  → ลากอาหารลงกล่อง (cosmetic) → Continue
  → แสดง afterArrange ("นานแค่ไหนแล้วนะ…")
  → view-quiz: yokai[1] (E6) ซึ่ง lead = บทเชื่อม Bento→E6
```

---

## 7. บทเชื่อมฉาก (Narration)

| ที่อยู่ในข้อมูล | ใช้ตอนไหน |
|---|---|
| `q.lead` | แสดงก่อนฉากของข้อนั้น (เช่น บทเชื่อม E1→E2 อยู่ที่ `house[1].lead`) |
| `yokai[0].afterArrange` | หลังกด Continue ใน Bento |
| `QUESTIONS.outro` | หลังตอบ E10 ก่อน Loading (บทเชื่อม E10→ปิด + ข้อความปิด) |

รูปแบบการแสดง (หน้าบรรยาย tap เพื่อไปต่อ / typewriter) กำหนดใน `DESIGN_SYSTEM.md` ตอนลงโค้ด

---

## 8. Progress

11 ขั้น: E1–E5 = 1–5 · Bento = 6 · E6–E10 = 7–11
```js
const step = state.stage === 1 ? state.currentQ + 1 : 6 + state.currentQ;   // 1–11
```

---

## 9. Result Data Access

```js
function getResult() {
  const yokai  = YOKAI_DATA[state.winningYokai];
  const gender = state.resultGenderShown;   // 'male' | 'female'
  return {
    name:    yokai.name,
    emoji:   yokai.emoji,
    mbti:    yokai.mbti,
    house:   yokai.house,
    title:   yokai.title,
    image:   yokai[gender].image,
    tagline: yokai[gender].tagline,
    why:     yokai[gender].why,
    quote:   yokai[gender].quote,
    compat:  yokai[gender].compat
  };
}

function toggleResultGender() {
  state.resultGenderShown =
    state.resultGenderShown === 'male' ? 'female' : 'male';
  renderResult();
}
```

---

## 10. Edge Cases

| Case | การจัดการ |
|---|---|
| House tie หลัง E5 | บ้านหลักที่ถูกเลือกบ่อยสุด → บ้านหลักล่าสุด (ไม่ random) · หาไม่เจอ = throw |
| Yokai tie | เกิดไม่ได้ (3 เสียงต่อแกน) · จำนวนเสียงผิด = throw |
| ไม่มี Yokai ที่ MBTI ตรงในบ้าน | throw — แปลว่า YOKAI_DATA/HOUSE_POOLS ผิด |
| เข้า view Stage 2 โดยไม่มี `winningHouse` | `guardState()` throw (Rule 5 — ไม่ reset เงียบ) |
| playerGender = nonbinary | targetGender = 'any' → random ที่ result แต่ toggle ได้ |
| refresh กลางคัน | state อยู่ใน memory เท่านั้น → หน้าโหลดใหม่เริ่มที่ landing เอง |
| asset โหลดไม่ได้ | แสดง emoji ใน styled circle |
