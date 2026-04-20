// ============================================================
//  scoring-engine.js — Ryokan of The Spirits
//  Pure functions only. No UI logic inside this file.
//  Import / paste into index.html before app logic.
// ============================================================

// ── 1. HOUSE POOLS ──────────────────────────────────────────

const HOUSE_POOLS = {
  purple: ['Tenjin',    'Yumekui',  'Ryuu',     'Tengu'   ],
  green:  ['Shinigami', 'Yukionna', 'Kitsune',  'Tanuki'  ],
  blue:   ['Oni',       'Ningyo',   'Raijin',   'Inugami' ],
  yellow: ['Nekomata',  'Hebi',     'Jorogumo', 'Fuujin'  ]
};

// ── 2. STATE ─────────────────────────────────────────────────

function createInitialState() {
  return {
    playerGender:      '',
    targetGender:      '',
    resultGenderShown: '',

    houseScores:     { purple: 0, green: 0, blue: 0, yellow: 0 },
    winningHouse:    '',
    lastHouseAnswer: '',

    yokaiPool:       [],
    yokaiScores:     {},
    winningYokai:    '',
    lastYokaiAnswer: '',

    stage:         1,
    currentQ:      0,
    bentoSelected: []
  };
}

let state = createInitialState();

// ── 3. GENDER LOGIC ──────────────────────────────────────────

function setPlayerGender(gender) {
  state.playerGender = gender;
  if      (gender === 'male')   state.targetGender = 'female';
  else if (gender === 'female') state.targetGender = 'male';
  else                          state.targetGender = 'any';
}

function resolveResultGender() {
  if (state.targetGender === 'any') {
    return Math.random() < 0.5 ? 'male' : 'female';
  }
  return state.targetGender;
}

// ── 4. ANSWER HANDLER ────────────────────────────────────────
//
//  Weighted scoring:
//    Q1–Q(n-1)  →  +1 pt  (normal signal)
//    Q(n) last  →  +2 pt  (tiebreaker weight)
//
//  เหตุผล: ด้วย 5 คำถาม 4 ตัวเลือก การให้ +1 ทุกข้อ
//  มีโอกาสสูงที่จะ tie แล้วต้อง random ทำให้ผู้เล่นรู้สึก
//  ว่าผลสุ่ม ไม่แม่น ข้อสุดท้าย +2 ทำให้แทบทุก path
//  มีผู้ชนะชัดเจนโดยไม่ต้องสุ่ม

function pickAnswer(source, value) {
  if (source === 'house') {
    const total    = QUESTIONS.house.length;           // 5
    const isLast   = state.currentQ === total - 1;
    const pts      = isLast ? 2 : 1;

    state.houseScores[value] += pts;
    state.lastHouseAnswer     = value;
    state.currentQ++;

    if (state.currentQ >= total) {
      showView('bento');   // calcHouse จะถูกเรียกใน onBentoContinue
    } else {
      loadQuestion();
    }

  } else if (source === 'yokai') {
    const pool     = QUESTIONS.yokai[state.winningHouse];
    const total    = pool.length;                      // 5
    const isLast   = state.currentQ === total - 1;
    const pts      = isLast ? 2 : 1;

    state.yokaiScores[value] += pts;
    state.lastYokaiAnswer     = value;
    state.currentQ++;

    if (state.currentQ >= total) {
      calcYokai();
    } else {
      loadQuestion();
    }
  }
}

// ── 5. CALC HOUSE ────────────────────────────────────────────

function calcHouse() {
  const scores = state.houseScores;
  let max  = -1;
  let ties = [];

  for (const [house, score] of Object.entries(scores)) {
    if (score > max)       { max = score; ties = [house]; }
    else if (score === max) { ties.push(house); }
  }

  let winner;
  if (ties.length === 1) {
    winner = ties[0];
  } else if (ties.includes(state.lastHouseAnswer)) {
    // Q5 (+2 pts) ทำให้ path นี้เกิดน้อยมาก แต่ถ้าเกิดให้ Q5 ตัดสิน
    winner = state.lastHouseAnswer;
  } else {
    winner = ties[Math.floor(Math.random() * ties.length)];
  }

  state.winningHouse = winner;
  loadStage2(winner);
  return winner;
}

// ── 6. LOAD STAGE 2 ──────────────────────────────────────────

function loadStage2(house) {
  state.yokaiPool   = [...HOUSE_POOLS[house]];
  state.yokaiScores = {};
  for (const name of state.yokaiPool) {
    state.yokaiScores[name] = 0;
  }
  state.stage    = 2;
  state.currentQ = 0;   // bento pop-up = Q แรก (index 0)
}

// ── 7. BENTO CONTINUE ────────────────────────────────────────

function onBentoContinue() {
  calcHouse();          // คำนวณบ้าน → loadStage2 ถูกเรียกใน calcHouse
  showBentoQuestion();
}

// ── 8. CALC YOKAI ────────────────────────────────────────────

function calcYokai() {
  const scores = state.yokaiScores;
  let max  = -1;
  let ties = [];

  for (const [yokai, score] of Object.entries(scores)) {
    if (score > max)       { max = score; ties = [yokai]; }
    else if (score === max) { ties.push(yokai); }
  }

  let winner;
  if (ties.length === 1) {
    winner = ties[0];
  } else if (ties.includes(state.lastYokaiAnswer)) {
    winner = state.lastYokaiAnswer;
  } else {
    winner = ties[Math.floor(Math.random() * ties.length)];
  }

  state.winningYokai      = winner;
  state.resultGenderShown = resolveResultGender();
  showView('loading');
}

// ── 9. RESULT HELPERS ────────────────────────────────────────

function getResult() {
  const yokai  = YOKAI_DATA[state.winningYokai];
  const gender = state.resultGenderShown;
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

// ── 10. RESET ────────────────────────────────────────────────

function resetGame() {
  state = createInitialState();
  showView('landing');
}

// ── 11. REFRESH GUARD ────────────────────────────────────────

function guardState(requiredStage) {
  if (requiredStage === 2 && !state.winningHouse) {
    console.warn('[Ryokan] State lost — redirecting to landing');
    resetGame();
    return false;
  }
  return true;
}

// ── 12. DEBUG (ลบออกก่อน production) ────────────────────────

function debugScores() {
  console.group('[Ryokan] Current Scores');
  console.log('House:',         state.houseScores);
  console.log('Winning House:',  state.winningHouse);
  console.log('Yokai:',         state.yokaiScores);
  console.log('Winning Yokai:',  state.winningYokai);
  console.log('Gender shown:',   state.resultGenderShown);
  console.groupEnd();
}
