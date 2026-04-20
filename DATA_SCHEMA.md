# DATA_SCHEMA.md — Ryokan of The Spirits
> Last updated: Phase 1 · Approved routing plan (flaws patched)
> Do not change data structures without updating this file first.

---

## 1. State Object

```js
let state = {
  // ── Event 0 ──────────────────────────────────────────
  playerGender:      '',   // 'male' | 'female' | 'nonbinary'
  targetGender:      '',   // 'male' | 'female' (derived, see Gender Logic)
  resultGenderShown: '',   // 'male' | 'female' — เวอร์ชันที่โชว์บน Result page (toggle ได้)

  // ── Stage 1 · Event 1–5 · House Sorting ──────────────
  houseScores: {
    purple: 0,   // Analysts  NT
    green:  0,   // Diplomats NF
    blue:   0,   // Sentinels SJ
    yellow: 0    // Explorers SP
  },
  winningHouse:    '',     // 'purple'|'green'|'blue'|'yellow' — set หลัง calcHouse()
  lastHouseAnswer: '',     // house จากตัวเลือก Q5 — ใช้ tie-breaker

  // ── Bento Intermission ────────────────────────────────
  bentoSelected: [],       // array of food emoji ที่เลือก (max 3) — cosmetic only
  // คำถาม pop-up หลัง bento นับเป็น Q แรกของ Stage 2

  // ── Stage 2 · Event 6–10 · Yokai Selection ───────────
  yokaiPool:       [],     // ['Tenjin','Yumekui','Ryuu','Tengu'] — set ตาม winningHouse
  yokaiScores:     {},     // { Tenjin:0, Yumekui:0, Ryuu:0, Tengu:0 } — build ตอน loadStage2()
  winningYokai:    '',     // ชื่อ Yokai — set หลัง calcYokai()
  lastYokaiAnswer: '',     // yokai จากตัวเลือก Q10 — ใช้ tie-breaker

  // ── Progress ──────────────────────────────────────────
  stage:    1,             // 1 = house sorting, 2 = yokai selection
  currentQ: 0             // index ภายใน stage ปัจจุบัน (0-based)
};
```

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

---

## 3. Yokai Data Structure

แต่ละ Yokai มี **2 เวอร์ชัน** (male / female) ใน key เดียวกัน

```js
const YOKAI_DATA = {
  Tenjin: {
    house:   'purple',
    mbti:    'INTJ',
    emoji:   '📜',
    name:    'Tenjin',
    title:   'เทพแห่งปัญญา',

    male: {
      image:       'assets/tenjin_m.png',   // รองรับ .gif / .webm
      tagline:     'The God of Knowledge',
      why:         '...',
      quote:       '"..."',
      compat: [
        { label: 'Intellectual Bond', value: 97 },
        { label: 'Passion',           value: 72 },
        { label: 'Warmth',            value: 55 }
      ]
    },

    female: {
      image:       'assets/tenjin_f.png',
      tagline:     'The Goddess of Knowledge',
      why:         '...',
      quote:       '"..."',
      compat: [
        { label: 'Intellectual Bond', value: 97 },
        { label: 'Passion',           value: 72 },
        { label: 'Warmth',            value: 55 }
      ]
    }
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
| purple | ENTP | Tengu | 👺 | เทนกุ |
| green | INFJ | Shinigami | 💀 | ยมทูต |
| green | INFP | Yukionna | ❄️ | ปีศาจหิมะ |
| green | ENFJ | Kitsune | 🦊 | จิ้งจอกเก้าหาง |
| green | ENFP | Tanuki | 🍃 | ทานุกิ |
| blue | ISTJ | Oni | 👹 | ยักษ์โอนิ |
| blue | ISFJ | Ningyo | 🧜 | เงือกญี่ปุ่น |
| blue | ESTJ | Raijin | ⚡ | เทพสายฟ้า |
| blue | ESFJ | Inugami | 🐕 | เทพสุนัข |
| yellow | ISTP | Nekomata | 🐈‍⬛ | แมวปีศาจสองหาง |
| yellow | ISFP | Hebi | 🐍 | ปีศาจงูขาว |
| yellow | ESTP | Jorogumo | 🕸️ | ปีศาจแมงมุม |
| yellow | ESFP | Fuujin | 🌪️ | เทพวายุ |

---

## 4. Question Bank Structure

```js
const QUESTIONS = {

  // ── Stage 1 · ทุกคนได้ชุดเดียวกัน ─────────────────────
  house: [
    {
      id:     'h1',
      scene:  '🌅 Scene label',          // แสดงบน quiz header
      text:   'Story / situation text',  // typewriter effect
      choices: [
        { text: 'Choice text', house: 'purple' },
        { text: 'Choice text', house: 'green'  },
        { text: 'Choice text', house: 'blue'   },
        { text: 'Choice text', house: 'yellow' }
      ]
    },
    // h2, h3, h4, h5  (รวม 5 ข้อ)
  ],

  // ── Stage 2 · ดึงตาม winningHouse ──────────────────────
  // แต่ละบ้านมี 5 ข้อ: index[0] = bento pop-up Q, index[1–4] = Event 7–10
  yokai: {

    purple: [
      {
        id:     'p1',                    // bento pop-up Q (index 0)
        scene:  '🌙 Scene label',
        text:   'Story / situation text',
        choices: [
          { text: 'Choice text', yokai: 'Tenjin'  },
          { text: 'Choice text', yokai: 'Yumekui' },
          { text: 'Choice text', yokai: 'Ryuu'    },
          { text: 'Choice text', yokai: 'Tengu'   }
        ]
      },
      // p2, p3, p4, p5  (index 1–4 · รวม bento pop-up = 5 ข้อ)
    ],

    green: [
      // 5 ข้อ · choices map: Shinigami / Yukionna / Kitsune / Tanuki
    ],

    blue: [
      // 5 ข้อ · choices map: Oni / Ningyo / Raijin / Inugami
    ],

    yellow: [
      // 5 ข้อ · choices map: Nekomata / Hebi / Jorogumo / Fuujin
    ]
  }
};
```

---

## 5. Scoring Functions (Pseudocode)

### calcHouse()
```js
function calcHouse() {
  const scores = state.houseScores;
  let winner = '';
  let max = -1;
  let ties = [];

  for (const [house, score] of Object.entries(scores)) {
    if (score > max) { max = score; winner = house; ties = [house]; }
    else if (score === max) { ties.push(house); }
  }

  // Tie-breaker: ดูคำตอบ Q5 (ข้อสุดท้ายของ Stage 1)
  if (ties.length > 1) {
    const q5Answer = state.lastHouseAnswer;
    if (ties.includes(q5Answer)) winner = q5Answer;
    else winner = ties[Math.floor(Math.random() * ties.length)];
  }

  state.winningHouse = winner;
  loadStage2(winner);        // โหลด question pool + init yokaiScores
}
```

### loadStage2(house)
```js
function loadStage2(house) {
  const HOUSE_POOLS = {
    purple: ['Tenjin',    'Yumekui',  'Ryuu',     'Tengu'   ],
    green:  ['Shinigami', 'Yukionna', 'Kitsune',  'Tanuki'  ],
    blue:   ['Oni',       'Ningyo',   'Raijin',   'Inugami' ],
    yellow: ['Nekomata',  'Hebi',     'Jorogumo', 'Fuujin'  ]
  };

  state.yokaiPool = HOUSE_POOLS[house];

  // init yokaiScores dynamically
  state.yokaiScores = {};
  for (const name of state.yokaiPool) {
    state.yokaiScores[name] = 0;
  }

  state.stage    = 2;
  state.currentQ = 0;
}
```

### calcYokai()
```js
function calcYokai() {
  const scores = state.yokaiScores;
  let winner = '';
  let max = -1;
  let ties = [];

  for (const [yokai, score] of Object.entries(scores)) {
    if (score > max) { max = score; winner = yokai; ties = [yokai]; }
    else if (score === max) { ties.push(yokai); }
  }

  // Tie-breaker: ดูคำตอบ Q สุดท้ายของ Stage 2
  if (ties.length > 1) {
    const lastAnswer = state.lastYokaiAnswer;
    if (ties.includes(lastAnswer)) winner = lastAnswer;
    else winner = ties[Math.floor(Math.random() * ties.length)];
  }

  state.winningYokai = winner;

  // Set gender version to show
  state.resultGenderShown = state.targetGender === 'any'
    ? (Math.random() < 0.5 ? 'male' : 'female')
    : state.targetGender;

  showView('loading');
}
```

### pickAnswer(source, value)
```js
// source = 'house' | 'yokai'
// value  = house name | yokai name
function pickAnswer(source, value) {
  if (source === 'house') {
    state.houseScores[value]++;
    state.lastHouseAnswer = value;
    state.currentQ++;
    if (state.currentQ >= QUESTIONS.house.length) {
      showView('bento');   // ไป bento ก่อน calcHouse
    } else {
      loadQuestion();
    }
  } else {
    state.yokaiScores[value]++;
    state.lastYokaiAnswer = value;
    state.currentQ++;
    if (state.currentQ >= QUESTIONS.yokai[state.winningHouse].length) {
      calcYokai();
    } else {
      loadQuestion();
    }
  }
}
```

---

## 6. Bento Pop-up Question

```js
// หลัง bento เสร็จ → โหลดคำถาม bento ของบ้านที่ชนะ
// คำถามนี้ถูกเก็บใน QUESTIONS.yokai[winningHouse][0]
// และจะนับเป็น Q แรกของ Stage 2 ทันที

function onBentoContinue() {
  calcHouse();                       // คำนวณบ้าน + loadStage2 (reset currentQ = 0)
  showBentoQuestion();               // pop-up ขึ้นมา
}

function showBentoQuestion() {
  const q = QUESTIONS.yokai[state.winningHouse][0];
  // render popup UI ด้วย q.text + q.choices
  // เมื่อเลือก → pickAnswer('yokai', value) → currentQ = 1
  //            → ปิด popup → ไปต่อ Event 7–10 (index 1–4)
}
```

---

## 7. Result Data Access

```js
// ดึงข้อมูลแสดงผล
function getResult() {
  const yokai  = YOKAI_DATA[state.winningYokai];
  const gender = state.resultGenderShown;   // 'male' | 'female'
  return {
    name:    yokai.name,
    emoji:   yokai.emoji,
    mbti:    yokai.mbti,
    title:   yokai.title,
    image:   yokai[gender].image,
    tagline: yokai[gender].tagline,
    why:     yokai[gender].why,
    quote:   yokai[gender].quote,
    compat:  yokai[gender].compat
  };
}

// สลับเพศบน Result page
function toggleResultGender() {
  state.resultGenderShown =
    state.resultGenderShown === 'male' ? 'female' : 'male';
  renderResult();   // re-render UI เฉพาะส่วน image + text
}
```

---

## 8. Edge Cases

| Case | การจัดการ |
|---|---|
| House tie หลัง Event 5 | ดู `lastHouseAnswer` (Q5) → ถ้าไม่ช่วย → random |
| Yokai tie หลัง Event 10 | ดู `lastYokaiAnswer` (Q10) → ถ้าไม่ช่วย → random |
| playerGender = nonbinary | targetGender = 'any' → random ที่ result แต่ toggle ได้ |
| refresh กลางคัน | state อยู่ใน memory เท่านั้น → redirect กลับ landing |
| asset โหลดไม่ได้ | fallback เป็น emoji ใน styled circle |
