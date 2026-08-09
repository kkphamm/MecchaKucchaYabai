"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TransitionPanel } from "@/components/core/transition-panel";
import { useKanjiProgress, progressForLevel } from "@/hooks/use-kanji-progress";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { QuizHeader } from "@/features/quiz/quiz-header";
import { KanjiQuizPrompt } from "@/features/kanji/kanji-quiz-prompt";
import { KanjiAnswerGrid } from "@/features/kanji/kanji-answer-grid";
import { KanjiQuizFeedback } from "@/features/kanji/kanji-quiz-feedback";
import { buildQuiz, computeResults, submitAnswer } from "@/features/kanji/kanji-quiz-engine";
import type { KanjiCharacter, JlptLevel, KanjiQuizAnswerRecord } from "@/types/kanji";
import type { ProgressMap } from "@/types/kana";

export interface KanjiQuizResults {
  correct: number;
  total: number;
  newlyMastered: KanjiCharacter[];
}

export function KanjiQuizView({
  level,
  kanjiList,
  onExit,
  onComplete,
}: {
  level: JlptLevel;
  kanjiList: KanjiCharacter[];
  onExit: () => void;
  onComplete: (results: KanjiQuizResults) => void;
}) {
  const progress = useKanjiProgress((s) => progressForLevel(s, level));
  const markCorrect = useKanjiProgress((s) => s.markCorrect);
  const reducedMotion = useReducedMotion();

  const [startProgress] = useState<ProgressMap>(() => ({ ...progress }));
  const [questions] = useState(() => buildQuiz(kanjiList, progress));
  const lookup = useMemo(() => new Map(kanjiList.map((k) => [k.id, k])), [kanjiList]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<KanjiQuizAnswerRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justMastered, setJustMastered] = useState(false);

  const question = questions[currentIndex];
  const answered = selectedId !== null;
  const options = question.optionIds.map((id) => lookup.get(id)!);

  function handleSelect(optionId: string) {
    if (answered) return;
    const correct = submitAnswer(question, optionId);
    setSelectedId(optionId);
    setAnswers((prev) => [...prev, { kanjiId: question.kanjiId, isCorrect: correct }]);
    if (correct) {
      const before = progress[question.kanjiId] ?? 0;
      markCorrect(level, question.kanjiId);
      if (before === 49) setJustMastered(true);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setJustMastered(false);
      return;
    }
    const finalProgress = progressForLevel(useKanjiProgress.getState(), level);
    const results = computeResults(answers, startProgress, finalProgress, lookup);
    onComplete(results);
  }

  return (
    <div className="flex flex-col gap-10">
      <QuizHeader current={currentIndex + 1} total={questions.length} onExit={onExit} />
      <TransitionPanel
        activeIndex={currentIndex}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: "easeInOut" }}
        variants={{
          enter: { opacity: 0, y: reducedMotion ? 0 : 8 },
          center: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: reducedMotion ? 0 : -8 },
        }}
      >
        {questions.map((q, i) =>
          i === currentIndex ? (
            <div key={i} className="flex flex-col items-center gap-8">
              <KanjiQuizPrompt kanji={lookup.get(q.kanjiId)!} />
              <KanjiAnswerGrid
                options={options}
                correctId={q.correctId}
                selectedId={selectedId}
                answered={answered}
                onSelect={handleSelect}
              />
              {answered && (
                <>
                  <KanjiQuizFeedback
                    isCorrect={answers[answers.length - 1].isCorrect}
                    kanji={lookup.get(q.kanjiId)!}
                    justMastered={justMastered}
                  />
                  <Button onClick={handleNext} size="lg" className="px-8">
                    {currentIndex + 1 === questions.length ? "See Results" : "Next"}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div key={i} />
          )
        )}
      </TransitionPanel>
    </div>
  );
}
