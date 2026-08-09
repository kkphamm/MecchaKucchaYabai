// Standalone runnable check for the quiz engine (Section 14, Algorithms A-J).
// Uses relative imports (not the "@/" alias) so it runs directly under Node's
// type-stripping, no bundler/test framework required:
//   node --experimental-strip-types src/features/quiz/quiz-engine.check.ts
import assert from "node:assert/strict";
import { HIRAGANA } from "../../data/kana.ts";
import {
  eligiblePool,
  quizLength,
  buildQuiz,
  generateDistractors,
  computeResults,
  applyAnswer,
} from "./quiz-engine.ts";
import type { ProgressMap } from "../../types/kana.ts";

// A — eligiblePool
assert.equal(eligiblePool(HIRAGANA, {}).length, 115, "empty progress -> full pool");
const allMastered: ProgressMap = Object.fromEntries(HIRAGANA.map((k) => [k.id, 50]));
assert.equal(eligiblePool(HIRAGANA, allMastered).length, 0, "all mastered -> empty pool");

// B — quizLength
assert.equal(quizLength(0), 0);
assert.equal(quizLength(5), 5);
assert.equal(quizLength(20), 20);
assert.equal(quizLength(25), 20);

// buildQuiz — full pool
const fullQuiz = buildQuiz(HIRAGANA, {});
assert.equal(fullQuiz.length, 20, "full pool -> 20 questions");
assert.equal(new Set(fullQuiz.map((q) => q.kanaId)).size, 20, "no duplicate kana in quiz");
for (const q of fullQuiz) {
  assert.equal(q.optionIds.length, 4, "4 options per question");
  assert.equal(new Set(q.optionIds).size, 4, "options are unique");
  assert.ok(q.optionIds.includes(q.correctId), "correct answer is among options");
}
const kanaToRomaji = fullQuiz.filter((q) => q.direction === "KANA_TO_ROMAJI").length;
const romajiToKana = fullQuiz.filter((q) => q.direction === "ROMAJI_TO_KANA").length;
assert.equal(kanaToRomaji, 10, "balanced directions (kana->romaji half)");
assert.equal(romajiToKana, 10, "balanced directions (romaji->kana half)");

// buildQuiz — small pool (<20 eligible)
const smallProgress: ProgressMap = Object.fromEntries(
  HIRAGANA.slice(3).map((k) => [k.id, 50])
);
const smallQuiz = buildQuiz(HIRAGANA, smallProgress);
assert.equal(smallQuiz.length, 3, "quiz length matches small eligible pool");

// buildQuiz — zero eligible
assert.equal(buildQuiz(HIRAGANA, allMastered).length, 0, "zero eligible -> empty quiz");

// E — romaji-collision exclusion (じ vs ぢ both romanize to "ji")
const ji = HIRAGANA.find((k) => k.id === "hira-zi")!;
assert.equal(ji.romaji, "ji");
for (let i = 0; i < 20; i++) {
  const distractors = generateDistractors(ji, HIRAGANA, 3);
  assert.ok(
    distractors.every((d) => d.romaji !== "ji"),
    "no romaji-collision distractor alongside じ"
  );
  assert.equal(distractors.length, 3, "always fills 3 distractors from a 115-entry pool");
}

// G/H — applyAnswer cap
assert.equal(applyAnswer(49, true), 50);
assert.equal(applyAnswer(50, true), 50, "capped at 50");
assert.equal(applyAnswer(10, false), 10, "incorrect never changes count");

// J — computeResults newly-mastered detection
const before: ProgressMap = { "hira-a": 49, "hira-i": 10 };
const after: ProgressMap = { "hira-a": 50, "hira-i": 11 };
const lookup = new Map(HIRAGANA.map((k) => [k.id, k]));
const results = computeResults(
  [
    { kanaId: "hira-a", isCorrect: true },
    { kanaId: "hira-i", isCorrect: true },
  ],
  before,
  after,
  lookup
);
assert.equal(results.correct, 2);
assert.equal(results.total, 2);
assert.equal(results.newlyMastered.length, 1);
assert.equal(results.newlyMastered[0].id, "hira-a");

console.log("quiz-engine self-check: all assertions passed");
