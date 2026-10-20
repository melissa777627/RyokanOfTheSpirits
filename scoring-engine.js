// ============================================================
//  scoring-engine.js — Ryokan of The Spirits
//  State + scoring only. ฟังก์ชันที่ไปต่อ view (showView, loadQuestion ฯลฯ)
//  อยู่ใน index.html — ยกเว้น toggleResultGender / resetGame ที่เรียก UI ตรงๆ
//  Spec → DATA_SCHEMA.md §5
// ============================================================

// ── 1. CONSTANTS ────────────────────────────────────────────

const HOUSE_POOLS = {
  purple: ['Tenjin',    'Yumekui',  'Ryuu',     'Kitsune' ],
  green:  ['Shinigami', 'Yukionna', 'Oni',      'Tanuki'  ],
  blue:   ['Tengu',     'Ningyo',   'Jorogumo', 'Inugami' ],
  yellow: ['Nekomata',  'Hebi',     'Raijin',   'Fuujin'  ]
};

// Stage 1: บ้านหลัก +2 · บ้านสำรอง +1
const SECONDARY_HOUSE = { purple: 'blue', blue: 'purple', green: 'yellow', yellow: 'green' };

// Stage 2: แกนที่ 2 ที่บ้านยังไม่ล็อก
const HOUSE_AXIS = { purple: 'JP', green: 'JP', blue: 'TF', yellow: 'TF' };

// ตัวอักษรที่บ้านล็อกไว้: ? = E/I · _ = แกนที่ 2
const HOUSE_MBTI_TEMPLATE = { purple: '?NT_', green: '?NF_', blue: '?S_J', yellow: '?S_P' };

// ── 2. STATE ─────────────────────────────────────────────────

function createInitialState() {
  return {
    playerGender:      '',
    targetGender:      '',
    resultGenderShown: '',

    houseScores:  { purple: 0, green: 0, blue: 0, yellow: 0 },
    houseAnswers: [],
    winningHouse: '',

    yokaiPool:     [],
    stage2Answers: [],
    winningYokai:  '',

    stage:         1,
    currentQ:      0,
    bentoSelected: [],
    dollImage:     ''
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

// ── 4. STAGE 1 · HOUSE ───────────────────────────────────────

function pickHouseAnswer(house) {
  state.houseScores[house]                  += 2;
  state.houseScores[SECONDARY_HOUSE[house]] += 1;
  state.houseAnswers.push(house);
  state.currentQ++;
}

function calcHouse() {
  const scores = state.houseScores;
  const max    = Math.max(...Object.values(scores));
  let   ties   = Object.keys(scores).filter(h => scores[h] === max);

  // Tie-break 1: บ้านที่ถูกเลือกเป็นบ้านหลักบ่อยที่สุด
  if (ties.length > 1) {
    const count = h => state.houseAnswers.filter(a => a === h).length;
    const top   = Math.max(...ties.map(count));
    ties = ties.filter(h => count(h) === top);
  }

  // Tie-break 2: ไล่ย้อนจาก E5 หาบ้านหลักล่าสุดที่อยู่ใน ties
  let winner = ties[0];
  if (ties.length > 1) {
    winner = [...state.houseAnswers].reverse().find(h => ties.includes(h));
  }
  if (!winner) {
    throw new Error('[Ryokan] calcHouse: unresolved tie ' + JSON.stringify(scores));
  }

  state.winningHouse = winner;
  loadStage2(winner);
  return winner;
}

// ── 5. STAGE 2 · YOKAI ───────────────────────────────────────

function loadStage2(house) {
  state.yokaiPool     = [...HOUSE_POOLS[house]];
  state.stage2Answers = [];
  state.stage         = 2;
  state.currentQ      = 0;   // 0 = Bento
}

// ช้อยที่ผู้เล่นเห็นในข้อนั้น: ชุด JP/TF ตามบ้าน หรือชุด EI
function getStage2Set(q) {
  if (q.axis === 'EI') return { axis: 'EI', prompt: q.prompt, choices: q.choices };
  const axis = HOUSE_AXIS[state.winningHouse];
  return { axis, prompt: q.sets[axis].prompt, choices: q.sets[axis].choices };
}

function pickYokaiAnswer(q, choice) {
  const { axis } = getStage2Set(q);
  state.stage2Answers.push({ qid: q.id, axis, pole: choice.pole, fn: choice.fn });
  state.currentQ++;
}

function majorityPole(axis) {
  const votes = state.stage2Answers.filter(a => a.axis === axis);
  if (votes.length !== 3) {
    throw new Error(`[Ryokan] axis ${axis} has ${votes.length} votes, expected 3`);
  }
  const [a, b] = axis.split('');
  return votes.filter(v => v.pole === a).length >= 2 ? a : b;
}

function calcYokai() {
  const house  = state.winningHouse;
  const mbti   = HOUSE_MBTI_TEMPLATE[house]
                   .replace('?', majorityPole('EI'))
                   .replace('_', majorityPole(HOUSE_AXIS[house]));
  const winner = state.yokaiPool.find(name => YOKAI_DATA[name].mbti === mbti);
  if (!winner) {
    throw new Error(`[Ryokan] calcYokai: no yokai with ${mbti} in ${house}`);
  }

  state.winningYokai      = winner;
  state.resultGenderShown = resolveResultGender();
  return winner;
}

// ── 6. QUESTION BANK CHECK ───────────────────────────────────
//  กฎตาม DATA_SCHEMA.md §4 — เรียกครั้งเดียวตอนโหลดหน้า

function validateChoiceSet(id, axis, choices) {
  const [a, b] = axis.split('');
  const count  = p => choices.filter(c => c.pole === p).length;
  if (choices.length !== 4 || count(a) !== 2 || count(b) !== 2) {
    throw new Error(`[Ryokan] ${id} ${axis}: need 2 '${a}' + 2 '${b}' choices`);
  }
}

// Narration page = string, or array of strings / { reply: [2+ strings] }
function validateNarration(where, pages) {
  if (!Array.isArray(pages)) throw new Error(`[Ryokan] ${where}: narration must be an array of pages`);
  for (const page of pages) {
    if (typeof page === 'string') continue;
    if (!Array.isArray(page)) throw new Error(`[Ryokan] ${where}: page must be a string or an array`);
    for (const line of page) {
      if (typeof line === 'string') continue;
      if (!line || !Array.isArray(line.reply) || line.reply.length < 2) {
        throw new Error(`[Ryokan] ${where}: line must be a string or { reply: [2+ options] }`);
      }
    }
  }
}

function validateQuestions() {
  const { house, yokai, outro } = QUESTIONS;
  [...house, ...yokai].forEach(q => validateNarration(q.id + '.lead', q.lead));
  validateNarration('outro', outro);
  if (house.length !== 5) throw new Error('[Ryokan] QUESTIONS.house must have 5 questions');
  if (yokai.length !== 6) throw new Error('[Ryokan] QUESTIONS.yokai must have 6 questions');
  if (!outro.length)      throw new Error('[Ryokan] QUESTIONS.outro is empty');

  for (const q of house) {
    const houses = q.choices.map(c => c.house).sort().join(',');
    if (houses !== 'blue,green,purple,yellow') {
      throw new Error(`[Ryokan] ${q.id}: choices must cover all 4 houses once`);
    }
  }

  yokai.forEach((q, i) => {
    if (i < 3) {
      if (!q.sets || !q.sets.JP || !q.sets.TF) throw new Error(`[Ryokan] ${q.id}: needs sets.JP and sets.TF`);
      validateChoiceSet(q.id, 'JP', q.sets.JP.choices);
      validateChoiceSet(q.id, 'TF', q.sets.TF.choices);
      if (q.doll) {
        const ok = v => v === 'before' || v === 'after';
        if (!ok(q.doll.JP) || !ok(q.doll.TF)) throw new Error(`[Ryokan] ${q.id}: doll needs JP/TF = 'before' | 'after'`);
      }
    } else {
      if (q.axis !== 'EI') throw new Error(`[Ryokan] ${q.id}: must have axis 'EI'`);
      validateChoiceSet(q.id, 'EI', q.choices);
    }
  });
}

// ── 7. RESULT HELPERS ────────────────────────────────────────

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

// ── 8. RESET ─────────────────────────────────────────────────

function resetGame() {
  state = createInitialState();
  showView('landing');
}

// ── 9. STATE GUARD (Rule 5 — fail loud, no silent reset) ─────

function guardState(requiredStage) {
  if (requiredStage === 2 && !state.winningHouse) {
    throw new Error('[Ryokan] guardState: Stage 2 view entered without winningHouse');
  }
}

// ── 10. DEBUG (ลบออกก่อน production) ────────────────────────

function debugScores() {
  console.group('[Ryokan] Current Scores');
  console.log('House:',          state.houseScores);
  console.log('House answers:',  state.houseAnswers);
  console.log('Winning House:',  state.winningHouse);
  console.log('Stage 2:',        state.stage2Answers);
  console.log('Winning Yokai:',  state.winningYokai);
  console.log('Gender shown:',   state.resultGenderShown);
  console.groupEnd();
}
