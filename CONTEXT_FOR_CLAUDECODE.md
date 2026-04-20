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
| `questions.js` | Question bank — 5 house + 5×4 yokai questions |
| `DESIGN_SYSTEM.md` | Colors, typography, component rules |
| `DATA_SCHEMA.md` | State object, YOKAI_DATA structure, scoring pseudocode |
| `CLAUDE.md` | Master rules + architecture + current status |
| `assets/README.md` | Asset naming conventions + placement guide |

> `YOKAI_DATA` object lives inside `index.html` (not a separate file).

---

## 3. App Flow (6 Views)

```
view-landing → view-gender → view-quiz (Stage 1 · h1–h5)
                                   ↓
                            view-bento (drag & drop + pop-up Q)
                                   ↓
                            view-quiz (Stage 2 · p/g/b/y 1–5)
                                   ↓
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

pickAnswer('house', houseKey)  × 5
  → Q1–Q4: +1pt  |  Q5: +2pt (tiebreaker weight)
  → after Q5: showView('bento')

onBentoContinue()
  → calcHouse() → winningHouse → loadStage2(house)
  → showBentoQuestion()  [= yokai[house][0]]

pickAnswer('yokai', yokaiName)  × 5
  → Q1–Q4: +1pt  |  Q5: +2pt
  → after Q5: calcYokai() → winningYokai → showView('loading')

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
state.winningHouse      // set by calcHouse()
state.lastHouseAnswer   // Q5 house choice — tie-breaker

state.yokaiPool         // 4 yokai names for winningHouse
state.yokaiScores       // { YokaiName: pts }
state.winningYokai      // set by calcYokai()
state.lastYokaiAnswer   // Q5 yokai choice — tie-breaker

state.stage             // 1 | 2
state.currentQ          // 0-based index within current stage
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
| `pickAnswer(source, value)` | Records answer, advances Q, triggers transitions |
| `calcHouse()` | Computes winningHouse with tie-breaker, calls loadStage2 |
| `loadStage2(house)` | Resets stage 2 state, sets yokaiPool + yokaiScores |
| `onBentoContinue()` | Calls calcHouse then showBentoQuestion |
| `calcYokai()` | Computes winningYokai, sets resultGenderShown, triggers loading |
| `getResult()` | Returns result data object from YOKAI_DATA |
| `toggleResultGender()` | Flips resultGenderShown, calls renderResult() |
| `resetGame()` | Resets state, returns to landing |
| `guardState(requiredStage)` | Redirects to landing if state is invalid |
| `debugScores()` | Console logs all scores (remove before production) |

> Functions that reference UI (`showView`, `loadQuestion`, `showBentoQuestion`, `renderResult`) must be defined in `index.html`.

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
