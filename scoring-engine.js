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

// Narration page = string, or array of strings / { reply: [2+ strings] } / { slow: [1+ phrases], breath? } / { say, auto }
function validateNarration(where, pages) {
  if (!Array.isArray(pages)) throw new Error(`[Ryokan] ${where}: narration must be an array of pages`);
  for (const page of pages) {
    if (typeof page === 'string') continue;
    if (!Array.isArray(page)) throw new Error(`[Ryokan] ${where}: page must be a string or an array`);
    for (const line of page) {
      if (typeof line === 'string') continue;
      if (line && Array.isArray(line.reply) && line.reply.length >= 2) continue;
      if (line && Array.isArray(line.slow) && line.slow.length >= 1) continue;
      if (line && typeof line.say === 'string' && line.auto === true) continue;
      throw new Error(`[Ryokan] ${where}: line must be a string, { reply: [2+ options] } or { slow: [1+ phrases] } or { say, auto: true }`);
    }
  }
}

function validateQuestions() {
  const { house, yokai, outro, chapters } = QUESTIONS;
  for (const key of ['house', 'yokai']) {
    const c = chapters && chapters[key];
    if (!c || !c.number || !c.title) throw new Error(`[Ryokan] QUESTIONS.chapters.${key} needs number and title`);
  }
  [...house, ...yokai].forEach(q => validateNarration(q.id + '.lead', q.lead));
  validateNarration('outro', outro);
  validateNarration('bento.afterArrange', yokai[0].afterArrange);
  if (house.length !== 5) throw new Error('[Ryokan] QUESTIONS.house must have 5 questions');
  if (yokai.length !== 6) throw new Error('[Ryokan] QUESTIONS.yokai must have 6 questions');
  if (!outro.length)      throw new Error('[Ryokan] QUESTIONS.outro is empty');

  for (const q of house) {
    if (q.doors !== undefined && q.doors !== true) throw new Error(`[Ryokan] ${q.id}: doors must be true or absent`);
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

// เนื้อหาหน้า result ต่อ Yokai: null = ยังไม่เขียน · ถ้ามี object ต้องครบทุก key (DATA_SCHEMA §3)
const isText = v => typeof v === 'string' && v !== '';
const hasTexts = (obj, keys) => !!obj && keys.every(k => isText(obj[k]));

function validateYokaiData() {
  for (const [name, y] of Object.entries(YOKAI_DATA)) {
    const fail = msg => { throw new Error(`[Ryokan] YOKAI_DATA.${name}.${msg}`); };
    if (!isText(y.kanji)) fail('kanji must be text');
    if (!y.match || !Array.isArray(y.match.good) || y.match.good.length !== 2 || !y.match.good.every(isText) || !isText(y.match.adjust)) {
      fail('match needs good: [2 labels] + adjust sentence');
    }
    if (!isText(y.almost)) fail('almost must be text (line on the "คู่ที่เกือบได้" card)');
    validateAlikeFns(name, y.mbti);
    if (y.why !== null && !isText(y.why)) fail('why must be text (or null)');
    if (y.whyLead !== null && (!isText(y.whyLead) || y.why === null)) fail('whyLead must be text and needs why (or null)');
    if (y.life !== null && !hasTexts(y.life, ['lead', 'gain', 'clash', 'more'])) fail('life needs lead/gain/clash/more (or null)');
    if (y.lines !== null) {
      const ok = hasTexts(y.lines, ['poke1', 'chat1', 'chat2', 'poke2']) && hasTexts(y.lines.mist, Object.keys(HOUSE_POOLS));
      if (!ok) fail('lines needs poke1/chat1/chat2/poke2 + mist for all 4 houses (or null)');
    }
  }
}

// การ์ด "เหมือนกันตรงไหน" นับได้ก็ต่อเมื่อทุกข้อที่ Yokai ตัวนี้เจอ มีช้อยขั้วเดียวกับมันที่เป็น function ของมันพอดี 1 ตัว
function validateAlikeFns(name, mbti) {
  const house = Object.keys(HOUSE_POOLS).find(h => HOUSE_POOLS[h].includes(name));
  QUESTIONS.yokai.forEach(q => {
    const axis = q.axis || HOUSE_AXIS[house];
    const choices = q.axis ? q.choices : q.sets[axis].choices;
    const fn = yokaiFn(mbti, axis);
    const hits = choices.filter(c => c.pole === yokaiLetter(mbti, axis) && c.fn === fn).length;
    if (hits !== 1) throw new Error(`[Ryokan] ${q.id} ${axis}: ${name} (${mbti}) needs exactly one '${yokaiLetter(mbti, axis)}' choice with fn ${fn}`);
  });
}

// การ์ด "ใจของคุณเป็นแบบไหน?" — ระดับบ้าน ต้องครบทั้ง 4 บ้าน
function validateHouseHeart() {
  for (const house of Object.keys(HOUSE_POOLS)) {
    const h = HOUSE_HEART[house];
    if (!hasTexts(h, ['lead', 'invite']) || !Array.isArray(h.more) || !h.more.length || !h.more.every(isText)) {
      throw new Error(`[Ryokan] HOUSE_HEART.${house} needs lead, invite and more[1+]`);
    }
  }
}

// ── 7. RESULT HELPERS ────────────────────────────────────────

function getResult() {
  const yokai  = YOKAI_DATA[state.winningYokai];
  const gender = state.resultGenderShown;
  return {
    name:     yokai.name,
    kanji:    yokai.kanji,
    mbti:     yokai.mbti,
    house:    yokai.house,
    title:    yokai.title,
    image:    yokai[gender].image,
    match:    yokai.match,                            // ความเข้ากัน: good = 2 เรื่องที่เข้ากันดี · adjust = ประโยคเรื่องที่ต้องค่อยๆ ปรับ
    heart:    HOUSE_HEART[yokai.house],
    why:      yokai.why,                              // null = ยังไม่เขียน
    whyLead:  yokai.whyLead,
    life:     yokai.life,
    lines:    yokai.lines,
    mist:     state.houseAnswers[4],                  // บ้านของช้อย E5 → ประโยคพิเศษของบับเบิ้ล
    alike:    getAlike(yokai.mbti),
    nearMiss: getNearMiss(yokai.mbti)
  };
}

function countPole(axis, pole) {
  return state.stage2Answers.filter(a => a.axis === axis && a.pole === pole).length;
}

// 'ENTP', 'JP' → 'P'
function yokaiLetter(mbti, axis) {
  return [...mbti].find(ch => axis.includes(ch));
}

// แต่ละขั้วมีช้อย 2 ตัวคนละ function — ตัวที่ตรงกับ Yokai หาได้จาก MBTI (ไม่ต้องเก็บใน YOKAI_DATA)
// JP: function ที่หันออกนอกของขั้วนั้น (J → Te/Fe · P → Ne/Se) · TF: J ใช้ Te/Fe, P ใช้ Ti/Fi
// EI: dominant — E+J = Je · E+P = Pe · I+J = Pi · I+P = Ji
function yokaiFn(mbti, axis) {
  const has = ch => mbti.includes(ch);
  if (axis === 'JP') return has('J') ? (has('T') ? 'Te' : 'Fe') : (has('N') ? 'Ne' : 'Se');
  if (axis === 'TF') return (has('T') ? 'T' : 'F') + (has('J') ? 'e' : 'i');
  if (axis === 'EI') return has('E') ? (has('J') ? 'Je' : 'Pe') : (has('J') ? 'Pi' : 'Ji');
  throw new Error(`[Ryokan] yokaiFn: unknown axis ${axis}`);
}

// "เหมือนกันตรงไหน" — 2 แกนที่วัดใน Stage 2: ผู้เล่นเลือกช้อยที่คิดแบบเดียวกับ Yokai กี่ใน 3 ข้อ
// function ตรงกัน 0 ข้อ → โชว์ขั้วแทน (เสียงข้างมาก = ตรงกับ Yokai ≥2 ข้อเสมอ) · ทุกแถวจึงเป็นสิ่งที่เหมือนกันจริง count 1–3
// ไม่มีผลกับการเลือก Yokai
function getAlike(mbti) {
  return ['EI', HOUSE_AXIS[state.winningHouse]].map(axis => {
    const fn = yokaiFn(mbti, axis);
    const count = state.stage2Answers.filter(a => a.axis === axis && a.fn === fn).length;
    if (count) return { key: fn, count };
    const pole = yokaiLetter(mbti, axis);
    return { key: pole, count: countPole(axis, pole) };
  });
}

// "คู่ที่เกือบได้" — แกนที่ชนะ 2-1: อีกข้อเดียวเอนไปขั้วตรงข้าม ก็ได้อีกตัวในบ้านเดียวกัน
// ลำดับ: แกนที่ 2 ของบ้าน แล้ว E/I · ชนะขาด 3-0 ทั้งสองแกน = null (ไม่มีใครเฉียด)
function getNearMiss(mbti) {
  const axis = [HOUSE_AXIS[state.winningHouse], 'EI'].find(a => countPole(a, yokaiLetter(mbti, a)) === 2);
  if (!axis) return null;
  const won  = yokaiLetter(mbti, axis);
  const pole = axis.replace(won, '');
  const name = state.yokaiPool.find(n => YOKAI_DATA[n].mbti === mbti.replace(won, pole));
  if (!name) throw new Error(`[Ryokan] getNearMiss: no ${mbti.replace(won, pole)} in ${state.winningHouse}`);
  return { name, pole };
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
  console.log('Gender shown:',   state.resultGenderShown);  console.groupEnd();
}
