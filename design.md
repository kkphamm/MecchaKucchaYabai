# MecchaKucchaYabai — MVP Product, UX/UI & Technical Design Document

Status: **Design & planning only.** No application code has been written. This document is the complete specification for a later implementation pass.

## How To Use This Document (read this first)

This document is written to be handed directly to a coding agent (e.g. Claude Code) as the sole implementation brief. It assumes:

- Motion Primitives is already installed in the target project and its component source is available to import and modify directly.
- The agent has access to the live Motion Primitives site (motion-primitives.com/docs) for reference if needed, but should treat **Section 7 (Motion Primitives Component Map)** as authoritative — every component named there has been confirmed to exist against the live library.
- The agent should not re-litigate product scope. Section 4 (Non-Goals) and the working rules below are binding.
- **Appendix A (Implementation Task Queue)** tells the agent exactly how to break this document into small, sequentially-executed tasks and proceed automatically from one to the next without waiting for manual confirmation between tasks — except where this document explicitly flags an open decision (Section 30).

If the agent hits a genuine product ambiguity not resolved by this document, it should stop and surface the question rather than invent a resolution.

---

## 1. Executive Summary

MecchaKucchaYabai is a focused, single-purpose web application for learning and mastering Japanese Hiragana and Katakana. The entire product is one loop — see a kana, answer, get immediate feedback, watch mastery accumulate — repeated until the full syllabary is mastered. There are no accounts, no gamification systems, no vocabulary or kanji, and no backend. Everything lives in the browser.

Visually and interactively, the product is inspired by the restraint and craft of Motion Primitives — generous whitespace, quiet typography, dark and light themes, and motion that clarifies state changes rather than decorating the page. The result should read as a tool built by people who care about typography and interaction detail, not a gamified flashcard app or a component-library showcase.

## 2. Product Principles

1. **One loop, done well.** See → Answer → Feedback → Mastery. Every design decision should make this loop faster to understand and more pleasant to repeat for 20–30 minutes at a time.
2. **Calm over gamified.** No streaks, XP, confetti, or badges. Progress is communicated through clean numbers and understated motion, not celebration.
3. **Motion clarifies, never decorates.** Animation is reserved for state transitions (tab change, theme change, question change, answer feedback, mastery). Nothing moves at rest.
4. **Desktop-first, responsive always.** The primary design target is a focused desktop study session; the same architecture degrades gracefully to tablet and mobile.
5. **Local-first, zero-friction.** No login, no network dependency, no setup. Progress persists automatically in the browser.
6. **Own identity, borrowed craft.** Motion Primitives informs the quality bar (spacing, type, restraint), not the branding or layout of the product.

## 3. MVP Scope

In scope:

- Hiragana and Katakana study overviews (non-interactive character grids showing mastery).
- A 20-question-max multiple-choice quiz per script, in both directions (kana→romaji and romaji→kana).
- An independent 0/50 mastery counter per kana character, persisted locally.
- Light and dark themes with persisted preference.
- Reset progress, scoped per script, with a confirmation step.
- The full canonical Hiragana/Katakana dataset defined in Section 11, including dakuten, handakuten, small kana, yōon, ヴ, ー, and archaic kana.

## 4. Explicit Non-Goals

None of the following should be designed, stubbed, or scaffolded "for later":

- User accounts or authentication
- Cloud sync or any backend database
- Social features, sharing, or leaderboards
- Streaks, XP, achievements, or badges
- **Audio** — no pronunciation audio, sound effects, spoken prompts, or answer sounds; all correctness/reading feedback is visual/textual only
- Vocabulary, kanji, or grammar content
- AI tutor or chat-based instruction
- Typed-answer quiz mode (multiple choice only)
- Spaced repetition or adaptive difficulty algorithms
- Admin dashboard or analytics
- Any navigation destination beyond Hiragana and Katakana (no Dashboard, Profile, Lessons, Community, etc.)

## 5. User Experience Goals

- A first-time user should be studying within seconds of opening the app — no onboarding, no marketing copy, no forced tutorial.
- At any moment, the user should be able to answer "what am I looking at and what happens if I click this?" without ambiguity.
- The interface should feel identical in spirit in light and dark mode — neither is an afterthought.
- Feedback (correct/incorrect, mastery reached) should be legible in under a second and never block the next action longer than necessary.
- Nothing should move unless it is communicating a state change the user needs to notice.

**Romaji-on-card decision — include it.** Each Overview kana card shows small, secondary/muted romaji beneath the glyph (e.g. `text.secondary`, ~40% the size of the kana). Rationale: the Overview is not a recall test — recall is only tested inside the quiz — so showing romaji here reduces scanning friction for a learner orienting themselves in a 115/117-character grid, without weakening the actual test of memory. This is the one place in the product romaji is shown outside of quiz feedback/reveal.

**Landing behavior decision — no separate landing/intro screen.** The application opens directly into the kana study interface (Hiragana tab active by default; header with product name, tabs, and theme toggle). Rationale: the core loop must be immediately obvious, the brief explicitly warns against friction between opening the app and studying, and this is a study tool, not a marketing site — Motion Primitives' homepage is inspiration for *craft*, not a layout to replicate.

## 6. Motion Primitives Research

Research was conducted directly against the live Motion Primitives documentation (motion-primitives.com/docs) and its component catalog. The confirmed, currently-available component set (~30 components) falls into these categories:

- **Core / Layout:** Accordion, Animated Background, Animated Group, Border Trail, Carousel, Cursor, Dialog, Disclosure, In View, Infinite Slider, Transition Panel
- **Text Effects:** Text Effect, Text Loop, Text Morph, Text Roll, Text Scramble, Text Shimmer, Text Shimmer Wave, Spinning Text
- **Number Effects:** Animated Number, Sliding Number
- **Interactive / Visual Effects:** Dock, Glow Effect, Image Comparison, Scroll Progress, Spotlight, Tilt, Magnetic
- **Toolbars:** Toolbar Dynamic, Toolbar Expandable
- **Overlays:** Morphing Dialog, Morphing Popover, Progressive Blur

Two notable **absences** confirmed by research, both relevant to this product: Motion Primitives has **no dedicated "Tabs" component** and **no dedicated "Theme Toggle" component**. Both are commonly hand-built on top of other primitives — Animated Background is the library's own documented pattern for tab-like selection UI (its stated purpose is highlighting the active item in lists/menus/navigation). Section 7 accounts for both gaps explicitly rather than inventing a component that doesn't exist.

## 7. Motion Primitives Component Map

| App Element | Motion Primitives Component | Purpose | Modification |
|---|---|---|---|
| Hiragana/Katakana tabs | **Animated Background** | Sliding highlight behind the active tab — MP's own documented pattern for selection feedback in lists/menus/nav | Restyle only — recolor to design tokens (Section 9), reduce to a simple filled pill, no shadow |
| Theme toggle | *None (custom)* | Sun/moon icon crossfade on click | Not a named MP component; build with the underlying `motion` library MP itself is built on, matching MP's animation conventions (~150ms crossfade, no spring) |
| Kana overview grid entrance | **Animated Group** + **In View** | Staggered, one-time fade/slide-in of kana cards as the grid mounts/scrolls into view | Use near as-is; reduce stagger delay (Section 20) so it reads as quality, not playfulness |
| Kana card hover | *None (custom, deliberately)* | Subtle lift/scale on hover | **Tilt was considered and rejected** — a 3D tilt reads as playful/gimmicky on a study surface scanned repeatedly; a plain 2–4px translateY + 1.01 scale is used instead |
| Mastery progress bar | *None (custom)* | Animated fill-width per kana | No MP component matches a linear value-driven bar; **Scroll Progress was considered and rejected** — it is scroll-position-linked, not value-driven, and forcing it here would fight its actual purpose |
| Mastery percentage number | **Sliding Number** | Animates percentage digits when `correctCount` changes | Use as-is — this is its intended use case |
| Mastered checkmark moment (mid-quiz, 49→50) | **Glow Effect** (single pulse) | One-time, low-intensity glow pulse behind the mastery checkmark the instant a kana is mastered | Restyle to a single non-looping pulse at low opacity/blur; used nowhere else in the app so it stays meaningful |
| Quiz question transition | **Transition Panel** | Swaps prompt + answers between questions with enter/exit animation | Use near as-is — this is its documented purpose |
| Answer selection feedback (correct/incorrect) | *None (custom, deliberately)* | Border/background color transition + icon on the selected option | **Border Trail and Glow Effect were considered and rejected** here — both risk a "game show" feel; a restrained color + icon fade is used instead |
| Quiz score count-up (Results) | **Animated Number** | Counts up correct/incorrect totals | Use as-is |
| Reset Progress confirmation | **Dialog** | Modal confirm/cancel before a destructive reset | Use near as-is, restyled to tokens. **Morphing Dialog was considered and rejected** — its "expand a source element into focus" motion implies content inspection, not a yes/no confirmation |
| Mobile utility bar (theme toggle + reset) | **Toolbar Dynamic** | Compact bar that expands to reveal secondary actions where header space is tight | Optional, mobile/tablet only (Section 22); restyled to tokens |
| All-mastered / completion headline | **Text Effect** | Calm, single-run word-level reveal of the completion message | Use as-is, no loop |

**Explicitly not used anywhere:** Cursor, Carousel, Dock, Spotlight, Magnetic, Image Comparison, Infinite Slider, Border Trail (continuous use), Progressive Blur, Spinning Text, Text Loop, Text Morph, Text Scramble, Text Shimmer/Wave, Morphing Popover, Toolbar Expandable, Accordion, Disclosure. All are real, confirmed components — none has a purposeful, restrained fit on this MVP surface, and forcing one in would violate "motion enhances, doesn't define."

## 8. Visual Direction

Minimalism inspired by Motion Primitives' *craft*, not its layout: quiet typography, generous whitespace, a restrained neutral palette, subtle 1px borders instead of heavy shadows, and motion that is always purposeful. Explicitly avoided: gradients, neon accents, stereotypical "anime" visual tropes (cherry blossoms, brush-stroke fonts, flag motifs), dashboard chrome (sidebars, KPI tiles), and any component-demo aesthetic.

## 9. Design Tokens

### Typography

- **Display/UI font:** a neutral, high-quality grotesk (e.g. Inter or Geist) for all UI chrome, headings, and romaji.
- **Kana typography:** kana must render with full, correctly-shaped Japanese glyph coverage (`"Hiragino Sans", "Noto Sans JP", ui-sans-serif, system-ui` stack, or a self-hosted Noto Sans JP subset for cross-OS consistency). Kana are the visual centerpiece of every card and question — large, crisp, never a mismatched fallback.
- **Numeric/progress typography:** tabular figures (`font-variant-numeric: tabular-nums`) everywhere a number animates, so digits don't shift layout.
- **Scale (desktop):** kana in grid card 32–40px; kana in quiz prompt 96–128px; body/UI 14–16px; percentage micro-label 12–13px.

### Color (semantic tokens, per mode)

| Token | Light | Dark |
|---|---|---|
| `bg.canvas` | `#FAFAF9` | `#0B0B0A` |
| `bg.surface` (cards) | `#FFFFFF` | `#151513` |
| `border.subtle` | `#E7E5E4` | `#26251F` |
| `text.primary` | `#18181B` | `#F4F4F3` |
| `text.secondary` (romaji, meta) | `#71717A` | `#A1A19A` |
| `accent` (active tab, primary CTA) | `#18181B` | `#F4F4F3` |
| `state.correct` | `#15803D` on `#DCFCE7` | `#4ADE80` on `#052E1B` |
| `state.incorrect` | `#B91C1C` on `#FEE2E2` | `#F87171` on `#3A0D0D` |
| `state.mastered` | `#15803D` | `#4ADE80` |

Correct/incorrect states always pair color with an icon and text label — never color alone.

### Spacing

Page gutter: 96px desktop / 48px laptop / 24px tablet / 16px mobile. Section spacing: 64px header→grid, 48px between grid sections. Card grid gap: 12–16px. Quiz spacing: prompt→answers 48px, between answer options 12px.

### Shape

Radius: cards 12px, buttons/pills 8px, tab highlight full pill, dialog 16px. Borders: 1px solid `border.subtle` on all cards and the dialog; no drop shadows except one soft shadow on the Dialog (`0 8px 24px rgba(0,0,0,0.12)`).

### Motion

Durations: micro (hover, tab highlight) 150ms; standard (question transition, dialog open) 220–280ms; mastery pulse 400ms single-shot. Easing: `ease-out` on entrances, `ease-in-out` on state swaps; no bouncy/elastic springs. All transient effects run once and settle — nothing loops or idles. `prefers-reduced-motion` disables grid stagger, tab-highlight sliding (snap instead), and the mastery glow pulse, keeping only short opacity cross-fades.

## 10. Information Architecture

```
Application
├── Hiragana
│   ├── Kana Overview   (default landing view)
│   └── Quiz            (entered via "Start Quiz")
└── Katakana
    ├── Kana Overview
    └── Quiz
Supporting states (not navigation destinations):
├── Quiz Results        (replaces Quiz view on completion, same context)
├── All-Mastered state  (variant of Kana Overview when 0 unmastered remain)
└── Reset Confirmation  (modal, overlays Kana Overview)
```

Only two top-level destinations exist. Quiz, Results, and All-Mastered are states within a script's context, not separate navigation items — switching the top tab always returns to that script's Overview.

## 11. Kana Dataset Specification

The dataset is the canonical source of truth. Every entry has: `id`, `script` (hiragana/katakana), `kana` (glyph string), `romaji` (canonical Hepburn label, used for both display and quiz validation), `category` (basic / dakuten / handakuten / small / yoon / special / archaic), `row` (consonant group — used by the distractor algorithm), `vowel` (a/i/u/e/o — used by the distractor algorithm).

`id` convention: `{script}-{row}{vowel}` for basic/dakuten/handakuten (e.g. `hira-ka`, `kata-ga`); `{script}-small-{label}` for small kana; `{script}-{row}y{vowel}` for yōon (e.g. `hira-kya`); `{script}-archaic-{label}`; `{script}-special-{label}`.

### Basic (Gojūon) — 46 per script

| Row | a | i | u | e | o |
|---|---|---|---|---|---|
| ∅ | あ/ア — a | い/イ — i | う/ウ — u | え/エ — e | お/オ — o |
| k | か/カ — ka | き/キ — ki | く/ク — ku | け/ケ — ke | こ/コ — ko |
| s | さ/サ — sa | し/シ — shi | す/ス — su | せ/セ — se | そ/ソ — so |
| t | た/タ — ta | ち/チ — chi | つ/ツ — tsu | て/テ — te | と/ト — to |
| n | な/ナ — na | に/ニ — ni | ぬ/ヌ — nu | ね/ネ — ne | の/ノ — no |
| h | は/ハ — ha | ひ/ヒ — hi | ふ/フ — fu | へ/ヘ — he | ほ/ホ — ho |
| m | ま/マ — ma | み/ミ — mi | む/ム — mu | め/メ — me | も/モ — mo |
| y | や/ヤ — ya | | ゆ/ユ — yu | | よ/ヨ — yo |
| r | ら/ラ — ra | り/リ — ri | る/ル — ru | れ/レ — re | ろ/ロ — ro |
| w | わ/ワ — wa | | | | を/ヲ — wo |
| — | ん/ン — n | | | | |

`を`/`ヲ` is canonically romanized **"wo"** (not "o"), specifically to avoid a romaji collision with `お`/`オ` ("o") — the standard convention in kana learning charts.

### Dakuten — 20 per script

| Row | a | i | u | e | o |
|---|---|---|---|---|---|
| g | が/ガ — ga | ぎ/ギ — gi | ぐ/グ — gu | げ/ゲ — ge | ご/ゴ — go |
| z | ざ/ザ — za | じ/ジ — ji | ず/ズ — zu | ぜ/ゼ — ze | ぞ/ゾ — zo |
| d | だ/ダ — da | ぢ/ヂ — ji | づ/ヅ — zu | で/デ — de | ど/ド — do |
| b | ば/バ — ba | び/ビ — bi | ぶ/ブ — bu | べ/ベ — be | ぼ/ボ — bo |

**Known romaji collisions (real Hepburn behavior, not a data error):** じ/ジ and ぢ/ヂ both → "ji"; ず/ズ and づ/ヅ both → "zu". See Section 14 for how the distractor algorithm handles this, and Section 30 for the flagged product implication.

### Handakuten — 5 per script

| Row | a | i | u | e | o |
|---|---|---|---|---|---|
| p | ぱ/パ — pa | ぴ/ピ — pi | ぷ/プ — pu | ぺ/ペ — pe | ぽ/ポ — po |

### Small Kana — 9 per script

ぁ/ァ, ぃ/ィ, ぅ/ゥ, ぇ/ェ, ぉ/ォ — romaji identical to the full-size counterpart (a/i/u/e/o). ゃ/ャ, ゅ/ュ, ょ/ョ — romaji ya/yu/yo. っ/ッ ("sokuon" / small tsu) — non-phonemic, see Special Marks below.

### Yōon (Combined Sounds) — 33 per script

| Row | ya | yu | yo |
|---|---|---|---|
| k | きゃ/キャ — kya | きゅ/キュ — kyu | きょ/キョ — kyo |
| s | しゃ/シャ — sha | しゅ/シュ — shu | しょ/ショ — sho |
| t | ちゃ/チャ — cha | ちゅ/チュ — chu | ちょ/チョ — cho |
| n | にゃ/ニャ — nya | にゅ/ニュ — nyu | にょ/ニョ — nyo |
| h | ひゃ/ヒャ — hya | ひゅ/ヒュ — hyu | ひょ/ヒョ — hyo |
| m | みゃ/ミャ — mya | みゅ/ミュ — myu | みょ/ミョ — myo |
| r | りゃ/リャ — rya | りゅ/リュ — ryu | りょ/リョ — ryo |
| g | ぎゃ/ギャ — gya | ぎゅ/ギュ — gyu | ぎょ/ギョ — gyo |
| j (from じ) | じゃ/ジャ — ja | じゅ/ジュ — ju | じょ/ジョ — jo |
| b | びゃ/ビャ — bya | びゅ/ビュ — byu | びょ/ビョ — byo |
| p | ぴゃ/ピャ — pya | ぴゅ/ピュ — pyu | ぴょ/ピョ — pyo |

### Special Marks, katakana-only additions, and archaic kana

- **ヴ (katakana only)** — romaji `vu`, for foreign loanword "v" sounds. No hiragana equivalent (none was specified in scope).
- **ー (katakana only, "chōonpu")** — no phoneme of its own; extends the preceding vowel. Canonical label in place of romaji: `"ー (chōon / long vowel mark)"`. Independent mastery counter; tested purely as **symbol recognition** (kana→label and label→kana), not as a phonetic sound.
- **っ/ッ ("sokuon" / small tsu)** — no phoneme of its own; marks gemination of the following consonant. Canonical label: `"(sokuon / small tsu)"`. Same treatment as ー.
- **Archaic — ゐ/ヰ ("wi"), ゑ/ヱ ("we")** — treated identically to basic kana in overview and quiz; standard romaji, no collision with anything else in the set.

### Romaji system

Hepburn romanization is canonical everywhere (display and quiz validation). Where Hepburn produces two kana with identical romaji (じ/ぢ → "ji", ず/づ → "zu"), the dataset intentionally preserves this real-world ambiguity rather than inventing non-standard spellings — it is handled at the distractor-generation layer (Section 14) so it never produces a broken question. No alternate romanization system (Kunrei-shiki, Nihon-shiki) is exposed in the UI.

### Totals

Hiragana: 46 + 20 + 5 + 9 + 33 + 2 (archaic) = **115**. Katakana: 46 + 20 + 5 + 9 + 33 + 2 (archaic) + 1 (ヴ) + 1 (ー) = **117**.

## 12. Mastery System

Each kana has an independent, monotonically-increasing `correctCount`, initialized to `0`, capped at `50`.

```
on correct answer for kana K:
    K.correctCount = min(50, K.correctCount + 1)
on incorrect answer for kana K:
    // no change — correctCount is never decremented or reset
mastery percentage = round(K.correctCount / 50 * 100)
K.mastered = (K.correctCount == 50)
```

A mastered kana remains visible in its overview grid permanently, displays 100% with a checkmark, and is excluded from all future normal quiz selection for that script. There is no way to "un-master" a kana in the MVP. The moment a kana crosses 49→50 mid-quiz it becomes mastered immediately, but the in-progress quiz continues to completion unaffected with its originally-selected question set.

## 13. Quiz Rules

- A quiz is always scoped to exactly one script (Hiragana or Katakana), chosen by which tab the user started it from.
- Eligible pool = all kana in that script where `mastered == false`.
- Quiz length = `min(20, eligible.length)`. If the pool is empty, "Start Quiz" is not offered — the All-Mastered state (Screen 4, Section 17) is shown instead.
- Exactly one question per selected kana; no repeats within a quiz.
- Selection is uniform random from the eligible pool — no weighting by past performance, recency, or difficulty.
- Every question is 4-option multiple choice: 1 correct + 3 distractors, shuffled.
- Both directions (kana→romaji, romaji→kana) appear within a single quiz, distributed per Section 14.

## 14. Quiz Algorithm + Pseudocode

**A — Selecting eligible characters**
```
function eligiblePool(script):
    return dataset.filter(k => k.script == script && k.mastered == false)
```

**B — Determining quiz length**
```
function quizLength(pool):
    return min(20, pool.length)
```

**C — Selecting unique random characters**
```
function selectQuestionKana(pool, n):
    shuffled = shuffle(pool)          // Fisher-Yates
    return shuffled.slice(0, n)       // n unique kana, no repeats
```

**D — Deciding kana→romaji vs romaji→kana**
```
function assignDirections(n):
    directions = []
    fill first ceil(n/2) with "KANA_TO_ROMAJI"
    fill remaining floor(n/2) with "ROMAJI_TO_KANA"
    shuffle(directions)
    return directions   // paired index-wise with the question kana list
```
This guarantees a balanced mix regardless of `n`, avoiding the small-n imbalance risk of independent 50/50 coin flips.

**E — Generating answer choices (distractors)**
```
function generateDistractors(correct, script, count = 3):
    pool = dataset.filter(k =>
        k.script == script
        && k.id != correct.id
        && k.romaji != correct.romaji)   // prevents romaji-collision ambiguity
                                          // (handles じ/ぢ, ず/づ automatically)
    tier1 = pool.filter(k => k.row == correct.row)      // same consonant row
    tier2 = pool.filter(k => k.vowel == correct.vowel)  // same vowel column
    tier3 = pool                                        // anything else

    chosen = []
    for tier in [tier1, tier2, tier3]:
        for kana in shuffle(tier):
            if kana not in chosen and chosen.length < count:
                chosen.push(kana)
        if chosen.length == count: break
    return chosen   // unique, no romaji collision with correct
```
For `ROMAJI_TO_KANA` questions, the same candidate selection runs; displayed options are kana glyphs, prompt is the correct kana's romaji/label.

**F — Validating an answer**
```
function submitAnswer(question, selectedOptionId):
    return selectedOptionId == question.correctId
```

**G — Updating progress**
```
function applyAnswer(kana, isCorrect):
    if isCorrect:
        kana.correctCount = min(50, kana.correctCount + 1)
    // incorrect: no change
```

**H — Applying the 50/50 cap**
Already enforced by `min(50, ...)` in G — `correctCount` can never exceed 50.

**I — Removing mastered characters from future quiz pools**
```
kana.mastered = (kana.correctCount == 50)
// eligiblePool() (step A) filters on mastered == false,
// so a newly-mastered kana is excluded starting with the NEXT call to eligiblePool,
// i.e. the next quiz (Study Again or a fresh Start Quiz) — never the current one.
```

**J — Calculating quiz results**
```
function computeResults(answeredQuestions):
    correct = count where isCorrect == true
    total = answeredQuestions.length
    newlyMastered = answeredQuestions
        .map(q => q.kana)
        .filter(k => k.correctCount == 50 && k.wasNotMasteredBeforeThisQuiz)
    return { correct, total, newlyMastered }
```

## 15. Data Model

Canonical, immutable kana metadata is kept strictly separate from mutable learner progress — they have different lifecycles (metadata might grow later per Section 29; progress persistence might change independently).

```ts
// Immutable canonical data (data/kana.ts)
interface KanaCharacter {
  id: string;            // e.g. "hira-ka", "kata-kya"
  script: "hiragana" | "katakana";
  kana: string;           // glyph(s)
  romaji: string;          // canonical Hepburn label (may be a descriptive label for special marks)
  category: "basic" | "dakuten" | "handakuten" | "small" | "yoon" | "special" | "archaic";
  row: string;             // consonant group, e.g. "k", "s", "g", "yoon-k"
  vowel: "a" | "i" | "u" | "e" | "o" | null;
}

// Mutable learner progress (persisted, keyed by KanaCharacter.id)
type ProgressMap = Record<string, number>;   // id -> correctCount (0-50)

interface LearnerProgressState {
  hiragana: ProgressMap;
  katakana: ProgressMap;
}

// Derived, never persisted directly
function isMastered(id: string, progress: ProgressMap): boolean {
  return progress[id] === 50;
}

// Ephemeral quiz state (not persisted — see Section 27 refresh-mid-quiz edge case)
interface QuizState {
  script: "hiragana" | "katakana";
  questions: QuizQuestion[];   // fixed at quiz start
  currentIndex: number;
  answers: QuizAnswerRecord[];  // grows as questions are answered
}

interface QuizQuestion {
  kanaId: string;
  direction: "KANA_TO_ROMAJI" | "ROMAJI_TO_KANA";
  optionIds: string[];   // 4 kana ids, shuffled
  correctId: string;
}

interface QuizAnswerRecord {
  kanaId: string;
  isCorrect: boolean;
}

// Theme state
type ThemePreference = "system" | "light" | "dark";

// Persistence envelope (Section 24)
interface PersistedStateV1 {
  version: 1;
  theme: ThemePreference;
  hiragana: ProgressMap;
  katakana: ProgressMap;
}
```

## 16. User Flows

**Flow A — First-time user opens MecchaKucchaYabai.** No stored state found → default state initializes (theme "system", all progress 0) → app renders directly into Hiragana Overview, no intro screen → grid shows all cards at 0%, Start Quiz enabled.

**Flow B — User studies Hiragana overview.** User is on the Hiragana tab, visually scans cards, hovers over a few (subtle lift, non-navigating). No click interaction occurs on the cards themselves.

**Flow C — User starts a 20-character Hiragana quiz.** User clicks Start Quiz → eligible pool computed (Algorithm A) → quiz length computed (Algorithm B) → 20 unique kana sampled (Algorithm C) → directions assigned (Algorithm D) → view transitions via Transition Panel into Quiz → Question 1/20 renders.

**Flow D — User answers correctly.** User clicks an answer → correct state renders immediately (icon + color), other options dim → `correctCount` +1 (capped at 50), percentage will reflect on next Overview view → user clicks Next → Transition Panel swaps to the next question.

**Flow E — User answers incorrectly.** User clicks a wrong option → incorrect state renders on the selected option, correct option is simultaneously highlighted, the reading is shown as text → `correctCount` unchanged → user clicks Next → advances.

**Flow F — A kana reaches 50/50.** A correct answer brings `correctCount` from 49 to 50 → `mastered` flips true immediately → the Glow Effect mastery pulse (Section 7) plays alongside normal correct feedback → quiz continues unaffected; this kana will not appear in future quizzes.

**Flow G — User completes a quiz.** Final question's feedback is dismissed → view transitions to Quiz Results (Transition Panel, same context, not a new route) → score, and any newly-mastered kana, are shown → user chooses Study Again or Back to Overview.

**Flow H — Fewer than 20 unmastered kana remain.** E.g. 12 eligible → quiz length = 12 → all 12 used, no repeats, no mastered kana reintroduced → quiz proceeds and completes identically to a 20-question quiz otherwise.

**Flow I — User masters every kana in a set.** The last unmastered kana in a script crosses 50/50 → eligible pool becomes 0 → on the next view of that script's Overview, Start Quiz is replaced by the All-Mastered indicator (Screen 4).

**Flow J — User changes light/dark mode.** User clicks the theme toggle → icon crossfades (sun↔moon) → theme class updates, `next-themes` persists the choice → all surfaces immediately reflect the new tokens.

**Flow K — User refreshes and progress persists.** Zustand's `persist` middleware rehydrates from `mkya:state:v1` on load → Overview renders with the same `correctCount`/`mastered` values and the same theme as before refresh.

**Flow L — User resets progress.** User clicks the low-emphasis "Reset Progress" control on, e.g., the Hiragana Overview → Dialog opens, naming the script and character count → user confirms → Hiragana's `correctCount` map clears to all-zero; Katakana and theme are untouched → dialog closes, Overview re-renders at 0% across all Hiragana cards.

## 17. Screen Specifications

### Screen 1 — Kana Study / Overview

- **Hierarchy:** Header (product mark, tabs, theme toggle) → script heading + mastery summary ("{mastered}/{total} mastered") → kana grid (each card: glyph, small secondary romaji, progress bar, percentage) → Start Quiz (or All-Mastered indicator) → low-emphasis Reset Progress link.
- **Layout:** header full width, sticky; content centered, max-width container; grid columns per Section 22.
- **Copy:** tab labels "Hiragana"/"Katakana"; "Start Quiz"; reset link "Reset Progress".
- **Interactions:** tab click switches script (Animated Background slide); card hover only, no click-through; Start Quiz → Flow C; Reset link → Screen 5.
- **State changes:** grid re-renders whenever the progress map changes (quiz answers, reset).
- **Motion Primitives:** Animated Background (tabs), Animated Group + In View (grid entrance), Sliding Number (per-card percentage).
- **Responsive:** per Section 22.
- **Light/Dark:** tokens per Section 9.

### Screen 2 — Active Quiz

- **Hierarchy:** quiz header (exit affordance + "Question X / N") → prompt (large kana or romaji) → 4-option answer grid → feedback area (post-answer) → Next control.
- **Layout:** centered single column; prompt vertically prominent; answers in a 2×2 grid (desktop).
- **Copy:** "Question {x} / {n}"; feedback "Correct" / "Incorrect — correct answer: {reading}"; "Next" (or "See Results" on the final question).
- **Interactions:** click an answer → immediate feedback (Section 20 states); click Next → Transition Panel to next question or to Results.
- **State changes:** `correctCount` update on submit (Algorithm F/G); mastery flip if applicable (triggers Glow Effect pulse).
- **Motion Primitives:** Transition Panel (question swap), Glow Effect (mastery pulse only).
- **Responsive:** 2×2 grid collapses to a stacked single column on mobile/small tablet.
- **Light/Dark:** `state.correct`/`state.incorrect` tokens.

### Screen 3 — Quiz Results

- **Hierarchy:** heading "Quiz Complete" → score (Animated Number count-up, "{correct}/{total}") → newly-mastered list (only if non-empty) → actions (Study Again, Back to Overview).
- **Layout:** centered, compact, single column, intentionally short — no scrolling required.
- **Copy:** "Quiz Complete"; "{correct} of {total} correct"; "Newly mastered: {glyphs}" (omitted if empty); "Study Again" / "Back to Overview".
- **Interactions:** Study Again → re-runs Flow C against the refreshed eligible pool; Back to Overview → Screen 1.
- **State changes:** none further — all progress was already committed per-answer during the quiz.
- **Motion Primitives:** Animated Number (score count-up), Transition Panel (entry from the last question).
- **Responsive:** stacks naturally at all breakpoints.
- **Light/Dark:** standard surface/text tokens.

### Screen 4 — All-Mastered State

- **Hierarchy:** identical to Screen 1, with the Start Quiz area replaced by a static completion indicator.
- **Layout:** identical to Screen 1 — the fully-mastered grid remains the primary content.
- **Copy:** "All {Script} Mastered" with a checkmark; no CTA in that slot (Reset Progress link remains available).
- **Interactions:** none beyond standard Overview interactions.
- **State changes:** purely derived (eligible pool == 0); no explicit transition.
- **Motion Primitives:** Text Effect (one-time reveal of the completion line only).
- **Responsive:** identical to Screen 1.
- **Light/Dark:** `state.mastered` token for the checkmark/text accent.

### Screen 5 — Reset Confirmation

- **Hierarchy:** Dialog overlay — title, body naming the script + character count, Cancel + Reset actions.
- **Layout:** centered modal, ~400px max width, scrim behind.
- **Copy:** "Reset {Script} Progress?"; "This clears mastery for all {N} {Script} characters and cannot be undone."; "Cancel" (default focus) / "Reset" (destructive).
- **Interactions:** Cancel, scrim click, or Escape → closes without changes; Reset → commits the clear (Section 24), closes.
- **State changes:** on confirm, that script's `correctCount` map resets to all-zero.
- **Motion Primitives:** Dialog (open/close transition).
- **Responsive:** stays centered and appropriately sized down to mobile (min 90vw on small screens).
- **Light/Dark:** `bg.surface`/`border.subtle` tokens; the Reset button uses the `state.incorrect` family color.

## 18. ASCII Wireframes

**Overview**
```
┌──────────────────────────────────────────────────────────────────┐
│  MecchaKucchaYabai        [ Hiragana ][ Katakana ]         ☾/☀   │
├──────────────────────────────────────────────────────────────────┤
│  Hiragana · 12 / 115 mastered                                     │
│                                                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ あ │ │ い │ │ う │ │ え │ │ お │ │ か │ │ き │ │ く │  ...       │
│  │▓▓░░│ │▓▓▓▓│ │░░░░│ │▓░░░│ │▓▓▓▓✓│ ...                          │
│  │ 40%│ │100%│ │ 0% │ │ 20%│ │100%│                               │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘          │
│  ... (remaining rows) ...                                          │
│                                                                     │
│                     [       Start Quiz       ]                    │
│                          Reset Progress                            │
└──────────────────────────────────────────────────────────────────┘
```

**Active Quiz**
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Exit                                    Question 4 / 20         │
│                                                                     │
│                              さ                                    │
│                                                                     │
│        ┌──────────────┐        ┌──────────────┐                   │
│        │      sa      │        │     shi      │                   │
│        └──────────────┘        └──────────────┘                   │
│        ┌──────────────┐        ┌──────────────┐                   │
│        │      su      │        │      se      │                   │
│        └──────────────┘        └──────────────┘                   │
│                                                                     │
│              (after answer) ✓ Correct — さ = sa                    │
│                                                                     │
│                          [   Next   ]                              │
└──────────────────────────────────────────────────────────────────┘
```

**Quiz Results**
```
┌──────────────────────────────────────────────────────────────────┐
│                          Quiz Complete                             │
│                                                                     │
│                          17 / 20 correct                           │
│                                                                     │
│                   Newly mastered:  め   り                         │
│                                                                     │
│         [   Study Again   ]      [   Back to Overview   ]          │
└──────────────────────────────────────────────────────────────────┘
```

**Reset Confirmation (modal, overlaid on Overview)**
```
              ┌───────────────────────────────────┐
              │  Reset Hiragana Progress?          │
              │                                     │
              │  This clears mastery for all 115   │
              │  Hiragana characters and cannot     │
              │  be undone.                         │
              │                                     │
              │        [ Cancel ]   [ Reset ]        │
              └───────────────────────────────────┘
```

## 19. Component Architecture

| Component | Purpose | Key State / Props | Interaction | Motion Primitives | Accessibility |
|---|---|---|---|---|---|
| `AppShell` | Top-level layout, header, theme provider | active script (from `KanaTabs`) | — | — | landmark regions (`header`, `main`) |
| `ThemeToggle` | Switch light/dark, persist choice | current theme (from `next-themes`) | click toggles | custom crossfade | `aria-label="Toggle theme"`, keyboard-operable button |
| `KanaTabs` | Switch active script | active script | click/keyboard select | Animated Background | `role="tablist"`, each tab `role="tab"`, `aria-selected` |
| `KanaGrid` | Render all kana for the active script | `KanaCharacter[]` + progress map | none (container) | Animated Group + In View | `role="list"` |
| `KanaCard` | Show one kana's glyph, romaji, and mastery | kana metadata, `correctCount` | hover-only (non-navigating) | hover: custom scale/lift | `aria-label` with glyph + romaji + percentage (romaji is also visible on-screen, not just in the label — see Section 5) |
| `KanaProgressBar` | Visualize mastery fraction | `correctCount`, `mastered` | none | custom width transition + Sliding Number | conveyed via `aria-label`, not color alone |
| `StartQuizButton` | Launch a quiz for the active script | eligible count | click → Flow C | — | disabled state clearly labeled when 0 eligible |
| `QuizView` | Own quiz state machine | `QuizState` | orchestrates child components | Transition Panel between questions | `aria-live="polite"` region for feedback announcements |
| `QuizHeader` | Progress-through-quiz indicator | current index, total | exit control | — | — |
| `QuizPrompt` | Show the current question's prompt | kana or romaji, direction | none | — | prompt text sized for legibility |
| `AnswerGrid` / `AnswerOption` | Render 4 choices, handle selection | options, selected/correct/incorrect state | click submits (Algorithm F) | — | real `<button>`s, `role="radiogroup"`/`radio"` pattern, visible focus |
| `QuizFeedback` | Show correct/incorrect + reading | `isCorrect`, correct reading | Next click advances | Glow Effect (mastery only) | icon + text, never color alone |
| `QuizResults` | Summarize a completed quiz | score, newly-mastered list | Study Again / Back to Overview | Animated Number | heading hierarchy, focus moved to heading on entry |
| `MasteryIndicator` | Checkmark + "mastered" treatment on a card | `mastered` boolean | none | — | `aria-label` includes "mastered" |
| `ResetProgressDialog` | Confirm destructive reset | target script, character count | Cancel/Reset/Escape/scrim | Dialog | focus trap, `role="alertdialog"`, focus returns to trigger on close |

## 20. Interaction + Motion Specification

Summarized from Sections 7 and 9; restated here as the single reference for feedback states:

- **Unanswered:** equal visual weight across the 4 options; hover shows a subtle border/background darken.
- **Selected → Correct:** `state.correct` background/border + check icon on the chosen option; other options dim to reduced opacity and become non-interactive.
- **Selected → Incorrect:** `state.incorrect` styling on the chosen option + x icon; the correct option is simultaneously highlighted with `state.correct` styling; other two dim.
- **Reveal:** the canonical reading (e.g. "し = shi") is always shown as text, regardless of correct/incorrect.
- **Advance:** no auto-advance timer — the user always clicks Next at their own pace; Transition Panel animates the swap.
- **Mastery moment:** the single-shot Glow Effect pulse layers on top of the normal Correct state, only when `correctCount` just hit 50.

## 21. Light/Dark Theme Specification

Implemented via `next-themes` (system/light/dark) + Tailwind's `class` dark-mode strategy, backed by the tokens in Section 9. Every token in Section 9's color table has both a light and dark value; no component may hardcode a color outside that token set. The theme toggle animates only the sun/moon icon (Section 7) — surface/text/border colors transition with a short (150ms) crossfade to avoid a jarring flash, respecting `prefers-reduced-motion` (instant swap instead of crossfade when reduced motion is on).

## 22. Responsive Behavior

- **Large desktop (≥1440px):** kana grid up to a max content width (~1200px, centered), 8–10 grid columns, quiz answers in a comfortable 2×2 grid.
- **Laptop (1024–1439px):** same layout, tighter gutters (48px), 6–8 grid columns.
- **Tablet (768–1023px):** 4–5 grid columns; quiz answers may narrow to a single column in portrait; the Toolbar Dynamic pattern (Section 7) may house theme toggle + reset if header space is tight.
- **Mobile (<768px):** 3 grid columns minimum (never fewer, to avoid oversized cards that read as a children's app — kana legibility comes from font-size, not card size); quiz answers stack single-column with ≥44×44px tap targets; header collapses to product mark + tabs + a compact utility control.

The desktop layout is the source of truth; smaller breakpoints reduce columns and gutters, never restructure the IA.

## 23. Accessibility

- Full keyboard navigation across tabs, Start Quiz, all 4 answer options, Next, theme toggle, and the Reset dialog.
- Visible focus rings on every interactive element (2px, `accent` color, sufficient contrast in both themes) — never suppressed.
- Answer options are real `<button>` elements (or a `radiogroup`/`radio` composite), never styled `<div>`s.
- WCAG AA contrast for all text and state colors, in both themes.
- Correct/incorrect state always pairs icon + text with color — never color alone.
- Each kana card and quiz option carries an `aria-label` including glyph, romaji/label, and mastery percentage where relevant.
- `prefers-reduced-motion` is respected globally per Section 9.

## 24. Local Persistence

A single `localStorage` key holds one versioned JSON blob, `mkya:state:v1`:

```json
{
  "version": 1,
  "theme": "system",
  "hiragana": { "hira-ka": 12, "hira-shi": 50 },
  "katakana": { "kata-ka": 3 }
}
```

Only `correctCount` per kana `id` is persisted — `mastered` is always derived, never stored, to avoid drift. On load: parse → validate shape (correct top-level keys, integer counts 0–50, ids matching the known dataset) → if validation fails anywhere, discard and initialize fresh default state (0 everywhere, theme "system") rather than crash or partially trust corrupted data. If Zustand is the chosen state library (Section 25), its `persist` middleware implements this pattern natively (versioning + a `migrate` hook) and is the recommended implementation path over hand-rolled serialization.

**Reset Progress** clears exactly one script's map (Section 13/17, Screen 5) back to all-zero on confirmed dialog action; the other script and the theme preference are untouched. See Section 30 for why "per-script" is flagged as a default rather than a fully locked decision.

## 25. Recommended Technical Architecture

- **Framework:** Next.js (App Router) + TypeScript. Motion Primitives ships as copy-in React/TypeScript source built around Next.js + Tailwind conventions, and the brief states Motion Primitives is already installed — staying on Next.js is the path of least friction for consuming and modifying that source directly, as the brief explicitly permits.
- **Styling:** Tailwind CSS, matching Motion Primitives' own approach; design tokens (Section 9) map to a small Tailwind theme extension rather than a separate CSS-in-JS system.
- **Animation:** the `motion` package — the library Motion Primitives itself is built on. No second animation library.
- **State management:** Zustand with the `persist` middleware for the local-storage layer (Section 24). The app's global state is small and shape-stable (two progress maps + theme); Zustand avoids Context-provider boilerplate and re-render fan-out, and its persist middleware directly implements the versioned-blob + corrupted-data-fallback pattern this document requires.
- **Theme mechanism:** `next-themes` for light/dark/system with localStorage persistence, paired with Tailwind's `class` strategy — avoids flash-of-wrong-theme and is the standard pairing with Next.js + Tailwind.

## 26. Proposed Project Structure

```
src/
  app/                     # Next.js routes (single-page shell; tabs are client state, not routes)
  components/
    ui/                    # Reusable, generic UI primitives (Button, Dialog wrapper, etc.)
    motion/                # Motion Primitives-derived components, copied in and restyled per Section 7
  features/
    kana/
      KanaTabs.tsx
      KanaGrid.tsx
      KanaCard.tsx
      KanaProgressBar.tsx
      ResetProgressDialog.tsx
    quiz/
      QuizView.tsx
      QuizHeader.tsx
      QuizPrompt.tsx
      AnswerGrid.tsx
      AnswerOption.tsx
      QuizFeedback.tsx
      QuizResults.tsx
      quizEngine.ts        # pure functions: Algorithms A-J from Section 14
  data/
    kana.ts                # canonical dataset from Section 11 (immutable)
  hooks/
    useKanaProgress.ts      # Zustand store hook (progress + theme persistence)
  lib/
    persistence.ts          # storage schema, validation, migration (Section 24)
  styles/
    tokens.css / tailwind.config.ts
  types/
    kana.ts                 # KanaCharacter, QuizQuestion, QuizResult, etc. (Section 15)
```

Rationale: `data/kana.ts` (immutable canonical metadata) is kept strictly separate from `hooks/useKanaProgress.ts` (mutable learner progress) because they have different lifecycles — the canonical dataset might grow later (Section 29) without touching persistence logic, and persistence logic might change (e.g. IndexedDB) without touching the dataset. `features/quiz/quizEngine.ts` is deliberately pure/framework-free so Section 14's algorithm can be unit-tested without rendering anything.

## 27. Edge Cases

| Edge case | Behavior |
|---|---|
| First visit, zero progress | All kana 0/50; Overview renders normally; Start Quiz enabled (pool = full script) |
| 1–19 eligible kana remaining | Quiz length = eligible count |
| Exactly 20 eligible kana | Quiz length = 20, uses all of them |
| More than 20 eligible kana | Quiz length = 20, randomly sampled |
| Kana reaches mastery mid-quiz | Counter updates immediately; quiz continues unaffected to completion |
| All kana in a script mastered | All-Mastered state (Screen 4); Start Quiz disabled |
| Corrupted/missing localStorage | Validation fails → fresh default state, no crash |
| User resets progress | Dialog confirmation required; scoped to one script |
| Refresh during an active quiz | In-progress quiz state is not persisted; refresh returns the user to that script's Overview. Already-submitted answers before the refresh are already counted (each answer commits to the store immediately per Algorithm G); the partially-completed quiz itself is discarded. Flagged in Section 30. |
| Theme persistence | Persisted via `next-themes` + localStorage, respected before first paint |
| Reduced motion | All transient effects respect `prefers-reduced-motion` (Section 9) |
| Duplicate quiz choices | Prevented structurally by the distractor algorithm's dedup + romaji-collision exclusion (Section 14E) |
| Combined/small kana display | Rendered identically to basic kana in grid and quiz; category is metadata only |
| ー behavior | Symbol-recognition entry, not a phonetic quiz item; own mastery counter |
| Archaic kana (ゐゑヰヱ) | Included exactly like basic kana, no special UI treatment |
| Similar-romanization kana (じ/ぢ, ず/づ) | Never co-appear as options in the same question (Section 14E) |
| Plausible distractor generation | Row/vowel-tiered selection, falling back to full-pool random (Section 14E) |

## 28. MVP Acceptance Criteria

**Data**
- [ ] All 115 hiragana and 117 katakana entries from Section 11 exist with correct `id`, `romaji`/label, `category`, `row`, `vowel`.
- [ ] じ/ぢ and ず/づ romaji collisions are represented as specified, not "fixed" with non-standard spellings.

**Overview**
- [ ] Hiragana and Katakana tabs switch views via Animated Background highlight.
- [ ] Every kana card shows the glyph, an animated progress bar, and a Sliding-Number percentage.
- [ ] Mastered kana (50/50) show 100% + checkmark and remain visible.
- [ ] Kana cards are not clickable/navigable; they have a subtle hover-only affordance.

**Quiz**
- [ ] Start Quiz only appears when ≥1 unmastered kana exists for that script.
- [ ] Quiz length = min(20, eligible count); no duplicate kana within a quiz.
- [ ] Mastered kana are never selected.
- [ ] Both directions appear per Section 14D's balanced distribution.
- [ ] Every question has exactly 4 unique, non-colliding options.
- [ ] Feedback (correct/incorrect + correct reading) appears immediately on selection, never at quiz end.

**Mastery**
- [ ] Correct answers add exactly 1 to `correctCount`, capped at 50.
- [ ] Incorrect answers never change `correctCount`.
- [ ] 50/50 immediately flips `mastered = true`, even mid-quiz.
- [ ] Mastered kana are excluded from the eligible pool of the *next* quiz onward.

**Persistence**
- [ ] Progress and theme survive a full page refresh.
- [ ] Corrupted localStorage falls back to default state without crashing.
- [ ] Reset Progress clears only the confirmed script's `correctCount` map.

**Theme**
- [ ] Light and dark modes both meet the Section 9 tokens and WCAG AA contrast.
- [ ] Theme toggle animates the icon crossfade and persists the choice.

**Responsiveness**
- [ ] Desktop layout matches Section 22's large-desktop/laptop specs without visual compromise.
- [ ] Tablet and mobile layouts follow Section 22 without becoming an "oversized mobile app."

**Motion**
- [ ] Every Motion Primitives usage in Section 7's table is present and scoped exactly as described (no additional decorative motion introduced).
- [ ] `prefers-reduced-motion` suppresses all transient/entrance effects app-wide.

## 29. Future-Proofing Notes

The MVP is kana-only, and nothing below should be built now — these are architectural notes to avoid needlessly painful future extension:

- `KanaCharacter.script` is already a discriminated field; adding a future `contentType` dimension (kanji, vocabulary) would extend the dataset shape rather than replace it.
- `ProgressMap` is a flat `id → correctCount` record with no kana-specific logic baked in — the same shape would work for any future quizzable content type keyed by id.
- `quizEngine.ts` (Section 14/26) operates on generic `{ id, prompt, answer, row, vowel }`-shaped candidates, not hardcoded kana glyphs — a future quiz over a different content type could reuse Algorithms A–J largely unchanged.
- The persistence envelope is versioned (`version: 1`) specifically so a future schema change has a defined migration path rather than requiring a breaking reset of everyone's progress.
- The IA (Section 10) is flat by design; nothing about the Hiragana/Katakana tab pattern prevents adding a sibling top-level tab later without restructuring what exists.

## 30. Open Questions

These are the specific points this document deliberately did **not** silently decide. Each includes the recommended default actually assumed elsewhere in this document, so implementation is not blocked — but these are the items most likely to warrant a quick confirmation before or during the corresponding implementation task.

1. **Reset Progress scope.** Defaults to **per-script reset** (resetting Hiragana does not touch Katakana, and vice versa) — matches the tab-scoped mental model and minimizes accidental blast radius. An alternative would be a single global "Reset All Progress" action. If a single global reset is preferred, Section 24/17 (Screen 5) and Appendix A Task 10 should be updated accordingly.
2. **Small-kana and special-mark romaji collisions.** Small vowels (ぁぃぅぇぉ) and small ya/yu/yo (ゃゅょ) intentionally share literal romaji text with their full-size counterparts (real Hepburn convention), relying on the distractor-exclusion rule (Section 14E) to prevent them co-appearing in one question. っ/ッ and ー use descriptive labels instead of phonetic romaji (Section 11). This is a reasonable default but is a genuine judgment call about how to quiz non-phonemic/collision-prone entries — confirm before Appendix A Task 2 if a different treatment (e.g. excluding these from the quiz pool entirely, testing recognition only) is preferred.
3. **Refresh mid-quiz.** Defaults to *not* persisting in-progress quiz state — a refresh mid-quiz returns the user to Overview, with only already-submitted answers counted. If quiz-resume-after-refresh is actually desired, that is additional scope beyond what was specified and should be confirmed before Appendix A Task 8.

---

## Appendix A — Implementation Task Queue (for the implementing coding agent)

This section exists specifically so a coding agent (e.g. Claude Code) can consume this document autonomously: read it once, fully, then execute the tasks below **in order**, treating each as a self-contained unit of work with its own definition of done. After finishing a task, verify its "Done when" criteria against the referenced sections above, mark it complete in your own task list, and proceed immediately to the next task without waiting for manual confirmation — unless you hit one of the Section 30 open questions, in which case stop and surface it before continuing past that specific task.

1. **Project scaffolding** — confirm the existing Next.js + TypeScript + Tailwind + Motion Primitives setup; add Zustand and `next-themes`; create the folder structure from Section 26. *Done when:* the project builds and runs an empty shell.
2. **Types & canonical dataset** — implement `types/kana.ts` and `data/kana.ts` per Section 11 in full (all 115/117 entries). *Done when:* dataset totals and spot-checked romaji match Section 11 exactly, including special/archaic entries. (Confirm Open Question #2 before finalizing the special-mark entries if in doubt.)
3. **Persistence layer** — implement `lib/persistence.ts` and the Zustand store (`hooks/useKanaProgress.ts`) per Section 24. *Done when:* a unit test can write/read/corrupt the store and observe correct fallback behavior.
4. **Theme system** — wire `next-themes`, implement the theme toggle (custom icon crossfade per Section 7), verify persistence and no flash-of-wrong-theme. *Done when:* toggling persists across refresh in both directions.
5. **App shell & tabs** — build the header, `KanaTabs` with Animated Background, and top-level layout/IA from Section 10. *Done when:* switching tabs updates the visible script with the correct highlight animation.
6. **Kana Overview screen** — build `KanaGrid`/`KanaCard`/`KanaProgressBar` per Sections 17 (Screen 1) and 20's states (normal/hover/partial/mastered, both themes), with Animated Group + In View entrance. *Done when:* Section 28's Overview acceptance criteria all pass for both scripts.
7. **Quiz engine (pure logic)** — implement `features/quiz/quizEngine.ts` per Section 14's Algorithms A–J. *Done when:* the module is fully unit-testable without any UI and covers Section 27's edge cases (0/1–19/20/>20 eligible; romaji-collision exclusion; no duplicate options).
8. **Quiz UI** — build `QuizHeader`, `QuizPrompt`, `AnswerGrid`/`AnswerOption`, `QuizFeedback` per Section 17 (Screen 2) and Section 20. *Done when:* Section 28's Quiz acceptance criteria all pass. (Confirm Open Question #3 before finalizing refresh-mid-quiz behavior if in doubt.)
9. **Results & All-Mastered states** — build `QuizResults` (Screen 3) and the All-Mastered Overview variant (Screen 4). *Done when:* both states render correctly, including the zero-remaining-kana path straight from Overview to All-Mastered.
10. **Reset Progress flow** — build `ResetProgressDialog` using Dialog, scoped per Section 24/Screen 5 (pending confirmation of Open Question #1). *Done when:* reset clears exactly the intended script's progress and nothing else, behind a confirmation step that cannot be triggered accidentally.
11. **Responsive pass** — apply Section 22's breakpoint behavior across all screens, including the mobile Toolbar Dynamic utility bar. *Done when:* Section 28's Responsiveness criteria pass at all four breakpoints.
12. **Accessibility pass** — apply Section 23 across all interactive elements; verify with keyboard-only navigation and a screen reader spot-check. *Done when:* every Section 23 bullet is verifiably true.
13. **Motion & reduced-motion pass** — verify every row of Section 7's Component Map is implemented exactly as scoped (no extra decorative motion anywhere), and that `prefers-reduced-motion` suppresses transient effects per Section 9. *Done when:* Section 28's Motion criteria pass.
14. **Final QA against Section 28** — walk every checkbox in Section 28 end-to-end. *Done when:* all boxes are genuinely verified, not assumed.

Tasks 2–3 can run in parallel once Task 1 is done; Task 7 can be built and unit-tested in parallel with Tasks 5–6 since it has no UI dependency. All other tasks are sequential as listed.