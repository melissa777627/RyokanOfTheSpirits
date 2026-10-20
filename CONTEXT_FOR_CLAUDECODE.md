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
                                   ↓  showResultSpeech() — ภูตพูด A + B (ข้ามถ้า memory: null)
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
| `getResult()` | Returns result data object from YOKAI_DATA |
| `toggleResultGender()` | Flips resultGenderShown, calls renderResult() — called by `flipGenderCard()` after the flip animation ends |
| `resetGame()` | Resets state, returns to landing |
| `guardState(requiredStage)` | Throws if state is invalid for the view (Rule 5 — no silent reset) |
| `debugScores()` | Console logs all scores (remove before production) |

> Functions that reference UI must be defined in `index.html`.

### UI flow functions in index.html

| Function | Purpose |
|---|---|
| `showNarration(pages, onDone)` / `advanceNarration()` | Narration overlay for `lead` / `afterArrange` / `outro` (typewriter, tap) |
| `showResultSpeech()` | After loading: the matched Yokai speaks its memory line (A) + near lines (B) via narration, tap → result · skipped when `memory` is null |
| `currentQuestion()` | `QUESTIONS.house` or `QUESTIONS.yokai` item at `state.currentQ` |
| `loadQuestion()` → `renderQuestion(q)` | Shows `q.lead` first, then renders scene + choices (Stage 2 via `getStage2Set`) |
| `confirmAnswer()` | Records answer; after E5 → `calcHouse()` + bento; after E10 → outro → `calcYokai()` + loading |
| `journeyStep()` | Progress step 1–11 |
| `initBento()` → `dismissBentoIntro()` → `showBentoQuestion()` | Bento: intro → pop-up Q first (the lead narration runs in `confirmAnswer()` over E5, before `showView('bento')`) |
| `confirmBentoChoice()` / `onBentoContinue()` | Records Bento answer → arrange phase → afterArrange → quiz E6 |
| `dollOrder(q)` | `'before'` / `'after'` / null — when view-doll runs around E7 for this house |
| `startDoll(storyText, onDone)` / `finishDoll()` → `revealDoll()` | Opens view-doll (intro card first), saves `state.dollImage`, plays the reveal, then continues the flow |
| `resetSceneIntro` / `showSceneIntro` / `dismissSceneIntro` | Shared intro card (Bento + Doll) |
| `fadeThrough(fn)` | Black curtain down → run fn → curtain up |
| `flipGenderCard(card)` | Result page: starts the flip-card rotation and `blindsThrough(toggleResultGender)` together (card re-renders already turned via `.is-flipped`) |
| `blindsThrough(fn)` | Red sudare blinds close → run fn → hold 150ms → open (like `fadeThrough`) |
| `initDollCanvas()` | Builds the face mask from `teru_body.png`, wires pointer drawing, palette, sizes, undo/clear, color wheel |

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
