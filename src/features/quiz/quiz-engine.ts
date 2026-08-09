import type { Direction, KanaCharacter, ProgressMap, QuizQuestion } from "@/types/kana";

// Pure, framework-free implementation of design.md Section 14, Algorithms A-J.
// No React, no store, no I/O — testable by calling functions directly.

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// A — eligible characters (not yet mastered)
export function eligiblePool(scriptKana: KanaCharacter[], progress: ProgressMap): KanaCharacter[] {
  return scriptKana.filter((k) => (progress[k.id] ?? 0) !== 50);
}

// B — quiz length
export function quizLength(poolSize: number): number {
  return Math.min(20, poolSize);
}

// C — select unique random characters
export function selectQuestionKana(pool: KanaCharacter[], n: number): KanaCharacter[] {
  return shuffle(pool).slice(0, n);
}

// D — balanced direction assignment
export function assignDirections(n: number): Direction[] {
  const half = Math.ceil(n / 2);
  const directions: Direction[] = [
    ...Array.from({ length: half }, () => "KANA_TO_ROMAJI" as const),
    ...Array.from({ length: n - half }, () => "ROMAJI_TO_KANA" as const),
  ];
  return shuffle(directions);
}

// E — distractor generation: same row, then same vowel, then anything else;
// always excludes romaji collisions (じ/ぢ, ず/づ) with the correct answer.
export function generateDistractors(
  correct: KanaCharacter,
  scriptKana: KanaCharacter[],
  count = 3
): KanaCharacter[] {
  const candidates = scriptKana.filter(
    (k) => k.id !== correct.id && k.romaji !== correct.romaji
  );
  const tier1 = shuffle(candidates.filter((k) => k.row === correct.row));
  const tier2 = shuffle(candidates.filter((k) => k.vowel === correct.vowel));
  const tier3 = shuffle(candidates);

  const chosen: KanaCharacter[] = [];
  const seen = new Set<string>();
  for (const tier of [tier1, tier2, tier3]) {
    for (const kana of tier) {
      if (chosen.length >= count) break;
      if (seen.has(kana.id)) continue;
      seen.add(kana.id);
      chosen.push(kana);
    }
    if (chosen.length >= count) break;
  }
  return chosen;
}

// Builds a full quiz: combines C, D, and E into the question list.
export function buildQuiz(scriptKana: KanaCharacter[], progress: ProgressMap): QuizQuestion[] {
  const pool = eligiblePool(scriptKana, progress);
  const n = quizLength(pool.length);
  const selected = selectQuestionKana(pool, n);
  const directions = assignDirections(n);

  return selected.map((kana, i) => {
    const distractors = generateDistractors(kana, scriptKana, 3);
    const optionIds = shuffle([kana.id, ...distractors.map((d) => d.id)]);
    return {
      kanaId: kana.id,
      direction: directions[i],
      optionIds,
      correctId: kana.id,
    };
  });
}

// F — validate an answer
export function submitAnswer(question: QuizQuestion, selectedOptionId: string): boolean {
  return selectedOptionId === question.correctId;
}

// G/H — apply an answer to a correctCount, capped at 50
export function applyAnswer(correctCount: number, isCorrect: boolean): number {
  return isCorrect ? Math.min(50, correctCount + 1) : correctCount;
}

// J — quiz results, including which kana were newly mastered by this quiz
export function computeResults(
  answeredQuestions: { kanaId: string; isCorrect: boolean }[],
  progressBeforeQuiz: ProgressMap,
  progressAfterQuiz: ProgressMap,
  kanaLookup: Map<string, KanaCharacter>
): { correct: number; total: number; newlyMastered: KanaCharacter[] } {
  const correct = answeredQuestions.filter((q) => q.isCorrect).length;
  const total = answeredQuestions.length;
  const newlyMastered = answeredQuestions
    .map((q) => kanaLookup.get(q.kanaId))
    .filter(
      (kana): kana is KanaCharacter =>
        !!kana &&
        (progressBeforeQuiz[kana.id] ?? 0) !== 50 &&
        (progressAfterQuiz[kana.id] ?? 0) === 50
    )
    .filter((kana, index, arr) => arr.findIndex((k) => k.id === kana.id) === index);
  return { correct, total, newlyMastered };
}
