// ============================================================
//  thai-break.js — Ryokan of The Spirits
//  Thai line breaking (pure, no DOM) — DESIGN_SYSTEM.md "Thai Line Breaking"
//  Browsers wrap Thai at every small ICU word ("เรียว|กัง"), so text is pre-split here:
//    1. the space between phrases is the preferred break
//    2. a phrase of ≤ PHRASE_KEEP graphemes never breaks inside
//    3. a longer phrase breaks only between units = ICU words joined by KEEP / NO_START / NO_END
//  แก้ได้: KEEP / NO_START / NO_END — ตัวสะกดต้องตรงกับข้อความในเกมทุกตัว (หาแบบตรงตัว)
//  index.html: thaiBreakable(text) แปลง token เป็น DOM
// ============================================================

const THAI_BREAK = {
  PHRASE_KEEP: 14,

  // never split inside these (matched as exact substrings; overlapping matches merge)
  KEEP: [
    'เรียวกัง','คืนพายุ','ใจหายวาบ','ไม่เคย','ห้านาที','เปาะแปะ','ทีละ','ทีละช่วง','ทีละซุ้ม',
    'ฟ้าครึ้ม','กลิ่นฝน','รับแขก','แขนเสื้อ','ของติดตัว','ชิ้นหนึ่ง','หายไป','คืออะไร',
    'กระดิ่งเล็ก','ทุกครั้ง','ห้องไหน','เรียกหา','ตั้งแต่เด็ก','ห่างตัว','สักวัน',
    'นาฬิกาพก','เวลาจริง','เล่มเล็ก','ตามหา','ฝนเม็ดแรก',
    'ประตูหน้า','ทุบรัว','แขกภูต','หนีพายุ','เข้ามา','พร้อมกัน','ไม่มีที่ยืน','ตนสุดท้าย','หายเข้าไป',
    'ข้างใน','ข้างนอก','เสียที','โถงทางเข้า','หอบหายใจ','คุณเอง','มองค้าง','ค้างไว้',
    'บานประตู','ชาร้อน','เต็มถาด','ไม่มีใคร','สักถ้วย',
    'พื้นไม้','มืดวูบ','แตกตื่น','ชั้นบน','สี่ดวง','ดวงไหน','กันลม','ไม่มาก',
    'ดวงใหญ่','ค่อนข้าง','ส่องสว่าง','ทุกตน','ทางเดิน','โคมกระดาษ','ประจำตัว','ว่าที่นี่',
    'ตะเกียงเก่า','คนเดียว','ทุกคืน',
    'ดวงไฟ','ลั่นเอี๊ยด','ทุกก้าว','สุดทาง','ไม่ควร','เงี่ยหูฟัง','ฟังไปฟังมา',
    'เสียงฮัม','ทำนองเพลง','ฟ้าสาง',
    'เอื้อมมือ','ว่างเปล่า','แสงไฟ','สั่นไหว','เมื่อไร','ก็ไม่รู้',
    'ออกเดินทาง','ยังไม่สาง','ตนหนึ่ง','ยามเช้า','มองไม่ชัด','สิ่งเดียว','จำได้','อย่างหนึ่ง','อยู่ต่อ',
    'เท้าเปล่า','แอ่งน้ำ','ด้วยกัน','อ่านหนังสือ','ตัวเอง','อย่างประหลาด',
    'เรื่องเล็กๆ','เมื่อคืน','นึกว่า','สังเกตเห็น',
    'วันแรก','แดดแรก','แสงเช้า','พร่าเลือน','พัดผ่าน',
    'เห็นหน้ากัน','ไม่เป็นไร','ที่จริง','ไม่อยาก','กันแน่','ไม่ตอบ','ลอยค้าง','ไอหมอก',
    'อีกสักหน่อย','คืนเดือนเต็ม',
    'ข้าวกล่อง','สักกล่อง','ทั้งที่','แบบไหน',
    'กะไว้','ในใจ','ลงไป','ทุกอย่าง','คิดไว้','จับคู่','เข้ากัน',
    'เช้ามืด','อย่างแรก','ตอนตื่น','น่ากิน','ตอนนั้น',
    'ไข่ม้วน','หน้ายิ้ม','ยิ้มตาม','เต็มที่',
    'นานแค่ไหน','แค่ไหน','วันที่สาม',
    'วันเวลา','ช้าลง','เหมือนเดิม',
    'สะพานไม้','ช่วยกัน','ทั้งคู่','แผ่นเดียวกัน','ต่างคนต่าง','ชักมือ','หลุดหัวเราะ','ออกมา',
    'จากนั้น','ใกล้มือ','แผ่นไหน','แผ่นนั้น','จังหวะเดียว',
    'ทรงใหม่','แข็งแรง','ของเดิม','ตั้งเป้า','ตะวันตกดิน','ทันพอดี',
    'กลับมาทอด','อีกครั้ง',
    'ยกให้','ตนแรก','เดินข้าม','หัวสะพาน',
    'เดินกลับ','ทุกแผ่น','ไม่ยวบ','สักแผ่น','แน่นหนา',
    'หินก้อนเล็ก','ปลายสะพาน','เลือกเอง',
    'ขอบสะพาน','ช่วงกลาง','คำตอบ','ร้องอ๋อ',
    'ฝนตก','ตุ๊กตาไล่ฝน','สะพานใหม่','วันคืน','เต็มขึ้น',
    'คืนหนึ่ง','ไม่ยอมหยุด','ใต้ชายคา','พรุ่งนี้','เทศกาลโคม','แบบนี้','ไม่ได้จัด','ผ้าขาว',
    'ไม่ซ้ำกัน','สักตัว','หน้าใหม่','ไม่มีหมด',
    'ทุกห้อง','ห้องละตัว','ฟ้าเปิด',
    'ทำตัวแรก','สวยเป๊ะ','เท่ากัน',
    'พันผ้า','ตามมือ','ไปเลย','ดึงหน่อย','ยื่นให้','ตรงไหน',
    'รอบชายคา','ทุกทิศ','ทางไหน','โดนไล่','เทศกาลแน่',
    'หน้าที่นั่ง','มุมโปรด','ตรงนั้น','ที่แรก',
    'ฝนสาด','หันหน้า','สู้ฝน','เผชิญหน้า',
    'คืนฝน','รู้สึก','ออกไป','ตามนั้น','นึกย้อน','คล้ายกัน',
    'คุยกัน','ไม่รู้ตัว',
    'รุ่งเช้า','ตามกำหนด','ตกค่ำ','เต็มดวง','ยื่นมือ',
    'ทั้งปี','คนอื่น','มาตลอด','คืนนี้',
    'ทำตัวไม่ถูก','มาก่อน',
    'สองมือ','มาถึง','ปากทาง','ถนนสายโคม',
    'เคียงข้าง','ตักปลาทอง','ซุ้มแรก','วิธีเล่น',
    'สักครู่','ทั่วทั้งถนน','ซุ้มไหน','ทุกซุ้ม','บอกมา',
    'ใกล้เลิก','แสงโคม','นับร้อย','ขนมย่าง','รอบตัว','คืนนั้น',
    'ทุกสิ่ง','คำเดียว','ดวงสุดท้าย',
    'เกี่ยวกับ','ไม่หยุด','พบกัน','สักคำ',
    'โอบร่าง','เงาราง','ได้ที่ฝ่ามือ','เบาหวิว','ทุกเมื่อ',
    'ชื่อหนึ่ง','ดังก้อง','ตัดสินใจ',
    'ขึ้นมา','ตื่นเต้น','ของจริง','เคยอ่าน',
    'เก้าทาง','ทางเดียว','จบเรื่อง','เข้าคู่',
    'ทั้งคืน','เมื่อไหร่','กลับมา',
    'ตุ๊กตาหิมะ','คำแรก','เสียงแหบ',
    'วงรำ','เปิดงาน','ฮ่าๆๆ','ตั้งเยอะ',
    'นิ่งคิด','เสียงดัง','ทีหลัง','ทุกคำ',
    'หน้าเศร้า','ทีไร',
    'ข้างเดียว','ลงเขา',
    'ตรงหน้า','กินเกลี้ยง','เหมือนกัน',
    'แมวปีศาจ','สองหาง',
    'ไว้ก่อน','เข็มนาฬิกา','ใช้ไม่ได้','ถอยไป','นิดหน่อย','ปล่อยไว้','หลายครั้ง','สองคน','สักชิ้น','ใช้ได้จริง',
    'หาววว',
    'พวกนั้น','ช่างมัน','แค่นี้','ก็พอ',
    'โคมนั่น','แมวคาบโคม',
    'ขยำทิ้ง','แผ่นหนึ่ง','แผ่นนี้',
    'ไม่เป๊ะ','ไม่ต้อง','เบาะเย็บ',
    'ไม่เป็น','ก็ได้ออกไป','ตากแดด',
    'เพราะอะไร','แบบนั้น','ไม่หลุด',
    'หยุดพัด','ใบไม้','ลงมา',
    // round 2 — from the rendered line-break report
    'ระเกะระกะ','กองพะเนิน','แขกทุกตน','ฝากไว้','คู่ไหน','วางตรง','สักคู่',
    'พรูเข้ามา','แขกตนสุดท้าย','ปิดลง','ดันประตู','ลมกระแทก',
    'แขกจะเห็น','นั่งคนเดียว','เดินตรวจ','ห้องสุดทาง',
    'แขกตนหนึ่ง','หมอกยามเช้า','คุณออกมา','แอ่งน้ำฝน',
    'ทีละใบ','ทีละภาพ','ทีละดวง','เป็นธรรมชาติ',
    'ให้เขา','ให้ข้า','ให้ครบ','ให้หายไป',
    'กล่องเดียวกัน','เป็นอย่างแรก','ในครัว','ลองแกะ',
    'เจอแผ่นไหน','ไล่ปิด','ได้เดินข้าม','ตามเขา','ได้อย่างไร','ชวนกันเดา',
    'หยิบผ้าขาว','นึกหน้าใหม่','ได้ลุ้น','บิดนิด','ฝนมาทางไหน',
    'พูดออกไป','เล่ากลับไป','เคียงข้างเขา','เจอซุ้ม','มองโคม',
    'เงียบงัน','ลอดผ่าน','เกี่ยวกับเขา',
    'เหลือเพียง','ได้ง่ายๆ','เขามองมัน','อย่างน้อย',
    'เสียงหัวเราะ','กว่าที่คิด','ได้ทุกเมื่อ','คุณตัดสินใจ',
    'พักได้','เห็นงาน','งานในเรือน','ใหม่หมด','คิดไปพูดไป','เจ้าจะหลับ',
    'เมื่อคุณพร้อม','คุณสองคน','จำแม่น','มานั่ง','เดินเร็ว','เขี่ยเข็ม',
    'ออกท่าออกทาง','รอบข้าง',
    'เสียงฝีเท้า','หน้าของเขา','คิดอะไร','หมอกในลาน','ใส่ลงไปก่อน','ให้สวย','พังลงไป'
  ],

  // a line never starts with these — they stick to the word before (particles, directional ไป/มา)
  NO_START: [
    'ๆ','ฯ','?','!','…',
    'หรอก','ไหม','นะ','น่ะ','ล่ะ','เลย','สิ','ซิ','ด้วย','บ้าง','หน่อย','เอง',
    'จ๊ะ','จ้ะ','จ้า','เถอะ','เถิด','หรือเปล่า',
    'ไป','มา','ที่สุด','กัน'
  ],

  // a line never ends with these — they stick to the word after (conjunctions/prepositions start the next line)
  NO_END: [
    'ไม่','จะ','อย่า','ทีละ','แทบ','ค่อย','ต้อง','เพิ่ง','คง','ทุก','สัก','แค่','เพียง','ราว','ทั้ง','อยาก','เคย',
    'แต่','และ','จาก','บน','ใน','กับ','ของ','โดย','เหนือ','ราวกับ',
    'ตั้งแต่','จึง','ถ้า','เผื่อ','มัก','ก็','ยัง','จน','คือ','เป็น','แล้ว','ที่','ไม่มี','อย่าง'
  ]
};

const THAI_CHAR_RE    = /[฀-๿]/;
const GLUE_BACK_RE    = /^[ฯๆ…?!,.)\]”’]/;   // closing marks stick to the word before
const GLUE_FORWARD_RE = /[(\[“‘]$/;          // opening marks stick to the word after

const _graphemeSegmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
const _wordSegmenter     = new Intl.Segmenter('th', { granularity: 'word' });

function toGraphemes(text) {
  // Thai vowels/tone marks stay attached to their consonant
  return [..._graphemeSegmenter.segment(text)].map(s => s.segment);
}

// text → tokens: units (never wrap inside), ' ' (phrase gap), '\n'. Adjacent units may wrap between them.
function thaiTokens(text) {
  const tokens = [];
  for (const part of text.split(/(\n| +)/)) {
    if (!part) continue;
    if (part === '\n')         tokens.push('\n');
    else if (/^ +$/.test(part)) tokens.push(' ');
    else if (gluesAcrossSpace(tokens, part)) { tokens.pop(); tokens[tokens.length - 1] += ' ' + part; }
    else                        tokens.push(...phraseUnits(part));
  }
  return tokens;
}

// A lone NO_START particle after a space ("ง่ายๆ หรอก") must not start a line — it joins the unit before, space and all
function gluesAcrossSpace(tokens, phrase) {
  const prev = tokens[tokens.length - 2];
  return tokens[tokens.length - 1] === ' ' && prev !== undefined && prev !== '\n' &&
    THAI_BREAK.NO_START.includes(phrase.replace(/["“”‘’'.,…!?]/g, ''));
}

// Two passes: (1) ICU words → words joined by KEEP + punctuation, (2) join those by NO_START / NO_END.
// Pass 2 compares whole pass-1 words, so "ที|ละ" matches NO_END "ทีละ" and "ชั้นบน" never matches "บน".
function phraseUnits(phrase) {
  if (!THAI_CHAR_RE.test(phrase) || toGraphemes(phrase).length <= THAI_BREAK.PHRASE_KEEP) return [phrase];
  const icuWords = [..._wordSegmenter.segment(phrase)].map(s => s.segment);
  const keep     = keepRanges(phrase);
  let offset     = 0;
  const words    = joinWhere(icuWords, (prev, next, k) => {
    offset += icuWords[k - 1].length;
    return insideKeep(keep, offset) || gluedByPunctuation(icuWords, k);
  });
  return joinWhere(words, (prev, next) =>
    THAI_BREAK.NO_START.includes(next) || THAI_BREAK.NO_END.includes(prev));
}

// Joins list[k] onto the item before it wherever mustJoin(list[k-1], list[k], k) is true
function joinWhere(list, mustJoin) {
  const out = [list[0]];
  for (let k = 1; k < list.length; k++) {
    if (mustJoin(list[k - 1], list[k], k)) out[out.length - 1] += list[k];
    else out.push(list[k]);
  }
  return out;
}

function insideKeep(keep, offset) {
  return keep.some(([start, end]) => start < offset && offset < end);
}

// Closing marks stick to the word before, opening marks to the word after.
// Straight quotes open and close with the same mark — odd count before = closing quote.
function gluedByPunctuation(words, k) {
  const prev = words[k - 1], next = words[k];
  if (GLUE_BACK_RE.test(next) || GLUE_FORWARD_RE.test(prev)) return true;
  if (next === '"' && quotesBefore(words, k) % 2 === 1)      return true;
  if (prev === '"' && quotesBefore(words, k - 1) % 2 === 0)  return true;
  return false;
}

function quotesBefore(words, k) {
  return words.slice(0, k).filter(w => w === '"').length;
}

function keepRanges(phrase) {
  const ranges = [];
  for (const word of THAI_BREAK.KEEP) {
    for (let i = phrase.indexOf(word); i !== -1; i = phrase.indexOf(word, i + 1)) ranges.push([i, i + word.length]);
  }
  return ranges;
}

// Fail fast: a list entry with a space can never match (phrases are split on spaces)
function validateThaiBreak() {
  for (const list of ['KEEP', 'NO_START', 'NO_END']) {
    for (const entry of THAI_BREAK[list]) {
      if (typeof entry !== 'string' || !entry || /\s/.test(entry)) {
        throw new Error(`[Ryokan] THAI_BREAK.${list}: invalid entry ${JSON.stringify(entry)}`);
      }
    }
  }
}
