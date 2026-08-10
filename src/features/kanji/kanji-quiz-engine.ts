import type { KanjiCharacter, KanjiQuizQuestion } from "@/types/kanji";
import { MASTERY_THRESHOLD, type ProgressMap } from "@/types/kana";

// Pure, framework-free — mirrors features/quiz/quiz-engine.ts, but the
// kanji quiz only ever asks one direction: kanji -> meaning.

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function eligiblePool(list: KanjiCharacter[], progress: ProgressMap): KanjiCharacter[] {
  return list.filter((k) => (progress[k.id] ?? 0) !== MASTERY_THRESHOLD);
}

export function quizLength(poolSize: number): number {
  return Math.min(20, poolSize);
}

export function selectQuestionKanji(pool: KanjiCharacter[], n: number): KanjiCharacter[] {
  return shuffle(pool).slice(0, n);
}

// Distractors: exclude any kanji sharing a meaning with the correct answer
// (avoids two "valid" options), fill the rest randomly.
export function generateDistractors(
  correct: KanjiCharacter,
  list: KanjiCharacter[],
  count = 3
): KanjiCharacter[] {
  const correctMeanings = new Set(correct.meanings);
  const candidates = shuffle(
    list.filter((k) => k.id !== correct.id && !k.meanings.some((m) => correctMeanings.has(m)))
  );
  return candidates.slice(0, count);
}

export function buildQuiz(list: KanjiCharacter[], progress: ProgressMap): KanjiQuizQuestion[] {
  const pool = eligiblePool(list, progress);
  const n = quizLength(pool.length);
  const selected = selectQuestionKanji(pool, n);

  return selected.map((kanji) => {
    const distractors = generateDistractors(kanji, list, 3);
    const optionIds = shuffle([kanji.id, ...distractors.map((d) => d.id)]);
    return { kanjiId: kanji.id, optionIds, correctId: kanji.id };
  });
}

export function submitAnswer(question: KanjiQuizQuestion, selectedOptionId: string): boolean {
  return selectedOptionId === question.correctId;
}

export function applyAnswer(correctCount: number, isCorrect: boolean): number {
  return isCorrect ? Math.min(MASTERY_THRESHOLD, correctCount + 1) : correctCount;
}

export function computeResults(
  answeredQuestions: { kanjiId: string; isCorrect: boolean }[],
  progressBeforeQuiz: ProgressMap,
  progressAfterQuiz: ProgressMap,
  lookup: Map<string, KanjiCharacter>
): { correct: number; total: number; newlyMastered: KanjiCharacter[] } {
  const correct = answeredQuestions.filter((q) => q.isCorrect).length;
  const total = answeredQuestions.length;
  const newlyMastered = answeredQuestions
    .map((q) => lookup.get(q.kanjiId))
    .filter(
      (k): k is KanjiCharacter =>
        !!k &&
        (progressBeforeQuiz[k.id] ?? 0) !== MASTERY_THRESHOLD &&
        (progressAfterQuiz[k.id] ?? 0) === MASTERY_THRESHOLD
    )
    .filter((k, index, arr) => arr.findIndex((x) => x.id === k.id) === index);
  return { correct, total, newlyMastered };
}
