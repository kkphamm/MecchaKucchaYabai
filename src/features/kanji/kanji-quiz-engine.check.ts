// Standalone runnable check (mirrors features/quiz/quiz-engine.check.ts):
//   node --experimental-strip-types src/features/kanji/kanji-quiz-engine.check.ts
import assert from "node:assert/strict";
import { N5_KANJI } from "../../data/kanji.ts";
import {
  eligiblePool,
  quizLength,
  buildQuiz,
  generateDistractors,
  computeResults,
  applyAnswer,
} from "./kanji-quiz-engine.ts";
import type { ProgressMap } from "../../types/kana.ts";

const poolSize = N5_KANJI.length;

// eligiblePool
assert.equal(eligiblePool(N5_KANJI, {}).length, poolSize, "empty progress -> full pool");
const allMastered: ProgressMap = Object.fromEntries(N5_KANJI.map((k) => [k.id, 50]));
assert.equal(eligiblePool(N5_KANJI, allMastered).length, 0, "all mastered -> empty pool");

// quizLength
assert.equal(quizLength(0), 0);
assert.equal(quizLength(5), 5);
assert.equal(quizLength(20), 20);
assert.equal(quizLength(25), 20);

// buildQuiz — full pool
const fullQuiz = buildQuiz(N5_KANJI, {});
assert.equal(fullQuiz.length, Math.min(20, poolSize), "quiz length capped at 20");
assert.equal(new Set(fullQuiz.map((q) => q.kanjiId)).size, fullQuiz.length, "no duplicate kanji in quiz");
for (const q of fullQuiz) {
  assert.ok(q.optionIds.length >= 1 && q.optionIds.length <= 4, "1-4 options per question");
  assert.equal(new Set(q.optionIds).size, q.optionIds.length, "options are unique");
  assert.ok(q.optionIds.includes(q.correctId), "correct answer is among options");
}

// buildQuiz — small pool
const smallProgress: ProgressMap = Object.fromEntries(
  N5_KANJI.slice(3).map((k) => [k.id, 50])
);
const smallQuiz = buildQuiz(N5_KANJI, smallProgress);
assert.equal(smallQuiz.length, 3, "quiz length matches small eligible pool");

// buildQuiz — zero eligible
assert.equal(buildQuiz(N5_KANJI, allMastered).length, 0, "zero eligible -> empty quiz");

// generateDistractors never includes a meaning-collision with the correct kanji
const target = N5_KANJI[0];
for (let i = 0; i < 20; i++) {
  const distractors = generateDistractors(target, N5_KANJI, 3);
  const targetMeanings = new Set(target.meanings);
  assert.ok(
    distractors.every((d) => !d.meanings.some((m) => targetMeanings.has(m))),
    "no meaning-collision distractor alongside target kanji"
  );
}

// applyAnswer cap
assert.equal(applyAnswer(49, true), 50);
assert.equal(applyAnswer(50, true), 50, "capped at 50");
assert.equal(applyAnswer(10, false), 10, "incorrect never changes count");

// computeResults newly-mastered detection
const idA = N5_KANJI[0].id;
const idB = N5_KANJI[1].id;
const before: ProgressMap = { [idA]: 49, [idB]: 10 };
const after: ProgressMap = { [idA]: 50, [idB]: 11 };
const lookup = new Map(N5_KANJI.map((k) => [k.id, k]));
const results = computeResults(
  [
    { kanjiId: idA, isCorrect: true },
    { kanjiId: idB, isCorrect: true },
  ],
  before,
  after,
  lookup
);
assert.equal(results.correct, 2);
assert.equal(results.total, 2);
assert.equal(results.newlyMastered.length, 1);
assert.equal(results.newlyMastered[0].id, idA);

console.log("kanji-quiz-engine self-check: all assertions passed");
