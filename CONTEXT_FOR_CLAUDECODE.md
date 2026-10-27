# CONTEXT_FOR_CLAUDECODE.md — Ryokan of The Spirits
> อ่านไฟล์นี้ก่อนทุก session. อัปเดตทุกครั้งที่มี view หรือ function ใหม่.

---

## 1. What This App Is

Mobile-first personality quiz (max-width 480px). Player = Ryokan caretaker.  
Answers questions → matched with 1 of 32 Yokai spirits (16 Yokai × 2 genders).  
Shadow-work quiz disguised as a soulmate finder. Single `index.html`, no frameworks.

---

## 2. Files That Exist Right Now

| File | Role |
|---|---|
| `index.html` | Main app — all 6 views in one file |
| `scoring-engine.js` | Pure scoring functions — no UI inside |
| `questions.js` | Question bank — 5 house + 6 yokai questions (Stage 2 shared, 2 choice sets on Bento/E6/E7) + narration |
| `thai-break.js` | Thai line breaking — pure (no DOM): `THAI_BREAK` lists (KEEP / NO_START / NO_END), `thaiTokens()`, `toGraphemes()`, `validateThaiBreak()` (called at load). Loaded before the index.html script |
| `DESIGN_SYSTEM.md` | Colors, typography, component rules |
| `DATA_SCHEMA.md` | State object, YOKAI_DATA structure, scoring pseudocode |
| `CLAUDE.md` | Master rules + architecture + current status |
| `assets/README.md` | Asset naming conventions + placement guide |

> `YOKAI_DATA` object lives inside `index.html` (not a separate file).

---

## 3. App Flow (6 Views)

```
view-landing → view-gender → view-quiz (Stage 1 · e1–e5)
                                   ↓  calcHouse()
                            view-bento (intro → pop-up Q → drag & drop → afterArrange)
                                   ↓
                            view-quiz (Stage 2 · e6–e10)
                                   ↓  outro → calcYokai()
                            view-loading (3.5s kanji cycle)
                                   ↓
                            view-result
```

**showView(id)** — single function that hides all views and shows the target one.  
Must call `guardState(requiredStage)` before showing quiz/bento/result.

---

## 4. Scoring Flow (Quick Reference)

```
setPlayerGender(gender)
  → targetGender = male|female|any

pickHouseAnswer(house)  × 5
  → primary +2, SECONDARY_HOUSE[house] +1, push to houseAnswers
  → after E5: calcHouse() → winningHouse → loadStage2(house) → showView('bento')

view-bento
  → showBentoQuestion()  [= getStage2Set(QUESTIONS.yokai[0]) — JP or TF by house]
  → pickYokaiAnswer(q, choice) → drag food → Continue → afterArrange → quiz E6

pickYokaiAnswer(q, choice)  × 6 total (Bento + E6–E10)
  → push { qid, axis, pole, fn } to stage2Answers
  → after E10: outro → calcYokai()
       majority of 3 per axis → HOUSE_MBTI_TEMPLATE → yokai with that mbti
     → showView('loading')

showView('result')
  → getResult() pulls YOKAI_DATA[winningYokai][resultGenderShown]
```

Full pseudocode → `DATA_SCHEMA.md` Section 5.

---

## 5. State Object (Key Fields)

```js
state.playerGender      // 'male'|'female'|'nonbinary'
state.targetGender      // 'male'|'female'|'any'
state.resultGenderShown // 'male'|'female' — togglable on result page

state.houseScores       // { purple, green, blue, yellow }
state.houseAnswers      // primary house per answer, in order — tie-break
state.winningHouse      // set by calcHouse()

state.yokaiPool         // 4 yokai names for winningHouse
state.stage2Answers     // [{ qid, axis, pole, fn }] — majority vote + functions for result
state.winningYokai      // set by calcYokai()

state.stage             // 1 | 2
state.currentQ          // 0-based index within current stage (stage 2: 0 = Bento)
state.bentoSelected     // cosmetic only — array of food emoji
```

Full state init → `scoring-engine.js` `createInitialState()`.

---

## 6. Design Tokens (Quick Reference)

```css
--primary:            #B02B2B   /* CTA, fills */
--primary-container:  #E8A0A0   /* gradient end */
--secondary:          #1B4F72   /* nav, badges */
--bg:                 #FDF6E3   /* base canvas */
--surface-low:        #F5EAD0   /* quiz areas */
--surface-lowest:     #EFE0C0   /* cards, buttons */
--on-surface:         #1A120A   /* text (never #000) */
--outline-variant:    rgba(26,18,10,0.15)
```

Fonts: **Kaisei Decol** (headers) · **M PLUS Rounded 1c** (body) · **Noto Serif JP** (kanji)  
Full rules → `DESIGN_SYSTEM.md`.

---

## 7. Asset Naming Convention

```
assets/yokai/   tenjin_m.png / tenjin_f.png  (one per yokai × gender)
assets/ui/      logo.png, seigaiha.svg, ornament_divider.svg
assets/audio/   bgm_main.mp3, sfx_click.mp3, sfx_reveal.mp3
```

Placeholder divs use `background: var(--surface-low)` until real assets arrive.  
Full guide → `assets/README.md`.

---

## 8. Functions Defined in scoring-engine.js

| Function | Purpose |
|---|---|
| `createInitialState()` | Returns fresh state object |
| `setPlayerGender(gender)` | Sets playerGender + targetGender |
| `resolveResultGender()` | Returns 'male'\|'female' for result display |
| `pickHouseAnswer(house)` | Stage 1: +2 primary / +1 secondary, records houseAnswers |
| `calcHouse()` | Computes winningHouse (tie-break: most primary picks → latest), calls loadStage2; throws if unresolved |
| `loadStage2(house)` | Resets stage 2 state, sets yokaiPool |
| `getStage2Set(q)` | Returns `{ axis, prompt, choices }` for the current house (JP/TF set or EI) |
| `pickYokaiAnswer(q, choice)` | Stage 2: records `{ qid, axis, pole, fn }` |
| `majorityPole(axis)` | Majority of 3 votes on an axis; throws if vote count ≠ 3 |
| `calcYokai()` | Builds MBTI from house template + 2 majorities, picks yokai, sets resultGenderShown; throws if none |
| `validateQuestions()` | Checks QUESTIONS shape at load (DATA_SCHEMA §4 rules); throws on violation |
| `getResult()` | Returns result data object from YOKAI_DATA + HOUSE_HEART (+ alike, nearMiss, mist key) |
| `getAlike(mbti)` | "เหมือนกันตรงไหน": `[{ key, count }]` for EI + the house's 2nd axis — how many of the 3 answers picked the yokai's own function (1–3 → `ALIKE_LEVELS`); 0 → falls to the shared pole (always ≥2) so every row is a real likeness |
| `yokaiFn(mbti, axis)` | The yokai's function on that axis, derived from MBTI (JP: J → Te/Fe, P → Ne/Se · TF: J → Te/Fe, P → Ti/Fi · EI: dominant Je/Pe/Pi/Ji) |
| `validateAlikeFns(name, mbti)` | Fail fast: every Stage 2 question the yokai can meet has exactly one choice on its pole with its function |
| `getNearMiss(mbti)` | "คู่ที่เกือบได้": first axis won 2-1 (house axis, then EI) → `{ name, pole }` of the yokai one answer away; `null` when both axes won 3-0 |
| `validateYokaiData()` / `validateHouseHeart()` | Check result-page content at load (DATA_SCHEMA §3/§9); throw on a half-written object |
| `toggleResultGender()` | Flips resultGenderShown, calls renderResult() — called by `flipGenderCard()` after the flip animation ends |
| `resetGame()` | Resets state, returns to landing |
| `guardState(requiredStage)` | Throws if state is invalid for the view (Rule 5 — no silent reset) |
| `debugScores()` | Console logs all scores (remove before production) |

> Functions that reference UI must be defined in `index.html`.

### UI flow functions in index.html

| Function | Purpose |
|---|---|
| `showNarration(pages, onDone)` / `advanceNarration()` | Narration overlay for `lead` / `afterArrange` / `outro` (typewriter, tap) |
| `currentQuestion()` | `QUESTIONS.house` or `QUESTIONS.yokai` item at `state.currentQ` |
| `loadQuestion()` → `renderQuestion(q, sceneShown)` | Shows `q.lead` first (+ `q.text` as narration for the doll question E7), then renders scene + choices (Stage 2 via `getStage2Set`) |
| `confirmAnswer()` | Records answer; after E5 → `calcHouse()` + bento; after E10 → outro → `calcYokai()` + loading |
| `journeyStep()` | Progress step 1–11 |
| `buildChoiceDoors(btn)` / `updateQuizNext(wrap)` | `q.doors` (E4): two fusuma panels over each choice card — first tap opens, tap after `.doors-ready` selects; Next needs a choice and every door open |
| `renderResult()` | Builds view-result: hero (name, kanji · title, role + MBTI tags, art or kanji, talk bubble) → swipe deck (心 heart · 縁 why · 共 life) → tiles (似 alike · 相 match: good chips + adjust sentence) → near-miss tile + pinned dolls → actions; Thai text filled via `fillThai()` |
| `deckCards(r)` / `deckCardHTML(card)` / `deckTexts(cards)` | Deck card list in story order (no `why` / no `life` = card left out; `why` without `whyLead` = on the face, nothing to unfold) → markup → its Thai strings |
| `wireResultDeck(view)` | Dots follow the snapped card; tap a peeking card = scroll to it; tap the current card = fold/unfold its "more"; swiping away folds an open card |
| `wireResultTalk(view, r)` | Talk bubble: each tap = next of `TALK_ORDER` (poke1 → chat1 → chat2 → poke2 → mist[E5 house]) + soft bounce on the art; fades back to "…" after 1400ms + 70ms/char |
| `startDollBoil()` | Doll line boil on the result page: swaps the `#doll-boil` turbulence seed at 7 FPS (6-seed loop); off under reduced motion |
| `fillThai(root, texts)` | Fills every `[data-th=key]` with `thaiBreakable(texts[key])`; throws on a missing key |
| `resultArtHTML(image, kanji, name, cls)` | img / video / kanji placeholder (hero art and near-miss art) |
| `thaiBreakable(text, perGrapheme?)` | **Every Thai string goes on screen through this** — DocumentFragment of `.th-unit` spans + `<wbr>` from `thaiTokens()` (thai-break.js); `perGrapheme` wraps each grapheme in `.th-g` for the narration typewriter |
| `showChapter(chapter, onDone)` / `finishChapter()` | Chapter intro (`QUESTIONS.chapters`) — 2800ms or tap; runs onDone, then the dark backdrop fades out under the next narration. Used by `confirmGender()` (CHAPTER 01) and after E5 in `confirmAnswer()` (CHAPTER 02) |
| `initBento()` → `dismissBentoIntro()` → `showBentoQuestion()` | Bento: `initBento()` resets placed food/state on every entry, then intro → pop-up Q first; `dismissBentoIntro()` ignores a second tap (CHAPTER 02 + lead narration + the Bento scene `yokai[0].text` as its own page run in `confirmAnswer()` over E5, before `showView('bento')`; the pop-up shows only the prompt) |
| `initItemShelf({ shelf, view, zone, layer, placedClass, onChange })` → `{ end, undo, clear, count, placed }` | Shared sideways shelf + drag controller (Bento food `bentoShelf`, Doll accessories `dollShelf`, both made once at load) — one finger at a time, drag starts after 6px, ghost lives in `view`, mouse wheel scrolls sideways; `end()` is the only drag cleanup; `clear()` on every view entry; `onChange(count)` drives Undo/Continue |
| `updateBentoButtons(count)` | Bento Undo enabled when anything is placed · Continue only in arrange phase with ≥ 1 food |
| `confirmBentoChoice()` / `onBentoContinue()` | Records Bento answer → arrange phase → afterArrange → quiz E6 |
| `dollOrder(q)` | `'before'` / `'after'` / null — when view-doll runs around E7 for this house |
| `startDoll(onDone)` / `finishDoll()` → `drawDollAccessories()` → `revealDoll()` | Opens view-doll (intro card first) · Done (dress step only) exports body + face + accessories to `state.dollImage`, plays the reveal, then continues the flow |
| `setDollStep('face' \| 'dress')` / `showDollDress()` / `showDollTab(i)` | Doll steps: face (zoomed head, draw) → Next → dress (accessory tabs from `DOLL_ACCESSORIES`, shelf `#doll-shelf`) |
| `resetSceneIntro` / `showSceneIntro` / `dismissSceneIntro(introId, mainId, e, onRevealed)` → `spawnRipple()` → `flashOutSceneIntro()` | Shared intro card (Bento + Doll) — tap ripple from the finger, white flash after 380ms, then main content + `onRevealed` (Bento: `showBentoQuestion`); ignores taps while `.dismissing` |
| `fadeThrough(fn)` | Black curtain down → run fn → curtain up |
| `flipGenderCard(card)` | Result page: starts the flip-card rotation and `blindsThrough(toggleResultGender)` together (card re-renders already turned via `.is-flipped`) |
| `blindsThrough(fn)` | Red sudare blinds close → run fn → hold 150ms → open (like `fadeThrough`) |
| `initDollCanvas()` | Builds the face mask from `teru_body.png`, wires pointer drawing, palette, sizes, undo/clear, color wheel, accessory tabs |

---

## 9. Build Progress

| Step | Task | Status |
|---|---|---|
| 0 | Docs & Engine | ✅ Done |
| 1 | index.html shell + CSS + fonts | ✅ Done |
| 2 | Landing page | ✅ Done |
| 3 | Gender selection | ⬜ |
| 4 | Quiz view + question loader | ⬜ |
| 5 | Bento mini-game | ⬜ |
| 6 | Loading screen | ⬜ |
| 7 | Result page | ⬜ |
| 8 | BGM stub + polish | ⬜ |
