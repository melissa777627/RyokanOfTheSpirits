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
                            view-quiz (Stage 2 · e6–e10)   ·   E5 / E10 → view-key (visual-novel key scene)
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
| `toggleResultGender()` | Flips resultGenderShown, calls renderResult() — called through `blindsThrough()` by the result page's gender switch |
| `resetGame()` | Resets state, returns to landing |
| `guardState(requiredStage)` | Throws if state is invalid for the view (Rule 5 — no silent reset) |
| `debugScores()` | Console logs all scores (remove before production) |

> Functions that reference UI must be defined in `index.html`.

### UI flow functions in index.html

| Function | Purpose |
|---|---|
| `showNarration(pages, onDone)` / `advanceNarration()` | Narration overlay for `lead` / `afterArrange` / `outro` (typewriter, tap) |
| `currentQuestion()` | `QUESTIONS.house` or `QUESTIONS.yokai` item at `state.currentQ` |
| `loadQuestion()` → `renderQuestion(q, sceneShown)` | Shows `q.lead` first (+ `q.text` as narration for the doll question E7), then the quiz page: thread, noren (`EVENT nn · norenName(q)`), story card (`storyParts()` → paragraphs + red question, revealed by `revealInk()`), choices (Stage 2 via `getStage2Set`) that rise once the story has arrived; tap the body = show all |
| `storyParts(q, set, sceneShown)` | `{ paras, prompt }` — Stage 1 splits `q.text` at the last `" — "`; Stage 2 = `q.text` lines + `set.prompt`; sceneShown → prompt only |
| `inkParagraph(text, cls)` / `revealInk(inks, done)` | Story phrases as `.ink` spans → revealed one by one with `INK` pacing; returns finish-now; reduced motion = all at once |
| `buildChoice(q, c, i, wrap, onPick)` | One card: `.choice-radio` · `.choice-pic` (when `c.image`) · `.choice-text` · doors; tap selects (doors: first tap opens) then `onPick(c)` — quiz/key scenes pass `pickQuizChoice`, the Bento sheet its own |
| `updateQuizNext(wrap)` → `setNextWaiting(btn, label)` / `setNextReady(btn)` | (btn = `#btn-quiz-next` or the Bento sheet's `#btn-bento-confirm`) The Next fuda says what is missing: doors n/4 → pick → ไปต่อ (pop + idle nudge after 4s) |
| `sealAnswer()` → `stampSeal(btn, wrap)` → `confirmAnswer()` | Next pressed: sakura seal stamps onto the picked ○, 0.85s later `confirmAnswer()` records it; after E5 → `calcHouse()` → `continueKeyScene(bento.lead)` → CHAPTER 02 → bento scene page → bento; after E10 → outro → `calcYokai()` + loading |
| `journeyStep()` / `renderThread(el, step)` | Progress step 1–11 / builds the red-thread knots (gender view = step 0) |
| `bringChoicesIntoView(wrap)` / `armQuizIdle(fn, ms)` / `motionOn()` | Scroll so the first choice clears the fuda · one idle-nudge timer · reduced-motion check |
| `showKeyScene(q)` | loadQuestion branch for `q.keyScene` (E5/E9/E10, after the lead narration) — box lines = `keyScene.lines` + `q.text`: art, fx, thread, scroll card → `startKeyLines()` in `#view-key` |
| `keyLines(pages)` | pages → `[{ text, kind: narr|speech|player, auto?, slow? } | { reply }]`; quoted parts become speech; `{ say, auto }` flows on, `{ slow }` soaks in via `revealInk`; other forms throw |
| `advanceKeyScene()` | view tap: skip card / unhide / finish line / next line / `showKeyChoices()` |
| `showKeyChoices()` | prompt in the box; borrows `#quiz-choices` and the fuda wrap into the key view; `buildChoice` per choice — `sealAnswer` / `confirmAnswer` unchanged |
| `continueKeyScene(pages, onEnd)` | After a key scene's answer: returns the borrowed quiz pieces, then plays `pages` in the same box over the same art (fx stays full); `onEnd` after the last line — used for E5 → `bento.lead` → CHAPTER 02 |
| `showKeyReplies(options)` | `{ reply }` line: answers rise above the box (`.narration-reply-btn`); a pick becomes a player line ("คุณ" tag) and types out — no score |
| `openKeyLog` / `closeKeyLog` / `hideKeyBox` | LOG sheet (narration vs speech) / HIDE |
| `endKeyScene()` | stops timers, returns the borrowed pieces to `#view-quiz`, resets box/log/dim; called in `loadQuestion()` and `showKeyScene()` |
| `eventNumber()` | E1–E10 numbering for the current question |
| `loadQuestion()` → `showQuestionCard(q)` | After the lead narration: `q.intro === 'crowd'` plays `playCrowdIntro` first; doll order; then `renderQuestion` |
| `buildChoiceDoors()` / `openDoor(btn, wrap)` / `shutOtherDoors(wrap, keep)` | E4 doors: two fusuma panels per card · first tap slides it open (`.seen` after `DOOR_SLIDE_MS`), others shut · only the listened-to and picked doors stay open · Next counts doors seen |
| `setQuizWeather(weather)` | Shows/hides `#quiz-rain`; builds 90 drops on first rain (`q.weather`) |
| `resetBlackout(on)` → `playStrike()` → `killLights(wrap)` | E3 (`q.blackout`), state in `_bo`, timings in `BLACKOUT`, hints in `BLACKOUT_TEXT` · every quiz card resets `#quiz-blackout`; on = strike with the first phrase · after the choices rise the page's lights flicker and die part by part, then full dark |
| `boPointerDown/Move/Up` → `strikeMatch(p)` / `placeMatch(foot)` / `setBlackoutEdge(p)` | Wired once on `#view-quiz` (`wireBlackout`) · one strike per finger-down (first only sparks) · the finger holds the stick's foot, flame `MATCH_REACH` above · edge zones auto-scroll the window · one pointer, captured only once it drags |
| `blackoutHolds(btn)` → `liftBlackout(btn)` / `glideFlameTo(target)` | Called by `buildChoice` on a tap in the dark: card in the flame's clear core → lift (dark opens from its ○) and the normal pick runs · dark card → the flame glides to it, no pick · end of a drag → nothing |
| `playCrowdIntro(onDone)` → `buildCrowdScene(scene)` / `tickCrowdVacancy(left)` | E2 crowd intro (`q.intro === 'crowd'`): builds the seeded scene, measures `--stage-w/h`/`--run`, schedules vacancy ticks; at the end `finishCrowdIntro()` shows the card, then fades |
| `crowdArtUrl(art)` / `preloadCrowdArt()` | Crowd silhouettes from `assets/ui/crowd/` (320px shapes) · preloaded in `confirmGender()` |
| `skipCrowdIntro()` / `closeCrowdIntro()` / `runCrowdDone()` | SKIP: clear timers, hide overlay, card once (throws if run twice) |
| `renderResult()` | Clears the old page's timers, then builds view-result: hero (name, kanji · title, role + MBTI words, art or kanji, talk bubble, gender switch) → wooden topic tags + deck of washi cards (心 heart · 縁 why · 共 life) → tiles (似 alike · 相 match) → near-miss banner (fogged glass) + dolls with the omikuji box → share envelope + play again → omikuji slip modal; Thai text via `fillThai()`; then wires each part |
| `deckCards(r)` / `deckCardHTML(card, i, cards)` / `deckTexts(cards)` | Deck card list in story order (no `why` / no `life` = card left out; `why` without `whyLead` = on the face, nothing to unfold) → markup (face = key line only; pairs / reading / invite fold behind "อ่านต่อ"; foot = toggle + "ถัดไป ›") → its Thai strings (+ `TAB_LABEL`) |
| `wireResultDeck(view)` | Tags follow the snapped card (tap a tag = go there; a change runs the breeze); deck height follows the card on screen; tap the current card = fold/unfold; "ถัดไป ›" = next card; swiping away folds an open card; first view: a small sideways nudge |
| `wireResultGender(view)` | Gender switch: the knob slides across, then `blindsThrough(toggleResultGender)` after 380ms |
| `wireNearFog(view)` | Near-miss fogged glass (canvas): finger wipes, half cleared → lifts and sets `state.nearCleared`; swipe-hand demo when first in view; Enter/Space lifts it; already cleared = no glass |
| `wireOmikuji(view)` | Omikuji box shakes → slip modal (asks single/taken, then lift + flip to a fortune from `OMIKUJI`); Esc / ✕ / outside tap closes, focus returns to the box |
| `wireResultShare(view, r)` / `showToast(msg)` | Share: `navigator.share` (title, line, link); without it the line + link go to the clipboard with a toast |
| `wireResultAgain(view)` | Play again: first tap arms ("แตะอีกครั้ง ผลนี้จะหายไป" 3 s), second tap = `resetGame()` |
| `wireResultTalk(view, r)` / `fitBubble(say, text)` | Talk bubble: greets once (`lines.greet`, `state.resultGreeted`); each tap = next of `TALK_ORDER` (poke1 → chat1 → chat2 → poke2 → mist[E5 house]) + soft bounce on the art; the line stays up with ▼ after it; left alone 15 s while on screen → a chat line by itself; `fitBubble` sets the box to the widest wrapped line |
| `startDollBoil()` | Doll line boil on the result page: swaps the `#doll-boil` turbulence seed at 7 FPS (6-seed loop); off under reduced motion |
| `fillThai(root, texts)` | Fills every `[data-th=key]` with `thaiBreakable(texts[key])`; throws on a missing key |
| `resultArtHTML(image, kanji, name, cls)` | img / video / kanji placeholder (hero art and near-miss art) |
| `thaiBreakable(text, perGrapheme?)` | **Every Thai string goes on screen through this** — DocumentFragment of `.th-unit` spans + `<wbr>` from `thaiTokens()` (thai-break.js); `perGrapheme` wraps each grapheme in `.th-g` for the narration typewriter |
| `showChapter(chapter, onDone)` / `finishChapter()` | Chapter intro (`QUESTIONS.chapters`) — 2800ms or tap; runs onDone, then the dark backdrop fades out under the next narration. Used by `confirmGender()` (CHAPTER 01) and after E5 in `confirmAnswer()` (CHAPTER 02) |
| `initBento()` → `dismissBentoIntro()` → `showBentoQuestion()` | Bento: `initBento()` resets placed food/state on every entry, then intro → pop-up Q first; `dismissBentoIntro()` ignores a second tap (CHAPTER 02 + lead narration + the Bento scene `yokai[0].text` as its own page run in `confirmAnswer()` over E5, before `showView('bento')`; the pop-up shows only the prompt) |
| `initItemShelf({ shelf, view, zone, layer, placedClass, onChange })` → `{ end, undo, clear, count, placed }` | Shared sideways shelf + drag controller (Bento food `bentoShelf`, Doll accessories `dollShelf`, both made once at load) — one finger at a time, drag starts after 6px, ghost lives in `view`, mouse wheel scrolls sideways; `end()` is the only drag cleanup; `clear()` on every view entry; `onChange(count)` drives Undo/Continue · placed copies (`.shelf-placed`) drag again from `layer`: drop inside = move to top, outside = remove · `placed()` = layer children bottom→top (Doll export order) |
| `showBentoQuestion()` → `sealBentoAnswer()` → `confirmBentoChoice()` | Bento sheet: same `.quiz-story` card, `.quiz-choices` list (`buildChoice`) and fuda (`setNext*`, `stampSeal`) as the quiz page |
| `showBentoShelfHint()` / `markBentoShelfEnd()` | Bento shelf hints: swipe hand after Confirm (gone at first scroll/touch) · right-edge fade until scrolled to the end |
| `updateBentoButtons(count)` | Bento Undo enabled when anything is placed · Continue only in arrange phase with ≥ 1 food |
| `confirmBentoChoice()` / `onBentoContinue()` | Records Bento answer → arrange phase → afterArrange → quiz E6 |
| `dollOrder(q)` | `'before'` / `'after'` / null — when view-doll runs around E7 for this house |
| `startDoll(onDone)` / `finishDoll()` → `drawDollAccessories()` → `revealDoll()` | Opens view-doll (intro card first) · Done (dress step only) exports body + face + accessories to `state.dollImage`, plays the reveal, then continues the flow |
| `setDollStep('face' \| 'dress')` / `showDollDress()` / `showDollTab(i)` | Doll steps: face (zoomed head, draw) → Next → dress (accessory tabs from `DOLL_ACCESSORIES`, shelf `#doll-shelf`) |
| `resetSceneIntro` / `showSceneIntro` / `dismissSceneIntro(introId, mainId, e, onRevealed)` → `spawnRipple()` → `flashOutSceneIntro()` | Shared intro card (Bento + Doll) — tap ripple from the finger, white flash after 380ms, then main content + `onRevealed` (Bento: `showBentoQuestion`); ignores taps while `.dismissing` |
| `fadeThrough(fn)` | Black curtain down → run fn → curtain up |
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
| 4 | Quiz view + question loader | ✅ เฟส 1 หน้าคำถามใหม่ (2026-11-03) · เฟส 2–5 รอ |
| 5 | Bento mini-game | ⬜ |
| 6 | Loading screen | ⬜ |
| 7 | Result page | ✅ (2026-11-03 จาก lab V30) · เหลือ Share to Story |
| 8 | BGM stub + polish | ⬜ |
